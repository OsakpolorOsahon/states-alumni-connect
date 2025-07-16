import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const EmailVerification = () => {
  // Removed broken hooks

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                We've sent a verification link to your email address. 
                Please click the link to verify your account and continue with the registration process.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg text-left">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Check your email inbox (and spam folder)</li>
                  <li>2. Click the verification link in the email</li>
                  <li>3. You'll be redirected to upload your documents</li>
                  <li>4. Submit your application for review</li>
                </ul>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Didn't receive the email?</p>
                <p>Check your spam folder or contact support if the issue persists.</p>
              </div>

              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmailVerification;