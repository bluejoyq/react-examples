import { useCallback, useEffect, useRef, useState } from "react";

interface VirtualItem<T> {
  virtualIndex: number;
  data: T;
  top: string;
}
interface ScrollVirtualizerParams<T> {
  contents: T[];
  overscan?: number;
  contentHeight: string;
  scrollElement?: HTMLElement | null;
}

interface ScrollVirtualizerReturns<T> {
  virtualContents: VirtualItem<T>[];
  containerHeight: string;
}
export const useScrollVirtualizer = <T>({
  contents,
  overscan = 10,
  contentHeight,
  scrollElement = window.document.documentElement,
}: ScrollVirtualizerParams<T>): ScrollVirtualizerReturns<T> => {
  const contentLength = contents.length;
  /**
   * @description string 높이를 계산하여 pixel로 반환
   */
  const computePixelHeight = useCallback((): number => {
    const _elem = document.createElement("div");
    _elem.style.height = contentHeight;
    _elem.style.visibility = "hidden";
    document.body.appendChild(_elem);
    const realContentHeight = _elem.clientHeight;
    document.body.removeChild(_elem);
    return realContentHeight;
  }, [contentHeight]);

  /**
   * @description 화면에 들어가는 virtual size를 계산하여 반환
   */
  const computeVirtualSize = useCallback(() => {
    if (scrollElement == null) {
      return 0;
    }
    return (
      Math.ceil(scrollElement.clientHeight / computePixelHeight()) + overscan
    );
  }, [computePixelHeight, overscan, scrollElement]);
  const virtualSize = useRef(computeVirtualSize());
  const [virtualPos, setVirtualPos] = useState({
    start: 0,
    end: virtualSize.current,
  });

  const handleScroll = useCallback(() => {
    if (scrollElement == null) {
      return;
    }
    const scrollTop = -scrollElement.getBoundingClientRect().top;

    const virtualIndex = Math.floor(scrollTop / computePixelHeight());
    const start = Math.max(0, virtualIndex);
    const end = Math.min(contentLength, virtualIndex + virtualSize.current);
    setVirtualPos({ start, end });
  }, [contentLength, scrollElement, computePixelHeight]);

  const handleResize = useCallback(() => {
    const newVirtualSize = computeVirtualSize();
    virtualSize.current = newVirtualSize;

    handleScroll();
  }, [handleScroll, computeVirtualSize]);
  useEffect(() => {
    if (scrollElement == null) {
      return;
    }
    if (scrollElement === window.document.documentElement) {
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
    scrollElement.addEventListener("resize", handleResize);
    return () => {
      scrollElement.removeEventListener("resize", handleResize);
    };
  }, [handleResize, scrollElement]);
  useEffect(() => {
    if (scrollElement == null) {
      return;
    }
    if (scrollElement === window.document.documentElement) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
    scrollElement.addEventListener("scroll", handleScroll);
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, scrollElement]);

  const pixelHeight = computePixelHeight();
  const virtualContents = contents
    .slice(virtualPos.start, virtualPos.end)
    .map((data, index) => {
      const virtualIndex = index + virtualPos.start;
      return {
        virtualIndex: index + virtualPos.start,
        data,
        top: `calc(${pixelHeight}px * ${virtualIndex})`,
      };
    });

  return {
    virtualContents,
    containerHeight: `calc(${pixelHeight}px * ${contentLength})`,
  };
};
