// src/components/CategorySelect.tsx
import React, { useRef, useState, useEffect } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderHeight?: number;
  placeholderBg?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderHeight = 200,
  placeholderBg = "#f0f0f0",
  ...rest
}) => {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!imgRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );
    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={imgRef}>
      {isVisible ? (
        <img src={src} alt={alt} loading="lazy" {...rest} />
      ) : (
        <div
          style={{
            width: "100%",
            height: placeholderHeight,
            backgroundColor: placeholderBg,
          }}
        />
      )}
    </div>
  );
};
