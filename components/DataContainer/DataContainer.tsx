"use client";

import { UseDataContextProvider } from "@frdnspnzr/use-data";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const DataContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <UseDataContextProvider client={queryClient}>
        {children}
      </UseDataContextProvider>
    </QueryClientProvider>
  );
};

export default DataContainer;
