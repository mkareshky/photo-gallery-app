import React from "react";
import { css } from "../../styled-system/css";
import { CategorySelect } from "./CategorySelect";

type Props = {
  searchTerm: string;
  category: string;
  uploadDate: string;
  onSearchChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onDateChange: (val: string) => void;
  onClearFilters: () => void;
};

export const FilterPanel: React.FC<Props> = ({
  searchTerm,
  category,
  uploadDate,
  onSearchChange,
  onCategoryChange,
  onDateChange,
  onClearFilters,
}) => {
  const searchInput = css({
    px: "3",
    py: "2",
    borderRadius: "md",
    borderWidth: "1px",
    borderColor: "gray.300",
    fontSize: "sm",
    flex: "1 1 auto",
    minW: "200px",
    _focus: {
      outline: "none",
      ring: "2",
      ringColor: "blue.500",
      borderColor: "blue.500",
    },
  });

  const clearFiltersButton = css({
    py: "2",
    borderRadius: "md",
    fontWeight: "medium",
    fontSize: "sm",
    border: "1px solid",
    borderColor: "gray.300",
    bg: "red.700",
    color: "white",
    px: "4",
    rounded: "md",
    _hover: {
      bg: "red.800",
    },
    _focus: {
      outline: "none",
      ring: "2",
      ringColor: "blue.500",
    },
  });

  const datePicker = css({
    px: "3",
    py: "2",
    borderRadius: "md",
    fontWeight: "medium",
    fontSize: "sm",
    bg: "gray.100",
    color: "gray.700",
    border: "1px solid",
    borderColor: "gray.300",
    _hover: {
      bg: "gray.200",
    },
    _focus: {
      outline: "none",
      ring: "2",
      ringColor: "blue.500",
      borderColor: "blue.500",
    },
  });

  return (
    <section
      aria-label="Filter panel"
      className={css({
        display: "flex",
        flexWrap: "wrap",
        gap: "4",
        alignItems: "center",
        mb: "4",
      })}
    >

      <input
        aria-label="Search items"
        placeholder="Search..."
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={searchInput}
      />

      <CategorySelect
        category={category}
        onCategoryChange={onCategoryChange}
        aria-label="Category"
      />
      <input
        type="date"
        value={uploadDate}
        onChange={(e) => onDateChange(e.target.value)}
        aria-label="Filter by upload date"
        className={datePicker}
      />

      <button
        type="button"
        onClick={onClearFilters}
        className={clearFiltersButton}
      >
        Clear Filters
      </button>
    </section>
  );
};
