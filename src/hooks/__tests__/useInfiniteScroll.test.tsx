// src/hooks/__tests__/useInfiniteScroll.test.tsx
import React, { useEffect } from "react";
import { render, act } from "@testing-library/react";
import { useInfiniteScroll } from "../useInfiniteScroll";

describe("useInfiniteScroll hook", () => {
  let observeMock: jest.Mock;
  let unobserveMock: jest.Mock;

  // A dummy component that uses useInfiniteScroll
  function DummyComponent({
    hasMore,
    loading,
    onLoadMore,
  }: {
    hasMore: boolean;
    loading: boolean;
    onLoadMore: () => void;
  }) {
    const { sentinelRef, observerRef } = useInfiniteScroll({
      hasMore,
      loading,
      onLoadMore,
    });

    // When mounted, immediately attach observer to sentinel
    useEffect(() => {
      if (observerRef.current && sentinelRef.current) {
        observerRef.current.observe(sentinelRef.current);
      }
      // Cleanup unobserve on unmount
      return () => {
        if (observerRef.current && sentinelRef.current) {
          observerRef.current.unobserve(sentinelRef.current);
        }
      };
    }, [observerRef, sentinelRef]);

    return <div data-testid="sentinel" ref={sentinelRef} />;
  }

  beforeEach(() => {
    observeMock = jest.fn();
    unobserveMock = jest.fn();

    // Mock global IntersectionObserver
    class MockObserver {
      callback: IntersectionObserverCallback;
      constructor(cb: IntersectionObserverCallback) {
        this.callback = cb;
      }
      observe(el: Element) {
        observeMock(el);
        // Simulate immediate intersection
        this.callback(
          [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
          this as any
        );
      }
      unobserve(el: Element) {
        unobserveMock(el);
      }
      disconnect() {}
    }
    // @ts-ignore
    global.IntersectionObserver = MockObserver;
  });

  afterEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    delete global.IntersectionObserver;
  });

  it("calls onLoadMore when sentinel becomes intersecting and hasMore=true & loading=false", async () => {
    const loadMore = jest.fn();

    // Render with hasMore=true, loading=false
    render(<DummyComponent hasMore={true} loading={false} onLoadMore={loadMore} />);

    // Since observe() immediately invoked callback, loadMore should have been called
    expect(observeMock).toHaveBeenCalled();
    expect(loadMore).toHaveBeenCalled();
  });

  it("does not call onLoadMore when loading=true even if intersecting", () => {
    const loadMore = jest.fn();

    // Render with hasMore=true, loading=true
    render(<DummyComponent hasMore={true} loading={true} onLoadMore={loadMore} />);

    // observe() is called, but callback sees loading=true, so onLoadMore should NOT have been called
    expect(observeMock).toHaveBeenCalled();
    expect(loadMore).not.toHaveBeenCalled();
  });

  it("unobserves sentinel on unmount", () => {
    const loadMore = jest.fn();
    const { unmount, getByTestId } = render(
      <DummyComponent hasMore={true} loading={false} onLoadMore={loadMore} />
    );
    const sentinel = getByTestId("sentinel");
    // ensure observe was called at least once
    expect(observeMock).toHaveBeenCalledWith(sentinel);

    // unmount to trigger cleanup
    act(() => {
      unmount();
    });

    expect(unobserveMock).toHaveBeenCalledWith(sentinel);
  });
});
