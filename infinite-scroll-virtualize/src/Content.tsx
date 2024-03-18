import { ForwardedRef, forwardRef } from "react";
import { DummyData } from "./useLoadInfiniteData";

export interface ContentProps {
  data: DummyData;
  minHeight?: number;
}

const ContentComponent = (
  { data, minHeight }: ContentProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  return (
    <div
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
  );
};

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ContentComponent,
);
