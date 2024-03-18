import { useCallback, useEffect, useRef, useState } from "react";

interface VirtualItem<T> {
  virtualIndex: number;
  data: T;
  ref: (instance: HTMLElement | null) => void;
  minHeight?: number;
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
  top: string;
}
export const useScrollVirtualizer = <T>({
  contents,
  overscan = 10,
  contentHeight,
  scrollElement = window.document.documentElement,
}: ScrollVirtualizerParams<T>): ScrollVirtualizerReturns<T> => {
  const contentLength = contents.length;
  const realContentHeightMap = useRef(new Map<number, number>());
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
    return Math.ceil(scrollElement.clientHeight / computePixelHeight());
  }, [computePixelHeight, scrollElement]);
  const virtualSize = useRef(computeVirtualSize() + overscan);
  const [virtualPos, setVirtualPos] = useState({
    start: 0,
    end: virtualSize.current,
  });

  const handleScroll = useCallback(() => {
    if (scrollElement == null) {
      return;
    }
    let scrollTop = -scrollElement.getBoundingClientRect().top;
    const pixelHeight = computePixelHeight();
    let virtualIndex = 0;
    while (scrollTop > 0) {
      scrollTop -=
        realContentHeightMap.current.get(virtualIndex) ?? pixelHeight;
      virtualIndex += 1;
    }
    const start = Math.max(0, virtualIndex - overscan);
    const end = Math.min(
      contentLength,
      virtualIndex + virtualSize.current + overscan,
    );
    setVirtualPos({ start, end });
  }, [contentLength, scrollElement, computePixelHeight, overscan]);

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
        virtualIndex,
        data,
        minHeight: realContentHeightMap.current.get(virtualIndex),
        ref: (instance: HTMLElement | null) => {
          if (instance == null) {
            return;
          }
          realContentHeightMap.current.set(virtualIndex, instance.clientHeight);
        },
      };
    });

  let top = 0;
  let containerHeight = 0;
  for (let i = 0; i < contentLength; i++) {
    containerHeight += realContentHeightMap.current.get(i) ?? pixelHeight;
  }
  for (let i = 0; i < virtualPos.start; i++) {
    top += realContentHeightMap.current.get(i) ?? pixelHeight;
  }

  return {
    virtualContents,
    containerHeight: `${containerHeight}px`,
    top: `${top}px`,
  };
};
