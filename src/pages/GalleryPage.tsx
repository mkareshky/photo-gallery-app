// src/pages/GalleryPage.tsx
import React, { useEffect, useState } from "react";
import { css } from "../styled-system/css";
import { usePhotoContext } from "../context/PhotoContext";
import { FilterPanel } from "../components/FilterPanel";
import { useDebounce } from "../hooks/useDebounce";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { usePhotoFilter } from "../hooks/usePhotoFilter";
import { PhotoList } from "../components/PhotoList";

const GalleryPage: React.FC = () => {
  const { photos, loading, error, loadMore, hasMore } = usePhotoContext();

  // فیلدهای فیلتر
  const [rawSearchTerm, setRawSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [uploadDate, setUploadDate] = useState<string>("");

  // استفاده از Debounce روی SearchTerm
  const debouncedSearchTerm = useDebounce(rawSearchTerm, 500);

  // محاسبه‌ی «کلید فیلتر» برای ریست مجدد Observer
  const [filterKey, setFilterKey] = useState<number>(0);
  useEffect(() => {
    setFilterKey((prev) => prev + 1);
  }, [debouncedSearchTerm, category, uploadDate]);

  // تنظیم پرچم «در حال فیلتر»
  const isFiltering =
    debouncedSearchTerm !== "" || category !== "all" || uploadDate !== "";

  // فیلتر کردن عکس‌ها
  const filteredPhotos = usePhotoFilter(photos, {
    searchTerm: debouncedSearchTerm,
    category,
    uploadDate,
  });

  // Hook اختصاصی برای Infinite Scroll (الان خروجی: observerRef هم داریم)
  const { sentinelRef, observerRef } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
  });

  // زمانی که کلید فیلتر تغییر کرد، حتماً Observer را ریست کنید
  useEffect(() => {
    if (observerRef.current && sentinelRef.current) {
      observerRef.current.unobserve(sentinelRef.current);
    }
  }, [filterKey, observerRef, sentinelRef]);

  // اینجا منطق اصلیِ observe کردن را می‌نویسیم:
  useEffect(() => {
    const observer = observerRef.current;
    const sentinel = sentinelRef.current;
    if (!observer || !sentinel) return;

    // فقط وقتی «در حال فیلتر نیستیم» و «در حال لود نیستیم» و «عکسی داریم»
    // و «هنوز hasMore داریم»، آن‌گاه observe کن:
    if (!isFiltering && !loading && photos.length > 0 && hasMore) {
      observer.observe(sentinel);
    }

    // Cleanup: اگر شرایط لازم نبود، unobserve کنیم
    return () => {
      if (observer && sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loading, photos.length, hasMore, filterKey, isFiltering, observerRef, sentinelRef]);

  if (error) {
    return (
      <div
        className={css({
          p: "4",
          color: "red.600",
          textAlign: "center",
        })}
      >
        {error}
      </div>
    );
  }

  return (
    <main
      className={css({
        px: "4",
        py: "6",
        maxW: "7xl",
        mx: "auto",
      })}
    >
      {/* ۱. هدر صفحه */}
      <header className={css({ mb: "6", textAlign: "center" })}>
        <h1
          className={css({
            fontSize: "3xl",
            fontWeight: "bold",
          })}
        >
          Photo Gallery
        </h1>
      </header>

      {/* ۲. بخش فیلتر (FilterPanel فرض می‌شود که یک <form> رندر می‌کند) */}
      <section aria-labelledby="filter-heading">
        <h2 id="filter-heading" className={css({ srOnly: true })}>
          Filter photos
        </h2>
        <FilterPanel
          searchTerm={rawSearchTerm}
          category={category}
          uploadDate={uploadDate}
          onSearchChange={setRawSearchTerm}
          onCategoryChange={setCategory}
          onDateChange={setUploadDate}
          onClearFilters={() => {
            setRawSearchTerm("");
            setCategory("all");
            setUploadDate("");
          }}
        />
      </section>

      {/* ۳. لیست عکس‌ها */}
      <section aria-labelledby="gallery-heading" className={css({ mt: "6" })}>
        <h2 id="gallery-heading" className={css({ srOnly: true })}>
          Photo results
        </h2>
        <PhotoList photos={filteredPhotos} />
      </section>

      {/* ۴. Sentinel برای Infinite Scroll */}
      <div ref={sentinelRef} className={css({ h: "10px" })} />

      {loading && (
        <div
          className={css({
            mt: "6",
            textAlign: "center",
            fontSize: "sm",
            color: "gray.500",
          })}
        >
          <p>Loading more photos...</p>
        </div>
      )}
      {!hasMore && !loading && (
        <div
          className={css({
            mt: "6",
            textAlign: "center",
            fontSize: "sm",
            color: "gray.400",
          })}
        >
          No more photos to load.
        </div>
      )}
    </main>
  );
};

export default GalleryPage;
