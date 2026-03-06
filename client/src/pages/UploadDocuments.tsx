import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useConfig } from '@/contexts/ConfigContext';
import { createSupabaseClient } from '@/lib/supabase';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UploadThingFileUpload from '@/components/UploadThingFileUpload';

export default function UploadDocuments() {
  const navigate = useNavigate();
  const { user, member, signOut } = useAuth();
  const { toast } = useToast();
  const { config } = useConfig();
  const [photoUrl, setPhotoUrl] = useState('');
  const [duesUrl, setDuesUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const supabaseClient = config ? createSupabaseClient(config.supabaseUrl, config.supabaseAnonKey) : null;

  useEffect(() => {
    if (!user) {
      navigate('/signup', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (member && member.photo_url && member.dues_proof_url) {
      if (member.status === 'active') {
        navigate('/dashboard', { replace: true });
      } else if (member.status === 'pending') {
        navigate('/pending-approval', { replace: true });
      }
    }
  }, [member, navigate]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl || !duesUrl) {
      toast({ title: 'Error', description: 'Both files are required', variant: 'destructive' });
      return;
    }

    if (!supabaseClient || !member) {
      toast({ title: 'Error', description: 'Unable to save. Please try again.', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    
    try {
      let lat = 0;
      let lng = 0;
      try {
        const geo = await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('No geolocation'));
            return;
          }
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
            () => resolve({ lat: 0, lng: 0 }),
            { timeout: 5000 }
          );
        });
        lat = geo.lat;
        lng = geo.lng;
      } catch {
        console.log('Geolocation not available');
      }

      const { error } = await supabaseClient
        .from('members')
        .update({
          photo_url: photoUrl,
          dues_proof_url: duesUrl,
          latitude: lat,
          longitude: lng,
        })
        .eq('id', member.id);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      toast({ 
        title: 'Documents Uploaded Successfully!', 
        description: 'Your application is now pending approval from the secretary.' 
      });
      navigate('/pending-approval', { replace: true });
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
              <p className="text-center text-muted-foreground text-sm">
                Please upload your profile photo and proof of dues payment to complete your registration.
              </p>
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
                <Button 
                  type="submit" 
                  className="w-full bg-[#E10600] hover:bg-[#C10500]" 
                  disabled={loading || !photoUrl || !duesUrl}
                  data-testid="button-submit-documents"
                >
                  {loading ? 'Submitting...' : 'Submit Documents'}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <Button variant="ghost" size="sm" onClick={signOut} data-testid="button-signout">
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
