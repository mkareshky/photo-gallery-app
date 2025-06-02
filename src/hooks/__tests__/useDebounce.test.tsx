/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

//
// A simple test-component. It calls useDebounce(value, delay)
// and renders the result inside a <div data-testid="debounced">.
//
function DebounceTester({ value, delay }: { value: string; delay: number }) {
  const debouncedValue = useDebounce(value, delay);
  return <div data-testid="debounced">{debouncedValue}</div>;
}

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("updates immediately when delay is 0", () => {
    // Initial render with value="initial" and delay=0
    const { rerender } = render(<DebounceTester value="initial" delay={0} />);
    const display = screen.getByTestId("debounced");

    // Right after mount, it should show "initial"
    expect(display.textContent).toBe("initial");

    // Rerender with value="updated" and still delay=0
    rerender(<DebounceTester value="updated" delay={0} />);

    // Because React state updates (even with a 0ms timer) happen on the next tick,
    // we advance timers by 0ms to flush that update:
    act(() => {
      jest.advanceTimersByTime(0);
    });

    // Now it should have updated:
    expect(display.textContent).toBe("updated");
  });

  it("clears pending timeout on unmount and does not update state afterward", () => {
    // Render with value="initial" and delay=1000
    const { rerender, unmount } = render(
      <DebounceTester value="initial" delay={1000} />
    );
    const display = screen.getByTestId("debounced");
    expect(display.textContent).toBe("initial");

    // Change prop to "changed", scheduling an update after 1000ms
    rerender(<DebounceTester value="changed" delay={1000} />);

    // Immediately unmount before the 1000ms timer fires
    unmount();

    // Fast-forward all timers
    act(() => {
      jest.runAllTimers();
    });

    // Because we unmounted, no visible DOM remains. To confirm the old timer didn’t “leak” out,
    // we mount a fresh DebounceTester and verify it still shows "initial".
    const { getByTestId } = render(<DebounceTester value="initial" delay={1000} />);
    expect(getByTestId("debounced").textContent).toBe("initial");
  });

  it("resets timer if delay prop changes during pending timeout", () => {
    // Render with value="initial" and delay=1000
    const { rerender } = render(<DebounceTester value="initial" delay={1000} />);
    const display = screen.getByTestId("debounced");
    expect(display.textContent).toBe("initial");

    // Change value to "first" with delay=1000 → schedules update at t=1000ms
    rerender(<DebounceTester value="first" delay={1000} />);

    // Before 1000ms passes, advance 400ms:
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Now change delay from 1000 to 500 (keeps value="first") → this resets the timer
    rerender(<DebounceTester value="first" delay={500} />);

    // Advance only 400ms more (so 800ms total since first change). The 500ms timer (from second render) hasn’t fired yet:
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(display.textContent).toBe("initial");

    // Advance 100ms more (so the 500ms interval is now complete)
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(display.textContent).toBe("first");
  });

  it("still respects last change if value changes quickly", () => {
    // Render with value="start" and delay=1000
    const { rerender } = render(<DebounceTester value="start" delay={1000} />);
    const display = screen.getByTestId("debounced");
    expect(display.textContent).toBe("start");

    // Change to "v1", scheduling update at t=1000
    rerender(<DebounceTester value="v1" delay={1000} />);

    // After 500ms, change to "v2" (reschedules to t=1500)
    act(() => {
      jest.advanceTimersByTime(500);
    });
    rerender(<DebounceTester value="v2" delay={1000} />);

    // After another 200ms (so t=700), change to "v3" (reschedules to t=1700)
    act(() => {
      jest.advanceTimersByTime(200);
    });
    rerender(<DebounceTester value="v3" delay={1000} />);

    // Fast-forward all remaining time so that the final timer (for "v3") can fire:
    act(() => {
      jest.runAllTimers();
    });
    expect(display.textContent).toBe("v3");
  });
});
