import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { supabase } from '@/lib/supabase';

const TestLogin = () => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSupabaseConnection = async () => {
    try {
      addTestResult('Testing Supabase connection...');
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        addTestResult(`❌ Supabase error: ${error.message}`);
      } else {
        addTestResult('✅ Supabase connection successful');
        addTestResult(`Session: ${data.session ? 'Active' : 'None'}`);
      }
    } catch (error) {
      addTestResult(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    addTestResult('Testing login with test@example.com...');
    
    try {
      const result = await signIn('test@example.com', 'password123');
      if (result.error) {
        addTestResult(`❌ Login failed: ${result.error}`);
      } else {
        addTestResult('✅ Login successful');
      }
    } catch (error) {
      addTestResult(`❌ Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    addTestResult('Testing signup with new user...');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
      });
      
      if (error) {
        addTestResult(`❌ Signup failed: ${error.message}`);
      } else {
        addTestResult('✅ Signup successful');
        addTestResult(`User ID: ${data.user?.id}`);
      }
    } catch (error) {
      addTestResult(`❌ Signup error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>🔧 Authentication Test Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={testSupabaseConnection} disabled={loading}>
                  Test Connection
                </Button>
                <Button onClick={testLogin} disabled={loading}>
                  Test Login
                </Button>
                <Button onClick={testSignup} disabled={loading}>
                  Test Signup
                </Button>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Test Results:</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
                  {testResults.length === 0 ? (
                    <p className="text-gray-500">No tests run yet</p>
                  ) : (
                    testResults.map((result, index) => (
                      <div key={index} className="text-sm font-mono mb-1">
                        {result}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Test Credentials:</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Email:</strong> test@example.com</p>
                  <p><strong>Password:</strong> password123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestLogin;