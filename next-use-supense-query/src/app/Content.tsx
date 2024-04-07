"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

function simulateFail(rate: number) {
  const num = Math.random();
  if (rate < num) {
    return true;
  }
  throw new Error("test error");
}
async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}
async function getRemoteData(): Promise<number[]> {
  await sleep(1000);
  simulateFail(0.7);
  console.log("data fetch");
  return new Array(5).fill(0).map(() => Math.random() * 10);
}

export default function Content() {
  const { data } = useSuspenseQuery({
    queryKey: ["data"],
    queryFn: getRemoteData,
    refetchInterval: 10200,
    retry: 0,
  });
  return (
    <section>
      {data.map((val, idx) => (
        <h4 key={idx}>{val}</h4>
      ))}
    </section>
  );
}
