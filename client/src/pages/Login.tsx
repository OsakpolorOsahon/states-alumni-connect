
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PasswordInput from '@/components/PasswordInput';
import { supabase } from '@/lib/supabase';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Test Supabase connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase.from('members').select('count').limit(1);
        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionStatus('error');
          toast({
            title: "Connection Error",
            description: "Cannot connect to the database. Please try again later.",
            variant: "destructive"
          });
        } else {
          console.log('Supabase connection successful');
          setConnectionStatus('connected');
        }
      } catch (error) {
        console.error('Connection test failed:', error);
        setConnectionStatus('error');
      }
    };

    testConnection();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      toast({
        title: "Login Timeout",
        description: "Login is taking too long. Please check your connection and try again.",
        variant: "destructive"
      });
    }, 10000); // 10 second timeout

    try {
      console.log('Starting login attempt...');
      const result = await signIn(formData.email, formData.password);
      clearTimeout(timeoutId);
      
      if (result && result.success) {
        toast({
          title: "Login Successful", 
          description: "Redirecting to dashboard...",
        });
        
        // Wait a moment for auth context to update
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        throw new Error('Login failed - no success response');
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Login error:', error);
      
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please verify your email address before signing in.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <p className="text-center text-muted-foreground">
                Sign in to your SMMOWCUB account
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#E10600] hover:bg-[#C10500]"
                  disabled={loading || connectionStatus !== 'connected'}
                >
                  {loading ? "Signing In..." : connectionStatus === 'checking' ? "Connecting..." : "Sign In"}
                </Button>
                
                {connectionStatus === 'error' && (
                  <div className="text-sm text-red-600 text-center mt-2">
                    ⚠️ Database connection error. Please refresh the page or try again later.
                  </div>
                )}
                
                {connectionStatus === 'connected' && (
                  <div className="text-sm text-green-600 text-center mt-2">
                    ✅ Connected to database
                  </div>
                )}
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-[#E10600] hover:underline">
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
