// src/pages/SignUp.tsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PasswordInput from '@/components/PasswordInput'
import {
  STATESHIP_YEARS,
  MOWCUB_POSITIONS,
  COUNCIL_OFFICES,
} from '@/data/memberData'

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

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
    longitude: null as number | null,
  })

  // capture geolocation once
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setFormData((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          })),
        () => {}
      )
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const result = await signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.fullName,
          nickname: formData.nickname,
          stateship_year: formData.stateshipYear,
          last_mowcub_position: formData.lastPosition,
          current_council_office: formData.councilOffice,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }
      )
      
      if (result.error) {
        toast({ title: 'Sign Up Failed', description: result.error, variant: 'destructive' })
      } else {
        if (result.warning) {
          toast({ 
            title: 'Account Created with Warning', 
            description: result.warning, 
            variant: 'default'
          })
        } else {
          toast({
            title: 'Account Created Successfully!',
            description: 'Please check your email and click the verification link to continue.',
          })
        }
        navigate('/email-verification');
      }
    } catch (err: any) {
      console.error('Signup form error:', err);
      toast({ title: 'Error', description: err.message || 'Unexpected error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Join SMMOWCUB</CardTitle>
              <p className="text-center text-muted-foreground">
                Member Sign-up
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
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, fullName: e.target.value }))
                      }
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
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, password: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Confirm Password</Label>
                    <PasswordInput
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, confirmPassword: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* Nickname */}
                <div>
                  <Label>Nickname (Optional)</Label>
                  <Input
                    value={formData.nickname}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, nickname: e.target.value }))
                    }
                  />
                </div>

                {/* MOWCUB Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Year of Statesmanship</Label>
                    <Select
                      required
                      value={formData.stateshipYear}
                      onValueChange={(v) =>
                        setFormData((p) => ({ ...p, stateshipYear: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATESHIP_YEARS.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Last MOWCUB Position</Label>
                    <Select
                      required
                      value={formData.lastPosition}
                      onValueChange={(v) =>
                        setFormData((p) => ({ ...p, lastPosition: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOWCUB_POSITIONS.map((p) => (
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
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, councilOffice: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select office" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNCIL_OFFICES.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
