import { QueryClient } from '@tanstack/react-query';
import { apiRequest } from './api';

// Create query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Export the apiRequest function for mutations
export { apiRequest };