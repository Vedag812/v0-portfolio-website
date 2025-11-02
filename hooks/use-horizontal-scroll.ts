"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

export function useHorizontalScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [scrollState, setScrollState] = useState<ScrollState>({
    canScrollLeft: false,
    canScrollRight: false,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setScrollState({
        canScrollLeft: scrollLeft > 16,
        canScrollRight: scrollLeft + clientWidth < scrollWidth - 16,
      });
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      event.preventDefault();
      el.scrollBy({ left: event.deltaY, behavior: "smooth" });
    };

    updateScrollState();

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  return { ref, scrollState };
}

export function scrollContainerBy(ref: React.RefObject<HTMLElement>, distance: number) {
  ref.current?.scrollBy({ left: distance, behavior: "smooth" });
}
