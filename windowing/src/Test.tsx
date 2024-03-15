import { ReactElement } from "react";
import { useLoadInfiniteData } from "./useLoadInfiniteData";
import { useScrollFetch } from "./useScrollFetch";

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

  useScrollFetch({
    fetchNextPage,
    isLoadable,
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
        <div key={`page-${idx}`}>
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
                style={{ width: "100%", height: "auto" }}
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
