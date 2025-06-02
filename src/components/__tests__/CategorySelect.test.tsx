import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategorySelect } from "../CategorySelect";

describe("CategorySelect (additional branches)", () => {
    const setup = (initialValue = "all") => {
    const onCategoryChange = jest.fn();
    render(
      <CategorySelect category={initialValue} onCategoryChange={onCategoryChange} />
    );
    return { onCategoryChange };
  };
  it("renders the trigger with the correct label", () => {
    setup("City");
    expect(screen.getByRole("combobox")).toHaveTextContent("City");
  });
  it("shows all category options when opened", async () => {
    setup();
    fireEvent.click(screen.getByRole("combobox"));

    expect(await screen.findByText("Nature")).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
    expect(screen.getByText("People")).toBeInTheDocument();
    expect(screen.getByText("Animals")).toBeInTheDocument();
    expect(screen.getByText("Tech")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
  });
  it("renders 'All Categories' label when category='all'", () => {
    const { onCategoryChange } = setup("all");
    const combobox = screen.getByRole("combobox");
    // The aria-label should match the label for value "all"
    expect(combobox).toHaveAttribute("aria-label", "All Categories");
  });

  it("renders fallback 'Select category' label when category is not in the list", () => {
    const onCategoryChange = jest.fn();
    render(<CategorySelect category="nonexistent" onCategoryChange={onCategoryChange} />);
    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveAttribute("aria-label", "Select category");
  });

  it("updates the displayed label when selecting 'All Categories' after opening", async () => {
    const onCategoryChange = jest.fn();
    render(<CategorySelect category="Nature" onCategoryChange={onCategoryChange} />);

    // Open the dropdown
    fireEvent.click(screen.getByRole("combobox"));
    // Select "All Categories"
    fireEvent.click(await screen.findByText("All Categories"));

    expect(onCategoryChange).toHaveBeenCalledWith("all");
  });
   it("calls onCategoryChange when an option is selected", async () => {
    const { onCategoryChange } = setup();
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(await screen.findByText("Animals"));

    expect(onCategoryChange).toHaveBeenCalledWith("Animals");
  });
});
