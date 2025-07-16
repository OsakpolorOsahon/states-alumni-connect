// Simple authentication service for the migrated application
import { api } from './api';

interface User {
  id: string;
  email: string;
  role: 'member' | 'secretary';
  status: 'pending' | 'active' | 'inactive';
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

class AuthService {
  private state: AuthState = {
    user: null,
    loading: false,
    error: null,
  };

  private listeners: Array<(state: AuthState) => void> = [];

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  getState(): AuthState {
    return this.state;
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.state.loading = true;
    this.state.error = null;
    this.notify();

    try {
      // For now, create a mock authentication
      // In a real implementation, this would call your backend auth endpoint
      const mockUser: User = {
        id: '1',
        email: email,
        role: 'member',
        status: 'active',
      };

      this.state.user = mockUser;
      this.state.loading = false;
      this.state.error = null;
      this.notify();

      return { success: true };
    } catch (error) {
      this.state.loading = false;
      this.state.error = error instanceof Error ? error.message : 'Authentication failed';
      this.notify();
      return { success: false, error: this.state.error };
    }
  }

  async signUp(email: string, password: string, memberData: any): Promise<{ success: boolean; error?: string }> {
    this.state.loading = true;
    this.state.error = null;
    this.notify();

    try {
      // Create member record
      await api.createMember({
        ...memberData,
        userId: null, // Will be set after user creation
        status: 'pending',
      });

      // For now, auto-sign in the user
      const mockUser: User = {
        id: '1',
        email: email,
        role: 'member',
        status: 'pending',
      };

      this.state.user = mockUser;
      this.state.loading = false;
      this.state.error = null;
      this.notify();

      return { success: true };
    } catch (error) {
      this.state.loading = false;
      this.state.error = error instanceof Error ? error.message : 'Registration failed';
      this.notify();
      return { success: false, error: this.state.error };
    }
  }

  async signOut(): Promise<void> {
    this.state.user = null;
    this.state.loading = false;
    this.state.error = null;
    this.notify();
  }

  async checkAuth(): Promise<void> {
    this.state.loading = true;
    this.notify();

    try {
      // For now, check if we have a user in localStorage
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        this.state.user = JSON.parse(savedUser);
      }
    } catch (error) {
      // Ignore errors for now
    }

    this.state.loading = false;
    this.notify();
  }

  // Save user to localStorage for persistence
  private saveUser(user: User | null) {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }

  // Mock authentication methods for components that still need them
  async getUser() {
    return { data: { user: this.state.user }, error: null };
  }

  async getSession() {
    return { 
      data: { 
        session: this.state.user ? { 
          access_token: 'mock_token',
          user: this.state.user 
        } : null 
      }, 
      error: null 
    };
  }

  // Mock channel removal for realtime subscriptions
  removeChannel(channel: any) {
    if (channel && typeof channel.unsubscribe === 'function') {
      channel.unsubscribe();
    }
  }

  // Mock RPC calls
  async rpc(functionName: string, params?: any) {
    console.log(`Mock RPC call: ${functionName}`, params);
    return { data: null, error: null };
  }
}

export // Removed broken hooks