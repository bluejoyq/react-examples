import { useRef, useState } from "react";

interface UseSentryFetchParams {
  fetchNextPage: () => void;
}
export const useSentryFetch = ({ fetchNextPage }: UseSentryFetchParams) => {
  const observerRef = useRef<IntersectionObserver>(
    new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      },
    ),
  );
  const [sentryElement, setSentryElement] = useState<HTMLDivElement | null>(
    null,
  );
  const sentryRefCallback = (node: HTMLDivElement | null) => {
    unobserve(sentryElement);
    setSentryElement(node);
    observe(node);
  };

  const observe = (node: HTMLDivElement | null) => {
    if (node == null) {
      return;
    }
    observerRef.current.observe(node);
  };

  const unobserve = (node: HTMLDivElement | null) => {
    if (node == null) {
      return;
    }
    observerRef.current.unobserve(node);
  };

  return { sentryRefCallback };
};
