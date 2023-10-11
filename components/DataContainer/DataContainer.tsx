"use client";

import { UseDataContextProvider } from "@frdnspnzr/use-data";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const DataContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UseDataContextProvider client={queryClient}>
        {children}
      </UseDataContextProvider>
    </QueryClientProvider>
  );
};

export default DataContainer;
