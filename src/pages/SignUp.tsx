// src/pages/SignUp.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Basic form fields only
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

  // Capture geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setFormData(prev => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }));
        },
        () => { /* ignore */ }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate matching passwords
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // signUp returns { error } if any
      const { error } = await signUp(
        formData.email,
        formData.password,
        {
          fullName: formData.fullName,
          nickname: formData.nickname,
          stateshipYear: formData.stateshipYear,
          lastPosition: formData.lastPosition,
          councilOffice: formData.councilOffice,
          latitude: formData.latitude,
          longitude: formData.longitude
        }
      );

      if (error) {
        toast({ title: 'Sign Up Failed', description: error.message, variant: 'destructive' });
      } else {
        toast({
          title: 'Account Created',
          description: 'Please check your email to verify, then upload your documents.'
        });
        // Redirect to our new upload-documents page
        navigate('/upload-documents');
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Unexpected error',
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
                {/* Email & Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      required
                      value={formData.fullName}
                      onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Password</Label>
                    <PasswordInput
                      required
                      value={formData.password}
                      onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Confirm Password</Label>
                    <PasswordInput
                      required
                      value={formData.confirmPassword}
                      onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Nickname */}
                <div>
                  <Label>Nickname (Optional)</Label>
                  <Input
                    value={formData.nickname}
                    onChange={e => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                  />
                </div>

                {/* MOWCUB Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Year of Statesmanship</Label>
                    <Select
                      required
                      value={formData.stateshipYear}
                      onValueChange={value => setFormData(prev => ({ ...prev, stateshipYear: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
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
                      value={formData.lastPosition}
                      onValueChange={value => setFormData(prev => ({ ...prev, lastPosition: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
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
                  <Label>Current Council Office (if any)</Label>
                  <Select
                    value={formData.councilOffice}
                    onValueChange={value => setFormData(prev => ({ ...prev, councilOffice: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select office" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNCIL_OFFICES.map(o => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Next: Upload Documents'}
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