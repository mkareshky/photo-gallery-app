import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  test('returns initial value', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  test('updates value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Update the value
    act(() => {
      rerender({ value: 'updated', delay: 500 });
    });

    // Advance timers by the exact delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  test('cancels update if value changes before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    act(() => {
      rerender({ value: 'intermediate', delay: 500 });
      jest.advanceTimersByTime(250);
    });

    act(() => {
      rerender({ value: 'final', delay: 500 });
      jest.advanceTimersByTime(250); // 500ms total since initial update
    });

    act(() => {
      jest.advanceTimersByTime(500); // additional time to surpass the second delay
    });

    expect(result.current).toBe('final');
  });
});
