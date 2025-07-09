
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Mail, Phone } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const PendingApproval = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Application Under Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Thank you for submitting your SMMOWCUB membership application. 
                Your application is currently being reviewed by our secretariat.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg text-left">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Our secretariat will review your submitted documents</li>
                  <li>• Verification of your MOWCUB background will be conducted</li>
                  <li>• You will receive an email notification with the decision</li>
                  <li>• If approved, you'll gain full access to the platform</li>
                </ul>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Need assistance or have questions?</p>
                <div className="flex justify-center gap-4">
                  <a href="mailto:support@smmowcub.org" className="flex items-center gap-1 hover:text-foreground">
                    <Mail className="w-4 h-4" />
                    support@smmowcub.org
                  </a>
                  <a href="tel:+1234567890" className="flex items-center gap-1 hover:text-foreground">
                    <Phone className="w-4 h-4" />
                    Contact Us
                  </a>
                </div>
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

export default PendingApproval;
