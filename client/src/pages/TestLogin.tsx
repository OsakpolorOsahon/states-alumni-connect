import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApi } from '@/lib/firebaseApi';

const TestLogin = () => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFirebaseConnection = async () => {
    try {
      addTestResult('Testing Firebase connection...');
      const user = auth.currentUser;
      if (user) {
        addTestResult('✅ Firebase connection successful');
        addTestResult(`User: ${user.email}`);
      } else {
        addTestResult('✅ Firebase connection successful');
        addTestResult('No user logged in');
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

  const testFirebaseData = async () => {
    setLoading(true);
    addTestResult('Testing Firebase data operations...');
    
    try {
      // Test creating initial data
      await firebaseApi.createInitialData();
      addTestResult('✅ Initial data created');
      
      // Test fetching members
      const members = await firebaseApi.getAllMembers();
      addTestResult(`✅ Fetched ${members.length} members`);
      
      // Test fetching active members
      const activeMembers = await firebaseApi.getActiveMembers();
      addTestResult(`✅ Fetched ${activeMembers.length} active members`);
      
    } catch (error) {
      addTestResult(`❌ Data operation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    addTestResult('Testing signup with new user...');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        `test-${Date.now()}@example.com`,
        'password123'
      );
      
      addTestResult('✅ Signup successful');
      addTestResult(`User ID: ${userCredential.user.uid}`);
      
      // Test creating member data
      await firebaseApi.createMember({
        userId: userCredential.user.uid,
        fullName: 'Test User',
        nickname: 'Tester',
        stateshipYear: '2024',
        lastMowcubPosition: 'Private',
        currentCouncilOffice: 'Member',
        role: 'member',
        status: 'active'
      });
      
      addTestResult('✅ Member profile created');
      
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
              <div className="flex gap-2 flex-wrap">
                <Button onClick={testFirebaseConnection} disabled={loading}>
                  Test Connection
                </Button>
                <Button onClick={testLogin} disabled={loading}>
                  Test Login
                </Button>
                <Button onClick={testSignup} disabled={loading}>
                  Test Signup
                </Button>
                <Button onClick={testFirebaseData} disabled={loading}>
                  Test Data
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