import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ReactElement, useRef } from "react";

const DATA_LENGTH = 10;
const sleep = async (ms: number): Promise<void> => {
  return await new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};
const getSomeData = async (startIdx: number): Promise<string[]> => {
  await sleep(100);
  return new Array(DATA_LENGTH)
    .fill(0)
    .map((_, offset) => `${startIdx * DATA_LENGTH + offset}번째 데이터`);
};
export const Test = (): ReactElement => {
  const {
    data: remoteData,
    hasPreviousPage,
    isFetchingPreviousPage,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,
    fetchNextPage,
  } = useInfiniteQuery<
    string[],
    Error,
    InfiniteData<string[], number>,
    QueryKey,
    number
  >({
    queryKey: ["data"],
    queryFn: async ({ pageParam: idx }) => {
      return await getSomeData(idx);
    },
    initialPageParam: 0,
    getNextPageParam: (_, __, lastPageParam) => {
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_, __, firstPageParam) => {
      if (firstPageParam == 0) {
        return null;
      }
      return firstPageParam - 1;
    },
    maxPages: 5,
  });
  const parentRef = useRef<HTMLDivElement | null>(null);
  const maxDataLength =
    ((remoteData?.pageParams.slice(-1)[0] ?? 0) + 1) * DATA_LENGTH;

  const rowVirtualizer = useVirtualizer({
    count: maxDataLength,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 5 * DATA_LENGTH,
  });
  const datas = {};
  for (let i = 0; i < remoteData?.pages.length ?? 0; i += 1) {
    const pageOffset = remoteData?.pageParams[i];
    remoteData?.pages[i].forEach((val, index) => {
      datas[pageOffset * DATA_LENGTH + index] = val;
    });
  }
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    const scrollTop = e.currentTarget.scrollTop;
    const scrollHeight = e.currentTarget.scrollHeight;
    const clientHeight = e.currentTarget.clientHeight;
    const scrollPercent = 100 - (scrollHeight - clientHeight - scrollTop);
    const shouldFetchPrevious =
      scrollTop <
      scrollHeight - (5 * scrollHeight) / (maxDataLength / DATA_LENGTH);
    if (shouldFetchPrevious && hasPreviousPage && !isFetchingPreviousPage) {
      fetchPreviousPage();
    }
    if (scrollPercent > 80 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <>
      <div
        ref={parentRef}
        style={{
          height: `400px`,
          overflow: "scroll",
        }}
        onScroll={handleScroll}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              Row {datas[virtualItem.index]}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
