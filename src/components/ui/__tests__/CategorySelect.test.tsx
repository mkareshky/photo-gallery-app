import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategorySelect } from "../CategorySelect";

describe("CategorySelect", () => {
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

  it("calls onCategoryChange when an option is selected", async () => {
    const { onCategoryChange } = setup();
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(await screen.findByText("Animals"));

    expect(onCategoryChange).toHaveBeenCalledWith("Animals");
  });
});
