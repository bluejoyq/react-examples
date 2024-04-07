import { NextResponse } from "next/server";
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}
async function test() {
  await sleep(1000);
  return NextResponse.json({
    data: "hello world",
  });
}

export { test as GET };
