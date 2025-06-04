// src/components/__tests__/PhotoNavigationButtons.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PhotoNavigationButtons } from "../PhotoNavigationButtons";

describe("PhotoNavigationButtons", () => {
  it("renders two buttons labeled “← Previous” and “Next →”", () => {
    const goPrev = jest.fn();
    const goNext = jest.fn();

    render(<PhotoNavigationButtons goPrev={goPrev} goNext={goNext} />);

    expect(
      screen.getByRole("button", { name: /← Previous/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Next →/i })
    ).toBeInTheDocument();

    const nav = screen.getByLabelText("Photo navigation");
    expect(nav).toBeInTheDocument();
  });

  it("calls goPrev when the “← Previous” button is clicked", async () => {
    const goPrev = jest.fn();
    const goNext = jest.fn();

    render(<PhotoNavigationButtons goPrev={goPrev} goNext={goNext} />);

    const prevBtn = screen.getByRole("button", { name: /← Previous/i });
    await userEvent.click(prevBtn);

    expect(goPrev).toHaveBeenCalledTimes(1);
    expect(goNext).not.toHaveBeenCalled();
  });

  it("calls goNext when the “Next →” button is clicked", async () => {
    const goPrev = jest.fn();
    const goNext = jest.fn();

    render(<PhotoNavigationButtons goPrev={goPrev} goNext={goNext} />);

    const nextBtn = screen.getByRole("button", { name: /Next →/i });
    await userEvent.click(nextBtn);

    expect(goNext).toHaveBeenCalledTimes(1);
    expect(goPrev).not.toHaveBeenCalled();
  });

  it("still renders both buttons when full custom styles are provided", () => {
    const goPrev = jest.fn();
    const goNext = jest.fn();

    const prevButtonStyles = {
      baseStyle: { bg: "red.500", color: "white" },
      hoverStyle: { bg: "red.600" },
      focusStyle: { outlineColor: "red.300" },
    };
    const nextButtonStyles = {
      baseStyle: { bg: "green.500", color: "black" },
      hoverStyle: { bg: "green.600" },
      focusStyle: { outlineColor: "green.300" },
    };

    render(
      <PhotoNavigationButtons
        goPrev={goPrev}
        goNext={goNext}
        prevButtonStyles={prevButtonStyles}
        nextButtonStyles={nextButtonStyles}
      />
    );

    expect(
      screen.getByRole("button", { name: /← Previous/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Next →/i })
    ).toBeInTheDocument();
  });

  it("falls back to default _hover and _focusVisible when hoverStyle and focusStyle are missing", async () => {
    const goPrev = jest.fn();
    const goNext = jest.fn();

    // Provide only baseStyle; omit hoverStyle and focusStyle
    const prevButtonStyles = {
      baseStyle: { bg: "purple.500", color: "white" },
    };
    const nextButtonStyles = {
      baseStyle: { bg: "orange.500", color: "black" },
    };

    render(
      <PhotoNavigationButtons
        goPrev={goPrev}
        goNext={goNext}
        prevButtonStyles={prevButtonStyles}
        nextButtonStyles={nextButtonStyles}
      />
    );

    const prevBtn = screen.getByRole("button", { name: /← Previous/i });
    const nextBtn = screen.getByRole("button", { name: /Next →/i });

    // Buttons render successfully even without hoverStyle/focusStyle
    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();

    // Clicking still triggers callbacks
    await userEvent.click(prevBtn);
    expect(goPrev).toHaveBeenCalledTimes(1);
    await userEvent.click(nextBtn);
    expect(goNext).toHaveBeenCalledTimes(1);
  });

  it("uses default _focusVisible when focusStyle is missing but hoverStyle provided", async () => {
    const goPrev = jest.fn();
    const goNext = jest.fn();

    // Provide baseStyle and hoverStyle; omit focusStyle
    const prevButtonStyles = {
      baseStyle: { bg: "teal.500" },
      hoverStyle: { bg: "teal.600" },
    };
    const nextButtonStyles = {
      baseStyle: { color: "navy" },
      hoverStyle: { bg: "navy.600" },
    };

    render(
      <PhotoNavigationButtons
        goPrev={goPrev}
        goNext={goNext}
        prevButtonStyles={prevButtonStyles}
        nextButtonStyles={nextButtonStyles}
      />
    );

    const prevBtn = screen.getByRole("button", { name: /← Previous/i });
    const nextBtn = screen.getByRole("button", { name: /Next →/i });

    // Buttons still render when focusStyle is undefined
    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();

    // Clicking still triggers callbacks
    await userEvent.click(prevBtn);
    expect(goPrev).toHaveBeenCalledTimes(1);
    await userEvent.click(nextBtn);
    expect(goNext).toHaveBeenCalledTimes(1);
  });
});
