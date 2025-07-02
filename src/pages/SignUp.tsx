// src/pages/SignUp.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PasswordInput from '@/components/PasswordInput';
import {
  STATESHIP_YEARS,
  MOWCUB_POSITIONS,
  COUNCIL_OFFICES
} from '@/data/memberData';

export default function SignUp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // raw files
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [duesFile, setDuesFile]     = useState<File | null>(null);

  // form fields
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName]           = useState('');
  const [nickname, setNickname]           = useState('');
  const [stateshipYear, setStateshipYear] = useState('');
  const [lastPosition, setLastPosition]   = useState('');
  const [councilOffice, setCouncilOffice] = useState('None');
  const [latitude, setLatitude]           = useState<number | null>(null);
  const [longitude, setLongitude]         = useState<number | null>(null);

  // get geo
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
        },
        () => {}
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) validate passwords
    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    // 2) validate files selected
    if (!photoFile || !duesFile) {
      toast({ title: 'Error', description: 'Please select both photo and dues proof', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // 3) sign up
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password
      });
      if (signupError || !signupData.user) {
        throw signupError || new Error('Sign-up failed');
      }
      // 4) immediately sign in to get a session (for RLS)
      const { error: signinError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (signinError) {
        throw signinError;
      }
      const userId = signupData.user.id;

      // 5) upload photo
      const { data: photoData, error: photoError } = await supabase
        .storage
        .from('member-files')
        .upload(`photos/${userId}/${Date.now()}_${photoFile.name}`, photoFile);
      if (photoError || !photoData.path) throw photoError || new Error('Photo upload failed');
      const photoUrl = supabase.storage.from('member-files').getPublicUrl(photoData.path).publicUrl;

      // 6) upload dues proof
      const { data: duesData, error: duesError } = await supabase
        .storage
        .from('member-files')
        .upload(`dues/${userId}/${Date.now()}_${duesFile.name}`, duesFile);
      if (duesError || !duesData.path) throw duesError || new Error('Dues upload failed');
      const duesUrl = supabase.storage.from('member-files').getPublicUrl(duesData.path).publicUrl;

      // 7) insert member record
      const { error: dbError } = await supabase
        .from('members')
        .insert([{
          user_id: userId,
          full_name: fullName,
          nickname,
          stateship_year: stateshipYear,
          last_mowcub_position: lastPosition,
          current_council_office: councilOffice,
          photo_url: photoUrl,
          dues_proof_url: duesUrl,
          latitude,
          longitude,
          status: 'Pending'
        }]);
      if (dbError) throw dbError;

      // 8) success!
      toast({
        title: 'Sign Up Successful',
        description: 'Check your email to verify, then await approval.'
      });
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
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Join SMMOWCUB</CardTitle>
              <p className="text-center text-muted-foreground">
                Create your account to apply for membership
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email + Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Password</Label>
                    <PasswordInput
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Confirm Password</Label>
                    <PasswordInput
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Nickname */}
                <div>
                  <Label>Nickname (Optional)</Label>
                  <Input
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                  />
                </div>

                {/* MOWCUB Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Year of Statesmanship</Label>
                    <Select
                      required
                      value={stateshipYear}
                      onValueChange={setStateshipYear}
                    >
                      <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent>
                        {STATESHIP_YEARS.map(y => (
                          <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Last MOWCUB Position</Label>
                    <Select
                      required
                      value={lastPosition}
                      onValueChange={setLastPosition}
                    >
                      <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                      <SelectContent>
                        {MOWCUB_POSITIONS.map(p => (
                          <SelectItem key={p.code} value={p.code}>
                            {p.code} – {p.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Council Office */}
                <div>
                  <Label>Council Office (if any)</Label>
                  <Select
                    value={councilOffice}
                    onValueChange={setCouncilOffice}
                  >
                    <SelectTrigger><SelectValue placeholder="Select office" /></SelectTrigger>
                    <SelectContent>
                      {COUNCIL_OFFICES.map(o => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Profile Photo</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setPhotoFile(e.target.files?.[0] ?? null)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Dues Proof</Label>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={e => setDuesFile(e.target.files?.[0] ?? null)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
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