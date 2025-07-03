import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

function UploadDocuments() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photoFile, setPhotoFile] = useState<File|null>(null);
  const [duesFile, setDuesFile]   = useState<File|null>(null);
  const [loading, setLoading]     = useState(false);

  // Ensure state is present
  if (!state || !state.fullName) {
    navigate('/signup');
    return null;
  }

  const handleFinish = async () => {
    if (!photoFile || !duesFile) {
      toast({ title: 'Error', description: 'Please upload both files', variant: 'destructive' });
      return;
    }
    setLoading(true);

    try {
      // get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not signed in');

      // upload photo
      const photoPath = `photos/${user.id}/${Date.now()}_${photoFile.name}`;
      const { error: pErr, data: pData } = await supabase
        .storage.from('member-files')
        .upload(photoPath, photoFile);
      if (pErr) throw pErr;
      const photoUrl = supabase.storage.from('member-files').getPublicUrl(pData.path).publicUrl;

      // upload dues
      const duesPath = `dues/${user.id}/${Date.now()}_${duesFile.name}`;
      const { error: dErr, data: dData } = await supabase
        .storage.from('member-files')
        .upload(duesPath, duesFile);
      if (dErr) throw dErr;
      const duesUrl = supabase.storage.from('member-files').getPublicUrl(dData.path).publicUrl;

      // insert member record
      const { error: dbErr } = await supabase.from('members').insert([{
        user_id: user.id,
        full_name: state.fullName,
        nickname: state.nickname,
        stateship_year: state.year,
        last_mowcub_position: state.lastPos,
        current_council_office: state.office,
        photo_url: photoUrl,
        dues_proof_url: duesUrl,
        latitude: state.latitude,
        longitude: state.longitude,
        status: 'Pending'
      }]);
      if (dbErr) throw dbErr;

      toast({ title: 'Done!', description: 'Your application is pending approval.' });
      navigate('/pending-approval');

    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Upload Your Documents</CardTitle>
            <p className="text-muted-foreground">
              Profile photo and payment proof
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Profile Photo</Label>
              <input type="file" accept="image/*"
                onChange={e => setPhotoFile(e.target.files?.[0]||null)} />
            </div>
            <div>
              <Label>Dues Payment Proof</Label>
              <input type="file" accept=".pdf,image/*"
                onChange={e => setDuesFile(e.target.files?.[0]||null)} />
            </div>
            <Button onClick={handleFinish} className="w-full" disabled={loading}>
              {loading ? 'Submitting…' : 'Finish Registration'}
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

// Wrap in ProtectedRoute so only signed-in users can access
export default function ProtectedUpload() {
  return (
    <ProtectedRoute>
      <UploadDocuments />
    </ProtectedRoute>
  );
}