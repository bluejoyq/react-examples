import { ReactElement } from "react";
import { useLoadInfiniteData } from "./useLoadInfiniteData";
import { useSentryFetch } from "./useSentryFetch";

const PAGE_SIZE = 10;

export const Test = (): ReactElement => {
  const {
    data: remoteData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useLoadInfiniteData(PAGE_SIZE);
  const datas = remoteData?.pages.flatMap((page) => page) ?? [];
  const { sentryRefCallback } = useSentryFetch({ fetchNextPage });

  const isLoadable = hasNextPage && !isFetchingNextPage;
  const isRef = (idx: number) => idx == datas.length - PAGE_SIZE && isLoadable;
  return (
    <div
      style={{
        width: "50vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {datas.map((data, idx) => (
        <div
          key={data.id}
          ref={isRef(idx) ? sentryRefCallback : null}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            border: "1px solid black",
            padding: "10px",
          }}
        >
          <img
            src={data.src}
            alt={data.title}
            style={{ width: "100%", height: "auto" }}
          />
          <span>{data.title}</span>
        </div>
      ))}
      {isLoadable && (
        <div
          style={{
            width: "100%",
            backgroundColor: "red",
          }}
        >
          ...loading
        </div>
      )}
    </div>
  );
};
