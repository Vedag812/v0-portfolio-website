"use client";

import { useEffect, useState, useRef, useMemo } from "react";

export function useInView(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Memoize the options to prevent unnecessary re-creations of the observer
  const threshold = options?.threshold ?? 0.2;
  const rootMargin = options?.rootMargin;

  const stableOptions = useMemo(
    () => ({ threshold, rootMargin }),
    [threshold, rootMargin]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(element);
      }
    }, stableOptions);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [stableOptions]);

  return { ref, isInView };
}
