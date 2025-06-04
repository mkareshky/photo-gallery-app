// src/hooks/__tests__/useConditionalInfiniteScroll.test.tsx
/**
 * @jest-environment jsdom
 */

import React, { useEffect } from "react";
import { render, act } from "@testing-library/react";
import { useConditionalInfiniteScroll } from "../useConditionalInfiniteScroll";

describe("useConditionalInfiniteScroll hook", () => {
  let createdObserverInstances: Array<{
    callback: IntersectionObserverCallback;
    observedElement: Element | null;
  }>;
  let disconnectMock: jest.Mock;

  // Dummy component that uses the hook
  function Dummy({
    onLoadMore,
    hasMore,
    loading,
    isFiltering,
  }: {
    onLoadMore: () => void;
    hasMore: boolean;
    loading: boolean;
    isFiltering: boolean;
  }) {
    const sentinelRef = useConditionalInfiniteScroll(
      onLoadMore,
      hasMore,
      loading,
      isFiltering
    );

    // No extra work here: the hook itself handles observing.
    return <div data-testid="sentinel" ref={sentinelRef} />;
  }

  beforeEach(() => {
    createdObserverInstances = [];
    disconnectMock = jest.fn();

    class MockObserver {
      callback: IntersectionObserverCallback;
      observedElement: Element | null = null;

      constructor(cb: IntersectionObserverCallback) {
        this.callback = cb;
        createdObserverInstances.push({
          callback: cb,
          observedElement: null,
        });
      }

      observe(el: Element) {
        // Register which element is being observed
        const entry = createdObserverInstances.find((inst) => inst.callback === this.callback)!;
        entry.observedElement = el;
      }

      disconnect() {
        disconnectMock();
      }
    }

    // @ts-ignore
    global.IntersectionObserver = MockObserver;
  });

  afterEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    delete global.IntersectionObserver;
  });

  it("calls onLoadMore when sentinel intersects (hasMore=true, loading=false, isFiltering=false)", async () => {
    const loadMore = jest.fn();

    let rendered: ReturnType<typeof render>;
    await act(async () => {
      rendered = render(
        <Dummy
          onLoadMore={loadMore}
          hasMore={true}
          loading={false}
          isFiltering={false}
        />
      );
      // Wait for the effect to run
    });

    // We expect exactly one IntersectionObserver instance to have been created:
    expect(createdObserverInstances).toHaveLength(1);

    // Grab the observer instance and its sentinel element:
    const { callback, observedElement } = createdObserverInstances[0];
    expect(observedElement).toBe(rendered!.getByTestId("sentinel"));

    // Now simulate an intersection inside act:
    await act(async () => {
      callback(
        [{ isIntersecting: true, target: observedElement! } as any],
        {} as any
      );
    });

    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it("does not set up an observer when loading=true", async () => {
    const loadMore = jest.fn();

    await act(async () => {
      render(
        <Dummy
          onLoadMore={loadMore}
          hasMore={true}
          loading={true}
          isFiltering={false}
        />
      );
    });

    // Because loading=true, the hook must skip creating a new observer
    expect(createdObserverInstances).toHaveLength(0);
    expect(loadMore).not.toHaveBeenCalled();
  });

  it("does not set up an observer when isFiltering=true", async () => {
    const loadMore = jest.fn();

    await act(async () => {
      render(
        <Dummy
          onLoadMore={loadMore}
          hasMore={true}
          loading={false}
          isFiltering={true}
        />
      );
    });

    expect(createdObserverInstances).toHaveLength(0);
    expect(loadMore).not.toHaveBeenCalled();
  });

  it("does not set up an observer when hasMore=false", async () => {
    const loadMore = jest.fn();

    await act(async () => {
      render(
        <Dummy
          onLoadMore={loadMore}
          hasMore={false}
          loading={false}
          isFiltering={false}
        />
      );
    });

    expect(createdObserverInstances).toHaveLength(0);
    expect(loadMore).not.toHaveBeenCalled();
  });

  it("disconnects old observer on unmount", async () => {
    const loadMore = jest.fn();
    let unmount: () => void;

    await act(async () => {
      const rendered = render(
        <Dummy
          onLoadMore={loadMore}
          hasMore={true}
          loading={false}
          isFiltering={false}
        />
      );
      unmount = rendered.unmount;
    });

    // Exactly one observer created
    expect(createdObserverInstances).toHaveLength(1);

    // Now unmount inside act:
    await act(async () => {
      unmount!();
    });

    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });

  it("re-instantiates observer when dependencies change", async () => {
    const loadMore = jest.fn();
    let rerender: (ui: React.ReactElement) => void;

    await act(async () => {
      const rendered = render(
        <Dummy
          onLoadMore={loadMore}
          hasMore={true}
          loading={false}
          isFiltering={false}
        />
      );
      rerender = rendered.rerender;
    });

    // Initially, one observer
    expect(createdObserverInstances).toHaveLength(1);

    // Change isFiltering → should disconnect and not create a new observer
    await act(async () => {
      rerender(
        <Dummy
          onLoadMore={loadMore}
          hasMore={true}
          loading={false}
          isFiltering={true}
        />
      );
    });
    // That rerender should have disconnected. No new observer yet, so still length 1:
    expect(disconnectMock).toHaveBeenCalledTimes(1);
    expect(createdObserverInstances).toHaveLength(1);

    // Change back to isFiltering=false → should create a second observer
    await act(async () => {
      rerender(
        <Dummy
          onLoadMore={loadMore}
          hasMore={true}
          loading={false}
          isFiltering={false}
        />
      );
    });
    expect(createdObserverInstances).toHaveLength(2);
  });
});
