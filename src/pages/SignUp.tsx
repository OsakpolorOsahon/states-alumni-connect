
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    nickname: "",
    stateshipYear: "",
    lastMowcubPosition: "",
    currentCouncilOffice: "None",
    photoUrl: "",
    duesProofUrl: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const stateshipYears = [
    '2015/2016', '2016/2017', '2017/2018', '2018/2019', '2019/2020', '2020/2021',
    '2021/2022', '2022/2023', '2023/2024', '2024/2025', '2025/2026'
  ];

  const mowcubPositions = [
    'CINC', 'CGS', 'AG', 'GOC', 'PM', 'EC', 'QMG', 'DSD', 'STO', 'BM', 'DO',
    'FCRO', 'DOP', 'CSO', 'DOH', 'CDI', 'CMO', 'HOV', 'DAG', 'DPM', 'DQMG',
    'DDSD', 'DBM', 'DDO', 'DFCRO', 'DDOP', 'DDOH', 'PC', 'ADC', 'DI', 'None'
  ];

  const councilOffices = [
    'President',
    'Vice President (Diaspora)',
    'Vice President (National)',
    'Secretary-General',
    'Assistant Secretary-General',
    'Treasurer',
    'Director of Finance',
    'Director of Socials',
    'Director of Public Relations',
    'Provost Marshal',
    'Deputy Provost Marshal',
    'Ex-Officio (I)',
    'Ex-Officio (II)',
    'None'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      if (!formData.fullName || !formData.stateshipYear || !formData.lastMowcubPosition) {
        throw new Error("Please fill in all required fields");
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create member profile with correct field names
        const { error: profileError } = await supabase
          .from('members')
          .insert({
            user_id: authData.user.id,
            full_name: formData.fullName,
            nickname: formData.nickname || null,
            stateship_year: formData.stateshipYear as any,
            last_mowcub_position: formData.lastMowcubPosition as any,
            current_council_office: formData.currentCouncilOffice === "None" ? "None" as any : formData.currentCouncilOffice as any,
            photo_url: formData.photoUrl || null,
            dues_proof_url: formData.duesProofUrl || null,
            status: 'Pending' as any,
            role: 'member' as any
          });

        if (profileError) throw profileError;

        toast({
          title: "Registration Successful!",
          description: "Your account has been created and is pending approval. You'll receive an email once approved.",
        });

        navigate("/pending-approval");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Join SMMOWCUB</CardTitle>
              <p className="text-muted-foreground mt-2">
                Create your account to connect with fellow Statesmen
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>

                  {/* Nickname */}
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>

                  {/* Year of Statesmanship */}
                  <div className="space-y-2">
                    <Label htmlFor="stateshipYear">Year of Statesmanship *</Label>
                    <Select value={formData.stateshipYear} onValueChange={(value) => setFormData(prev => ({ ...prev, stateshipYear: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                      <SelectContent>
                        {stateshipYears.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Last MOWCUB Position */}
                  <div className="space-y-2">
                    <Label htmlFor="lastMowcubPosition">Last MOWCUB Position *</Label>
                    <Select value={formData.lastMowcubPosition} onValueChange={(value) => setFormData(prev => ({ ...prev, lastMowcubPosition: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your position" />
                      </SelectTrigger>
                      <SelectContent>
                        {mowcubPositions.map(position => (
                          <SelectItem key={position} value={position}>{position}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Current Council Office */}
                  <div className="space-y-2">
                    <Label htmlFor="currentCouncilOffice">Current Council Office</Label>
                    <Select value={formData.currentCouncilOffice} onValueChange={(value) => setFormData(prev => ({ ...prev, currentCouncilOffice: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select office (if any)" />
                      </SelectTrigger>
                      <SelectContent>
                        {councilOffices.map(office => (
                          <SelectItem key={office} value={office}>{office}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="photoUrl">Profile Photo URL</Label>
                    <Input
                      id="photoUrl"
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={formData.photoUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duesProofUrl">Dues Payment Proof URL</Label>
                    <Input
                      id="duesProofUrl"
                      type="url"
                      placeholder="https://example.com/dues-proof.jpg"
                      value={formData.duesProofUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, duesProofUrl: e.target.value }))}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#E10600] hover:bg-[#C10500]"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <a href="/login" className="text-[#E10600] hover:underline font-medium">
                      Sign in here
                    </a>
                  </p>
                </div>
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
