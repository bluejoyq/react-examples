"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
export default function Boundary({ children }: PropsWithChildren) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              <h3>Error</h3>
              <button onClick={resetErrorBoundary}>다시 시도</button>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
