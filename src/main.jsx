import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes";
import { HelmetProvider } from "react-helmet-async";
import AuthProvider from "./Firebase/AuthProvider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./Component/ui/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <RouterProvider router={router} future={{ v7_startTransition: true }} />
          </HelmetProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
