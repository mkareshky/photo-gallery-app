// src/copinents/CategorySelect.tsx

import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { css, cx } from "../styled-system/css";

interface CategorySelectProps {
  category: string;
  onCategoryChange: (value: string) => void;
}

export const CategorySelect = ({ category, onCategoryChange }: CategorySelectProps) => {
  const categorySelect = css({
    px: "3",
    py: "2",
    borderRadius: "md",
    borderWidth: "1px",
    borderColor: "gray.300",
    fontSize: "sm",
    bg: "white",
    minW: "200px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    _focus: {
      outline: "none",
      ring: "2",
      ringColor: "blue.500",
      borderColor: "blue.500",
    },
  });

  const categorySelectContent = css({
    zIndex: "50",
    background: "white",
    borderRadius: "md",
    boxShadow: "md",
    py: "2",
    maxH: "200px",
    overflowY: "auto",
  });

  const categorySelectItem = css({
    px: "3",
    py: "2",
    cursor: "pointer",
    fontSize: "sm",
    _hover: { bg: "gray.100" },
    _highlighted: {
      bg: "blue.500",
      fontWeight: "bold",
    },
  });

  const categoryValues = [
    { label: "All Categories", value: "all" },
    { label: "Nature", value: "Nature" },
    { label: "City", value: "City" },
    { label: "People", value: "People" },
    { label: "Animals", value: "Animals" },
    { label: "Tech", value: "Tech" },
    { label: "Food", value: "Food" },
  ];

  const currentLabel =
    categoryValues.find((cv) => cv.value === category)?.label ?? "Select category";

  return (
    <Select.Root value={category} onValueChange={onCategoryChange}>
      <Select.Trigger
        aria-label={currentLabel}
        aria-controls="category-options"
        className={categorySelect}
        role="combobox"
      >
        <Select.Value placeholder="Select category" />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className={categorySelectContent} id="category-options">
          <Select.Viewport>
            {categoryValues.map(({ label, value }) => (
              <Select.Item
                key={value}
                value={value}
                className={cx(categorySelectItem)}
                role="option"
              >
                <Select.ItemText>{label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
