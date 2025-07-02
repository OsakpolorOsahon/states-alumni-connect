// src/pages/SignUp.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';          // ← import the Supabase client
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PasswordInput from '@/components/PasswordInput';
import {
  STATESHIP_YEARS,
  MOWCUB_POSITIONS,
  COUNCIL_OFFICES
} from '@/data/memberData';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();                         // ← only pull signUp
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [duesFile, setDuesFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    nickname: '',
    stateshipYear: '',
    lastPosition: '',
    councilOffice: 'None',
    latitude: null as number | null,
    longitude: null as number | null
  });

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        () => { /* ignore */ }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) passwords match?
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    // 2) files selected?
    if (!photoFile || !duesFile) {
      toast({
        title: "Error",
        description: "Please select both a profile photo and a dues proof file",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // 3) create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });
      if (authError || !authData.user) throw authError || new Error("Sign up failed");
      const userId = authData.user.id;

      // 4) upload photo
      const { data: photoData, error: photoErr } = await supabase
        .storage
        .from("member-files")
        .upload(`photos/${userId}/${Date.now()}-${photoFile.name}`, photoFile);
      if (photoErr || !photoData.path) throw photoErr || new Error("Photo upload failed");
      const photoUrl = supabase
        .storage
        .from("member-files")
        .getPublicUrl(photoData.path).publicUrl;

      // 5) upload dues proof
      const { data: duesData, error: duesErr } = await supabase
        .storage
        .from("member-files")
        .upload(`dues/${userId}/${Date.now()}-${duesFile.name}`, duesFile);
      if (duesErr || !duesData.path) throw duesErr || new Error("Dues upload failed");
      const duesUrl = supabase
        .storage
        .from("member-files")
        .getPublicUrl(duesData.path).publicUrl;

      // 6) insert member record
      const { error: dbError } = await supabase
        .from("members")
        .insert([{
          user_id: userId,
          full_name: formData.fullName,
          nickname: formData.nickname,
          stateship_year: formData.stateshipYear,
          last_mowcub_position: formData.lastPosition,
          current_council_office: formData.councilOffice,
          photo_url: photoUrl,
          dues_proof_url: duesUrl,
          latitude: formData.latitude,
          longitude: formData.longitude,
          status: "Pending"
        }]);
      if (dbError) throw dbError;

      toast({
        title: "Sign Up Successful",
        description: "Please check your email to verify your account, then wait for approval."
      });
      navigate('/pending-approval');

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
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
              <CardTitle className="text-2xl font-bold text-center">Join SMMOWCUB</CardTitle>
              <p className="text-center text-muted-foreground">
                Create your account to apply for membership
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email" type="email" required
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName" required
                      value={formData.fullName}
                      onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInput
                      id="password" required
                      value={formData.password}
                      onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <PasswordInput
                      id="confirmPassword" required
                      value={formData.confirmPassword}
                      onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Nickname */}
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname (Optional)</Label>
                  <Input
                    id="nickname"
                    value={formData.nickname}
                    onChange={e => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                  />
                </div>

                {/* MOWCUB Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Year of Statesmanship</Label>
                    <Select
                      value={formData.stateshipYear}
                      onValueChange={value => setFormData(prev => ({ ...prev, stateshipYear: value }))}
                      required
                    >
                      <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent>
                        {STATESHIP_YEARS.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Last MOWCUB Position</Label>
                    <Select
                      value={formData.lastPosition}
                      onValueChange={value => setFormData(prev => ({ ...prev, lastPosition: value }))}
                      required
                    >
                      <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                      <SelectContent>
                        {MOWCUB_POSITIONS.map(pos => (
                          <SelectItem key={pos.code} value={pos.code}>
                            {pos.code} – {pos.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Council Office */}
                <div className="space-y-2">
                  <Label>Current Council Office (if any)</Label>
                  <Select
                    value={formData.councilOffice}
                    onValueChange={value => setFormData(prev => ({ ...prev, councilOffice: value }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select office" /></SelectTrigger>
                    <SelectContent>
                      {COUNCIL_OFFICES.map(office => (
                        <SelectItem key={office} value={office}>{office}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setPhotoFile(e.target.files?.[0] ?? null)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dues Payment Proof</Label>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={e => setDuesFile(e.target.files?.[0] ?? null)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Submit Application'}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;