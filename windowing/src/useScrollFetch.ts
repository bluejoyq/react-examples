import { useEffect } from "react";

interface UseScrollFetchParams {
  fetchNextPage: () => void;
  isLoadable: boolean;
  fetchLimitY?: number;
  scrollElement?: HTMLElement | null;
}
export const useScrollFetch = ({
  fetchNextPage,
  isLoadable,
  fetchLimitY = 500,
  scrollElement = document.documentElement,
}: UseScrollFetchParams) => {
  const throttle = (callback: () => void, ms: number) => {
    let lastTime = 0;
    return () => {
      const now = new Date().getTime();
      if (now - lastTime < ms) {
        return;
      }
      lastTime = now;
      callback();
    };
  };
  useEffect(() => {
    if (scrollElement == null) {
      return;
    }
    const handleScroll = throttle(() => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      if (!isLoadable) {
        return;
      }
      if (scrollHeight - (scrollTop + clientHeight) >= fetchLimitY) {
        return;
      }
      fetchNextPage();
    }, 160);

    if (scrollElement === document.documentElement) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
    scrollElement.addEventListener("scroll", handleScroll);
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [isLoadable, fetchNextPage, fetchLimitY, scrollElement]);
};
