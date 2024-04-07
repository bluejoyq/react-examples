import { Suspense } from "react";
import Content from "./Content";
import Boundary from "./Boundary";

export default async function Home() {
  return (
    <main>
      <Boundary>
        <Content />
      </Boundary>
    </main>
  );
}
