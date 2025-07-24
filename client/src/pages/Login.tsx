
import React, { useState } from 'react';
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

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting login attempt for:', formData.email);
      const result = await signIn(formData.email, formData.password);
      
      console.log('Login result:', result);
      
      if (result && result.success) {
        console.log('Login successful, showing toast and navigating...');
        toast({
          title: "Login Successful", 
          description: "Redirecting to dashboard...",
        });
        
        // Navigate immediately instead of waiting
        console.log('Navigating to dashboard...');
        // Use both methods to ensure navigation works
        navigate('/dashboard', { replace: true });
        // Fallback in case React Router navigation fails
        setTimeout(() => {
          if (window.location.pathname === '/login') {
            window.location.href = '/dashboard';
          }
        }, 1000);
      } else {
        console.error('Login failed - no success response');
        throw new Error('Login failed - no success response');
      }
    } catch (error: any) {
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
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
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
