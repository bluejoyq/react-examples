import {
  useInfiniteQuery,
  InfiniteData,
  QueryKey,
} from "@tanstack/react-query";

const sleep = async (ms: number): Promise<void> => {
  return await new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

export interface DummyData {
  id: number;
  title: string;
  src: string;
}

const getSomeData = async (
  startIdx: number,
  dataSize: number,
): Promise<DummyData[]> => {
  await sleep(100);

  return new Array(dataSize).fill(0).map((_, offset) => {
    const id = startIdx * dataSize + offset;
    return {
      title: `${id + 1}번째 데이터`,
      id: id,
      src: `https://picsum.photos/seed/${id}/1000`,
    };
  });
};

export const useLoadInfiniteData = (pageSize: number) => {
  return useInfiniteQuery<
    DummyData[],
    Error,
    InfiniteData<DummyData[], number>,
    QueryKey,
    number
  >({
    queryKey: ["data"],
    queryFn: async ({ pageParam: idx }) => {
      return await getSomeData(idx, pageSize);
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
  });
};
