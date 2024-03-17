import { ReactElement } from "react";
import { useLoadInfiniteData } from "./useLoadInfiniteData";
import { useScrollVirtualizer } from "./useScrollVirtualizer";

const PAGE_SIZE = 10000;

export const Test = (): ReactElement => {
  const {
    data: remoteData,
    hasNextPage,
    isFetchingNextPage,
  } = useLoadInfiniteData(PAGE_SIZE);

  const contents = (remoteData?.pages ?? []).flat();
  const isLoadable = hasNextPage && !isFetchingNextPage;
  const contentHeight = `calc(50vw + 19.5px)`;
  const { virtualContents, containerHeight } = useScrollVirtualizer({
    contents,
    contentHeight,
  });
  return (
    <div
      style={{
        width: "50vw",
        display: "flex",
        flexDirection: "column",
        height: containerHeight,
        position: "relative",
      }}
    >
      {virtualContents.map(({ data, top }) => (
        <div
          key={data.id}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            border: "1px solid black",
            padding: "10px",
            position: "absolute",
            top: top,
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
