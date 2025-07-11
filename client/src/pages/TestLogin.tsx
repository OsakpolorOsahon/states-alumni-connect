import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTestAuth } from '@/contexts/TestAuthContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const TestLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loginAsTestMember, loginAsTestSecretary } = useTestAuth();
  const [loading, setLoading] = useState(false);

  const handleTestMemberLogin = () => {
    setLoading(true);
    loginAsTestMember();
    toast({
      title: "Test Login Successful",
      description: "Logged in as Test Member",
    });
    setTimeout(() => {
      navigate('/dashboard');
      setLoading(false);
    }, 500);
  };

  const handleTestSecretaryLogin = () => {
    setLoading(true);
    loginAsTestSecretary();
    toast({
      title: "Test Login Successful", 
      description: "Logged in as Test Secretary",
    });
    setTimeout(() => {
      navigate('/secretary-dashboard');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Test Login</CardTitle>
              <p className="text-center text-muted-foreground">
                Quick login for testing purposes
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleTestMemberLogin}
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login as Test Member'}
              </Button>
              
              <Button 
                onClick={handleTestSecretaryLogin}
                className="w-full bg-[#E10600] hover:bg-[#C10500]"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login as Test Secretary'}
              </Button>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Need a real account?{' '}
                  <Link to="/signup" className="text-[#E10600] hover:underline">
                    Sign up here
                  </Link>
                  {' | '}
                  <Link to="/login" className="text-[#E10600] hover:underline">
                    Real Login
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

export default TestLogin;