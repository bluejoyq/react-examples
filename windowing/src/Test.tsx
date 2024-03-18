import { ReactElement } from "react";
import { useLoadInfiniteData } from "./useLoadInfiniteData";
import { useScrollVirtualizer } from "./useScrollVirtualizer";
import { useSentryFetch } from "./useSentryFetch";
import { Content } from "./Content";

const PAGE_SIZE = 10;

export const Test = (): ReactElement => {
  const {
    data: remoteData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useLoadInfiniteData(PAGE_SIZE);

  const { sentryRefCallback } = useSentryFetch({
    fetchNextPage,
  });
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
        paddingBottom: isLoadable ? "19.5px" : "0",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: top,
        }}
      >
        {virtualContents.slice(0, -10).map((props) => (
          <Content key={props.data.id} {...props} />
        ))}
        <div ref={isLoadable ? sentryRefCallback : undefined}>
          {virtualContents.slice(-10).map((props) => (
            <Content key={props.data.id} {...props} />
          ))}
        </div>
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
