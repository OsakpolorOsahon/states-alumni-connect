// Mock Supabase client for components that still reference it during migration
import { authService } from './auth';

// Create a mock supabase object to replace direct imports
export const supabase = {
  auth: {
    getUser: () => authService.getUser(),
    getSession: () => authService.getSession(),
    signInWithPassword: (params: { email: string; password: string }) => 
      authService.signIn(params.email, params.password),
    signUp: (params: { email: string; password: string; options?: any }) => 
      authService.signUp(params.email, params.password, params.options?.data),
    signOut: () => authService.signOut(),
    onAuthStateChange: (callback: (event: string, session: any) => void) => ({
      subscription: { unsubscribe: () => {} }
    })
  },
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => ({ data: null, error: null }),
        order: (column: string, options?: any) => ({ data: [], error: null }),
        limit: (count: number) => ({ data: [], error: null }),
        maybeSingle: () => ({ data: null, error: null })
      }),
      order: (column: string, options?: any) => ({ data: [], error: null }),
      limit: (count: number) => ({ data: [], error: null })
    }),
    insert: (data: any) => ({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({ data: null, error: null })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({ data: null, error: null })
    })
  }),
  channel: (name: string) => ({
    on: (event: string, config: any, callback: Function) => ({
      subscribe: () => ({ unsubscribe: () => {} })
    })
  }),
  removeChannel: (channel: any) => {
    if (channel && typeof channel.unsubscribe === 'function') {
      channel.unsubscribe();
    }
  },
  rpc: (functionName: string, params?: any) => {
    console.log(`Mock RPC call: ${functionName}`, params);
    return Promise.resolve({ data: null, error: null });
  }
};