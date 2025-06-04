// src/components/PhotoNavigationButtons.tsx
import React from "react";
import { css } from "../styled-system/css";
import { SystemStyleObject } from "../styled-system/types";

interface ButtonStyleProps {
  baseStyle?: SystemStyleObject;
  hoverStyle?: SystemStyleObject;
  focusStyle?: SystemStyleObject;
}

interface PhotoNavigationButtonsProps {
  goNext: () => void;
  goPrev: () => void;
  prevButtonStyles?: ButtonStyleProps;
  nextButtonStyles?: ButtonStyleProps;
}

const defaultButtonStyle: SystemStyleObject = {
  px: "5",
  py: "2",
  bg: "gray.100",
  color: "black",
  rounded: "md",
  fontWeight: "medium",
  _hover: { bg: "gray.200" },
  _focusVisible: {
    outline: "2px solid",
    outlineColor: "blue.500",
    outlineOffset: "2px",
  },
  transition: "all 0.2s",
  cursor: "pointer",
};

export const PhotoNavigationButtons: React.FC<PhotoNavigationButtonsProps> = ({
  goNext,
  goPrev,
  prevButtonStyles,
  nextButtonStyles,
}) => {
  const prevStyles = prevButtonStyles
    ? {
        ...defaultButtonStyle,
        ...prevButtonStyles.baseStyle,
        _hover: prevButtonStyles.hoverStyle ?? defaultButtonStyle._hover,
        _focusVisible:
          prevButtonStyles.focusStyle ?? defaultButtonStyle._focusVisible,
      }
    : defaultButtonStyle;

  const nextStyles = nextButtonStyles
    ? {
        ...defaultButtonStyle,
        ...nextButtonStyles.baseStyle,
        _hover: nextButtonStyles.hoverStyle ?? defaultButtonStyle._hover,
        _focusVisible:
          nextButtonStyles.focusStyle ?? defaultButtonStyle._focusVisible,
      }
    : defaultButtonStyle;

  return (
    <nav
      aria-label="Photo navigation"
      className={css({
        mt: "6",
        display: "flex",
        justifyContent: "space-between",
      })}
    >
      <button onClick={goPrev} className={css(prevStyles)}>
        ← Previous
      </button>
      <button onClick={goNext} className={css(nextStyles)}>
        Next →
      </button>
    </nav>
  );
};
