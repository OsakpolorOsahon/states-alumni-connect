// src/pages/UploadDocuments.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UploadThingFileUpload from '@/components/UploadThingFileUpload';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function UploadDocuments() {
  const { user, member, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [photoUrl, setPhotoUrl] = useState('');
  const [duesUrl, setDuesUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user came from email verification
  useEffect(() => {
    if (location.search.includes('mode=verifyEmail')) {
      toast({
        title: 'Email Verified Successfully!',
        description: 'Now please upload your documents to complete your registration.',
      });
    }
  }, [location, toast]);

  if (!user) {
    navigate('/signup');
    return null;
  }

  // Check if user email is verified
  if (!user.emailVerified && !location.search.includes('mode=verifyEmail')) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-lg mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Email Verification Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Please check your email and click the verification link before uploading documents.
                </p>
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
  }

  // If user already has a member record, redirect to appropriate page
  if (member) {
    if (member.status === 'pending') {
      navigate('/pending-approval');
      return null;
    } else if (member.status === 'active') {
      navigate('/dashboard');
      return null;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl || !duesUrl) {
      toast({ title: 'Error', description: 'Both files are required', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    
    try {
      // Get geolocation
      const geo = await new Promise<{ lat: number; lng: number }>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
          () => resolve({ lat: 0, lng: 0 })
        );
      });

      // Update the existing member document in Firestore
      if (member) {
        await updateDoc(doc(db, 'members', user.id), {
          photoUrl: photoUrl,
          duesProofUrl: duesUrl,
          latitude: geo.lat,
          longitude: geo.lng,
          updatedAt: new Date().toISOString()
        });
      }

      toast({ 
        title: 'Documents Uploaded Successfully!', 
        description: 'Your application is now pending approval from the secretary.' 
      });
      navigate('/pending-approval');
    } catch (error) {
      console.error('Upload error:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to submit documents. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Upload Your Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <UploadThingFileUpload
                  label="Profile Photo"
                  endpoint="memberPhotos"
                  onUpload={setPhotoUrl}
                  currentUrl={photoUrl}
                  maxSize="4MB"
                />
                <UploadThingFileUpload
                  label="Dues Payment Proof"
                  endpoint="duesProofs"
                  onUpload={setDuesUrl}
                  currentUrl={duesUrl}
                  maxSize="16MB"
                />
                <Button type="submit" className="w-full" disabled={loading || !photoUrl || !duesUrl}>
                  {loading ? 'Submitting...' : 'Submit Documents'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}