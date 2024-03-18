import { ReactElement } from "react";
import { useLoadInfiniteData } from "./useLoadInfiniteData";
import { useScrollVirtualizer } from "./useScrollVirtualizer";

const PAGE_SIZE = 1000;

export const Test = (): ReactElement => {
  const {
    data: remoteData,
    hasNextPage,
    isFetchingNextPage,
  } = useLoadInfiniteData(PAGE_SIZE);

  const contents = (remoteData?.pages ?? []).flat();
  const isLoadable = hasNextPage && !isFetchingNextPage;
  const contentHeight = `calc(50vw + 19.5px)`;
  const { virtualContents, containerHeight, top } = useScrollVirtualizer({
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
      <div
        style={{
          position: "absolute",
          top: top,
        }}
      >
        {virtualContents.map(({ data, ref, minHeight }) => (
          <div
            key={data.id}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              border: "1px solid black",
              padding: "10px",
              minHeight: minHeight,
            }}
            ref={ref}
          >
            <img
              src={data.src}
              alt={data.title}
              style={{ width: "100%", height: "auto" }}
              loading="lazy"
            />
            <span>{data.title}</span>
          </div>
        ))}
      </div>
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
