import { ReactElement, useEffect, useRef, useState } from "react";
import { useLoadInfiniteData } from "./useLoadInfiniteData";

const PAGE_SIZE = 10000;
interface VirtualItem<T> {
  virtualIndex: number;
  data: T;
}
export const Test = (): ReactElement => {
  const {
    data: remoteData,
    hasNextPage,
    isFetchingNextPage,
  } = useLoadInfiniteData(PAGE_SIZE);

  const contents = (remoteData?.pages ?? []).flat();
  const contentLength = contents.length;
  const isLoadable = hasNextPage && !isFetchingNextPage;
  const contentHeight = `calc(50vw + 19.5px)`;

  const virtualSize = 30;
  const [virtualPos, setVirtualPos] = useState({
    start: 0,
    end: virtualSize,
  });

  const observer = useRef<IntersectionObserver>(
    new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        return;
      }

      const isScrollDown = entry.boundingClientRect.top < 0;
      unobserve(entry.target);
      if (isScrollDown) {
        const target = entry.target as HTMLDivElement;
        const virtualIndex = Number(target.dataset.virtualIndex);
        setVirtualPos({
          start: virtualIndex + 1,
          end: virtualIndex + virtualSize + 1,
        });
      } else {
        const target = entries.slice(-1)[0].target as HTMLDivElement;
        const virtualIndex = Number(target.dataset.virtualIndex);
        setVirtualPos({
          start: Math.max(0, virtualIndex - virtualSize - 1),
          end: Math.max(virtualSize, virtualIndex - 1),
        });
      }
    }),
  );

  const observe = (node: Element) => {
    observer.current.observe(node);
  };

  const unobserve = (node: Element) => {
    observer.current.unobserve(node);
  };

  const unobserveAll = () => {
    observer.current.disconnect();
  };

  const virtualContents = contents
    .slice(virtualPos.start, virtualPos.end)
    .map((data, index) => ({
      virtualIndex: index + virtualPos.start,
      data,
      ref: (node: HTMLDivElement | null) => {
        if (node == null) {
          return;
        }
        observe(node);
      },
    }));
  unobserveAll();
  return (
    <div
      style={{
        width: "50vw",
        display: "flex",
        flexDirection: "column",
        height: `calc(${contentHeight} * ${contentLength})`,
        position: "relative",
      }}
    >
      {virtualContents.map(({ data, virtualIndex, ref }) => (
        <div
          key={data.id}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            border: "1px solid black",
            padding: "10px",
            position: "absolute",
            top: `calc(${contentHeight} * ${virtualIndex})`,
          }}
          ref={ref}
          data-virtual-index={virtualIndex}
        >
          <img
            src={data.src}
            alt={data.title}
            style={{ width: "100%", height: "auto", aspectRatio: "1" }}
            loading="lazy"
          />
          <span>{data.title}</span>
        </div>
      ))}
      {isLoadable && (
        <div
          style={{
            width: "100%",
            backgroundColor: "red",
            position: "absolute",
            bottom: 0,
          }}
        >
          ...loading
        </div>
      )}
    </div>
  );
};
