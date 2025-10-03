'use client';

import { ReactNode } from 'react';
import QueryProvider from './QueryProvider';
import ErrorBoundary from '../components/common/ErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        {children}
      </QueryProvider>
    </ErrorBoundary>
  );
}
