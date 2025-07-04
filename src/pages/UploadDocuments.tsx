// src/pages/UploadDocuments.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';

export default function UploadDocuments() {
  const { user, member, createMember, signOut, isVerified } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState('');
  const [duesUrl, setDuesUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // If no user yet (magic-link not captured), redirect to signup
  if (!user) {
    navigate('/signup');
    return null;
  }

  // If email not verified, show notice
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-lg mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Email Verification Required</p><?xml version="1.0" encoding="UTF-8"?>
</CardTitle>
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

  // If user already has a member record, redirect accordingly
  if (member) {
    if (member.status === 'Pending') {
      navigate('/pending-approval');
      return null;
    } else if (member.status === 'Active') {
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
    const geo = await new Promise<{ lat: number; lng: number }>((res) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => res({ lat: coords.latitude, lng: coords.longitude }),
        () => res({ lat: 0, lng: 0 })
      );
    });
    const { error } = await createMember({
      user_id: user.id,
      full_name: user.user_metadata.full_name || '',
      nickname: user.user_metadata.nickname || '',
      stateship_year: user.user_metadata.stateship_year || '',
      last_mowcub_position: user.user_metadata.last_mowcub_position || '',
      current_council_office: user.user_metadata.current_council_office || 'None',
      photo_url: photoUrl,
      dues_proof_url: duesUrl,
      latitude: geo.lat,
      longitude: geo.lng,
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Documents submitted, awaiting approval.' });
      navigate('/pending-approval');
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
                <FileUpload
                  label="Profile Photo"
                  accept="image/*"
                  folder={`photos`}
                  currentUrl={photoUrl}
                  onUpload={setPhotoUrl}
                  maxSize={5}
                />
                <FileUpload
                  label="Dues Payment Proof"
                  accept=".pdf,image/*"
                  folder={`dues`}
                  currentUrl={duesUrl}
                  onUpload={setDuesUrl}
                  maxSize={10}
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
