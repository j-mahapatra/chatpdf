'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

type QueryProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export default function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
