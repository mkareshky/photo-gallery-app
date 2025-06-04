// src/components/__tests__/FilterPanel.test.tsx
/**
 * @jest-environment jsdom
 */

import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterPanel } from "../FilterPanel";

describe("FilterPanel component", () => {
    const mockOnCategoryChange = jest.fn();
    const mockOnDateChange = jest.fn();
    const mockOnClear = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Must render search input and buttons and call callbacks", async () => {
        function Wrapper() {
            const [search, setSearch] = useState("foo");
            const [category, setCategory] = useState("City");
            const [date, setDate] = useState("2023-04-01");

            return (
                <FilterPanel
                    searchTerm={search}
                    category={category}
                    uploadDate={date}
                    onSearchChange={(val) => {
                        setSearch(val);
                    }}
                    onCategoryChange={(val) => {
                        setCategory(val);
                        mockOnCategoryChange(val);
                    }}
                    onDateChange={(val) => {
                        setDate(val);
                        mockOnDateChange(val);
                    }}
                    onClearFilters={() => {
                        setSearch("");
                        setCategory("all");
                        setDate("");
                        mockOnClear();
                    }}
                />
            );
        }

        render(<Wrapper />);

        const searchInput = screen.getByPlaceholderText("Search...");
        expect(searchInput).toHaveValue("foo");

        await userEvent.clear(searchInput);
        await userEvent.type(searchInput, "bar");
        expect(searchInput).toHaveValue("bar");

        const dateInput = screen.getByDisplayValue("2023-04-01");
        await userEvent.clear(dateInput);
        await userEvent.type(dateInput, "2023-05-05");
        expect(dateInput).toHaveValue("2023-05-05");
        expect(mockOnDateChange).toHaveBeenLastCalledWith("2023-05-05");

        const categoryTrigger = screen.getByRole("combobox");
        await userEvent.click(categoryTrigger);

        await waitFor(() => {
            expect(screen.getAllByRole("option").length).toBeGreaterThan(0);
        });

        const natureOption = await screen.findByRole("option", { name: "Nature" });
        await userEvent.click(natureOption);
        expect(mockOnCategoryChange).toHaveBeenLastCalledWith("Nature");

        expect(categoryTrigger).toHaveTextContent("Nature");

        const clearButton = screen.getByRole("button", { name: /Clear Filters/i });
        await userEvent.click(clearButton);
        expect(mockOnClear).toHaveBeenCalled();

        expect(searchInput).toHaveValue("");
        expect(dateInput).toHaveValue("");
        expect(categoryTrigger).toHaveTextContent("All Categories");
    });
});
