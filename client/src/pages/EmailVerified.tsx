import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function EmailVerified() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl" data-testid="text-verified-title">
                Email Verified!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground" data-testid="text-verified-message">
                Your email has been verified successfully. You're one step closer to joining the SMMOWCUB community.
              </p>
              <p className="text-muted-foreground text-sm">
                Please upload your profile photo and proof of dues payment to complete your registration.
              </p>
              <div className="pt-4 space-y-3">
                <Link to="/login" className="block">
                  <Button
                    className="w-full"
                    variant="destructive"
                    data-testid="button-continue-upload"
                  >
                    Login to Upload Documents
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground">
                  You'll need to sign in first, then upload your documents.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
