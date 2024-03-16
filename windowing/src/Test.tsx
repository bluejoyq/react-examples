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
  const pages = remoteData?.pages ?? [];

  const isLoadable = hasNextPage && !isFetchingNextPage;
  const isRef = (idx: number) => idx === pages.length - 1 && isLoadable;
  const { sentryRefCallback } = useSentryFetch({
    fetchNextPage,
  });
  return (
    <div
      style={{
        width: "50vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {pages.map((page, idx) => (
        <div key={`page-${idx}`} ref={isRef(idx) ? sentryRefCallback : null}>
          {page.map((data) => (
            <div
              key={data.id}
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
                style={{ width: "100%", height: "auto", aspectRatio: "1" }}
                loading="lazy"
              />
              <span>{data.title}</span>
            </div>
          ))}
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
