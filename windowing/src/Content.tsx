import { DummyData } from "./useLoadInfiniteData";

export interface ContentProps {
  data: DummyData;
  ref: (instance: HTMLElement | null) => void;
  minHeight?: number;
}

export const Content = ({ data, ref, minHeight }: ContentProps) => {
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
