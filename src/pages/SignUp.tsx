// src/pages/SignUp.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import PasswordInput from '@/components/PasswordInput';
import { STATESHIP_YEARS, MOWCUB_POSITIONS, COUNCIL_OFFICES } from '@/data/memberData';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    nickname: '',
    stateshipYear: '',
    lastPosition: '',
    councilOffice: 'None',
    photoUrl: '',
    duesProofUrl: '',
    latitude: null as number | null,
    longitude: null as number | null
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setFormData(prev => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        })),
        () => {}
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    if (!formData.photoUrl || !formData.duesProofUrl) {
      toast({ title: "Error", description: "Please upload both profile photo and dues proof", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        {
          fullName: formData.fullName,
          nickname: formData.nickname,
          stateshipYear: formData.stateshipYear,
          lastPosition: formData.lastPosition,
          councilOffice: formData.councilOffice,
          photoUrl: formData.photoUrl,
          duesProofUrl: formData.duesProofUrl,
          latitude: formData.latitude,
          longitude: formData.longitude
        }
      );

      if (error) {
        toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
      } else {
        toast({
          title: "Sign Up Successful",
          description: "Please verify your email, then wait for approval."
        });
        navigate('/pending-approval');
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
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
              <p className="text-center text-muted-foreground">Create your account to apply for membership</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Email Address</Label><Input type="email" required value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} /></div>
                  <div><Label>Full Name</Label><Input required value={formData.fullName} onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))} /></div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Password</Label><PasswordInput required value={formData.password} onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))} /></div>
                  <div><Label>Confirm Password</Label><PasswordInput required value={formData.confirmPassword} onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))} /></div>
                </div>

                {/* Nickname */}
                <div><Label>Nickname (Optional)</Label><Input value={formData.nickname} onChange={e => setFormData(prev => ({ ...prev, nickname: e.target.value }))} /></div>

                {/* MOWCUB Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Year of Statesmanship</Label>
                    <Select required value={formData.stateshipYear} onValueChange={value => setFormData(prev => ({ ...prev, stateshipYear: value }))}>
                      <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent>
                        {STATESHIP_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Last MOWCUB Position</Label>
                    <Select required value={formData.lastPosition} onValueChange={value => setFormData(prev => ({ ...prev, lastPosition: value }))}>
                      <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                      <SelectContent>
                        {MOWCUB_POSITIONS.map(p => <SelectItem key={p.code} value={p.code}>{p.code} – {p.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Council Office */}
                <div>
                  <Label>Current Council Office (if any)</Label>
                  <Select value={formData.councilOffice} onValueChange={value => setFormData(prev => ({ ...prev, councilOffice: value }))}>
                    <SelectTrigger><SelectValue placeholder="Select office" /></SelectTrigger>
                    <SelectContent>
                      {COUNCIL_OFFICES.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileUpload label="Profile Photo" accept="image/*" folder="photos" currentUrl={formData.photoUrl} onUpload={url => setFormData(prev => ({ ...prev, photoUrl: url }))} maxSize={5} />
                  <FileUpload label="Dues Payment Proof" accept=".pdf,image/*" folder="dues" currentUrl={formData.duesProofUrl} onUpload={url => setFormData(prev => ({ ...prev, duesProofUrl: url }))} maxSize={10} />
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