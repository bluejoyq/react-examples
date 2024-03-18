import { QueryClient } from "@tanstack/react-query";
import { ReactElement } from "react";
import { Test } from "./Test";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});
export const App = (): ReactElement => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: localStoragePersister }}
    >
      <Test />
    </PersistQueryClientProvider>
  );
};
