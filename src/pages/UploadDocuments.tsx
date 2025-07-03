// src/pages/UploadDocuments.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function UploadDocuments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // File objects
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [duesFile, setDuesFile] = useState<File | null>(null);

  // Uploaded URLs
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [duesUrl, setDuesUrl] = useState<string>('');

  // Ensure user is signed in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        toast({
          title: 'Not Signed In',
          description: 'Please sign up or log in first.',
          variant: 'destructive'
        });
        navigate('/login');
      }
    });
  }, []);

  const handleUploadAndSubmit = async () => {
    if (!photoFile || !duesFile) {
      toast({
        title: 'Files Required',
        description: 'Please select both photo and dues proof files before proceeding.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) throw userErr || new Error('User not authenticated');

      const userId = user.id;

      // 1) Upload profile photo
      const photoPath = `photos/${userId}/${Date.now()}_${photoFile.name}`;
      const { error: photoErr, data: photoData } = await supabase
        .storage
        .from('member-files')
        .upload(photoPath, photoFile);
      if (photoErr || !photoData?.path) throw photoErr || new Error('Photo upload failed');
      const photoPublicUrl = supabase
        .storage
        .from('member-files')
        .getPublicUrl(photoData.path).publicUrl;
      setPhotoUrl(photoPublicUrl);

      // 2) Upload dues proof
      const duesPath = `dues/${userId}/${Date.now()}_${duesFile.name}`;
      const { error: duesErr, data: duesData } = await supabase
        .storage
        .from('member-files')
        .upload(duesPath, duesFile);
      if (duesErr || !duesData?.path) throw duesErr || new Error('Dues upload failed');
      const duesPublicUrl = supabase
        .storage
        .from('member-files')
        .getPublicUrl(duesData.path).publicUrl;
      setDuesUrl(duesPublicUrl);

      // 3) Insert into members table
      const { error: dbErr } = await supabase
        .from('members')
        .insert([{
          user_id: userId,
          full_name: user.user_metadata.full_name,     // adjust if you stored these in metadata
          nickname: user.user_metadata.nickname || '',
          stateship_year: user.user_metadata.stateship_year || '',
          last_mowcub_position: user.user_metadata.last_position || '',
          current_council_office: user.user_metadata.council_office || 'None',
          photo_url: photoPublicUrl,
          dues_proof_url: duesPublicUrl,
          latitude: user.user_metadata.latitude || null,
          longitude: user.user_metadata.longitude || null,
          status: 'Pending'
        }]);
      if (dbErr) throw dbErr;

      toast({
        title: 'Upload Complete',
        description: 'Your documents were uploaded. Please await secretary approval.',
      });
      navigate('/pending-approval');

    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong uploading documents.',
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
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Upload Your Documents</CardTitle>
              <p className="text-center text-muted-foreground">
                Please upload your profile photo and dues payment proof.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block mb-1 font-medium">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setPhotoFile(e.target.files?.[0] ?? null)}
                  className="block w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Dues Payment Proof</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={e => setDuesFile(e.target.files?.[0] ?? null)}
                  className="block w-full"
                />
              </div>
              <Button
                onClick={handleUploadAndSubmit}
                disabled={loading || !photoFile || !duesFile}
                className="w-full"
              >
                {loading ? 'Uploading…' : 'Upload & Submit'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}