import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactElement } from "react";
import { Test } from "./Test";

const queryClient = new QueryClient();
export const App = (): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <Test />
    </QueryClientProvider>
  );
};
