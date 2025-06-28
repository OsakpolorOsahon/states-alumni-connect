
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
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
    fullName: "",
    nickname: "",
    graduationYear: "",
    stateshipYear: "",
    lastMowcubPosition: "",
    currentCouncilOffice: "None",
    photoFile: null as File | null,
    duesFile: null as File | null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const graduationYears = Array.from({ length: 11 }, (_, i) => (2015 + i).toString());
  
  const stateshipYears = [
    '2015/2016', '2016/2017', '2017/2018', '2018/2019', '2019/2020', '2020/2021',
    '2021/2022', '2022/2023', '2023/2024', '2024/2025', '2025/2026'
  ];

  const mowcubPositions = [
    { code: 'CINC', title: 'Commander in Chief' },
    { code: 'CGS', title: 'Chief of General Staff' },
    { code: 'AG', title: 'Adjutant General' },
    { code: 'GOC', title: 'General Officer Commanding' },
    { code: 'PM', title: 'Provost Marshal' },
    { code: 'EC', title: 'Ekehuan Coordinator' },
    { code: 'QMG', title: 'Quartermaster General' },
    { code: 'DSD', title: 'Director of Special Duties' },
    { code: 'STO', title: 'Special Training Officer' },
    { code: 'BM', title: 'Base Major' },
    { code: 'DO', title: 'Director of Operations' },
    { code: 'FCRO', title: 'Female Cadet Relations Officer' },
    { code: 'DOP', title: 'Director of Protocol / Publicity' },
    { code: 'CSO', title: 'Chief Security Officer' },
    { code: 'DOH', title: 'Director of Health' },
    { code: 'CDI', title: 'Chief Director of Intelligence' },
    { code: 'CMO', title: 'Chief Maintenance Officer' },
    { code: 'HOV', title: 'Head of Vault' },
    { code: 'DAG', title: 'Deputy Adjutant General' },
    { code: 'DPM', title: 'Deputy Provost Marshal' },
    { code: 'DQMG', title: 'Deputy Quartermaster General' },
    { code: 'DDSD', title: 'Deputy Director of Special Duties' },
    { code: 'DBM', title: 'Deputy Base Major' },
    { code: 'DDO', title: 'Deputy Director of Operations' },
    { code: 'DFCRO', title: 'Deputy Female Cadet Relations Officer' },
    { code: 'DDOP', title: 'Deputy Director of Protocol / Publicity' },
    { code: 'DDOH', title: 'Deputy Director of Health' },
    { code: 'PC', title: 'Pay Clerk' },
    { code: 'ADC', title: 'Aide-de-Camp' },
    { code: 'DI', title: 'Director of Intelligence' },
    { code: 'None', title: 'None' }
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

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'Invalid email format';
        else delete newErrors.email;
        break;
      case 'password':
        if (!value) newErrors.password = 'Password is required';
        else if (value.length < 6) newErrors.password = 'Password must be at least 6 characters';
        else delete newErrors.password;
        break;
      case 'fullName':
        if (!value) newErrors.fullName = 'Full name is required';
        else delete newErrors.fullName;
        break;
      case 'graduationYear':
        if (!value) newErrors.graduationYear = 'Graduation year is required';
        else delete newErrors.graduationYear;
        break;
      case 'stateshipYear':
        if (!value) newErrors.stateshipYear = 'Year of statesmanship is required';
        else delete newErrors.stateshipYear;
        break;
      case 'lastMowcubPosition':
        if (!value) newErrors.lastMowcubPosition = 'Last MOWCUB position is required';
        else delete newErrors.lastMowcubPosition;
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFileChange = (name: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [name]: file }));
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = ['email', 'password', 'fullName', 'graduationYear', 'stateshipYear', 'lastMowcubPosition'];
    const newErrors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        let photoUrl = null;
        let duesUrl = null;

        // 2. Upload files if provided
        if (formData.photoFile) {
          const photoPath = `photos/${authData.user.id}/${Date.now()}_${formData.photoFile.name}`;
          photoUrl = await uploadFile(formData.photoFile, 'member-files', photoPath);
        }

        if (formData.duesFile) {
          const duesPath = `dues/${authData.user.id}/${Date.now()}_${formData.duesFile.name}`;
          duesUrl = await uploadFile(formData.duesFile, 'member-files', duesPath);
        }

        // 3. Create member record
        const { error: memberError } = await supabase
          .from('members')
          .insert({
            user_id: authData.user.id,
            full_name: formData.fullName,
            nickname: formData.nickname || null,
            graduation_year: formData.graduationYear,
            stateship_year: formData.stateshipYear as any,
            last_mowcub_position: formData.lastMowcubPosition as any,
            current_council_office: formData.currentCouncilOffice as any,
            photo_url: photoUrl,
            dues_proof_url: duesUrl,
            status: 'Pending' as any,
            role: 'member' as any
          });

        if (memberError) throw memberError;

        // Show success message and navigate
        toast({
          title: "Application Submitted!",
          description: "Thank you—your application is under review. You'll receive an email when approved.",
        });

        navigate("/pending-approval");
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Join SMMOWCUB</CardTitle>
              <p className="text-muted-foreground mt-2">
                Create your account to connect with fellow Statesmen
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={errors.fullName ? 'border-red-500' : ''}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                  </div>

                  {/* Nickname */}
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => handleInputChange('nickname', e.target.value)}
                    />
                  </div>

                  {/* Graduation Year */}
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year *</Label>
                    <Select value={formData.graduationYear} onValueChange={(value) => handleInputChange('graduationYear', value)}>
                      <SelectTrigger className={errors.graduationYear ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select graduation year" />
                      </SelectTrigger>
                      <SelectContent>
                        {graduationYears.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.graduationYear && <p className="text-red-500 text-sm">{errors.graduationYear}</p>}
                  </div>

                  {/* Year of Statesmanship */}
                  <div className="space-y-2">
                    <Label htmlFor="stateshipYear">Year of Statesmanship *</Label>
                    <Select value={formData.stateshipYear} onValueChange={(value) => handleInputChange('stateshipYear', value)}>
                      <SelectTrigger className={errors.stateshipYear ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select statesmanship year" />
                      </SelectTrigger>
                      <SelectContent>
                        {stateshipYears.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.stateshipYear && <p className="text-red-500 text-sm">{errors.stateshipYear}</p>}
                  </div>

                  {/* Last MOWCUB Position */}
                  <div className="space-y-2">
                    <Label htmlFor="lastMowcubPosition">Last MOWCUB Position *</Label>
                    <Select value={formData.lastMowcubPosition} onValueChange={(value) => handleInputChange('lastMowcubPosition', value)}>
                      <SelectTrigger className={errors.lastMowcubPosition ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select your position" />
                      </SelectTrigger>
                      <SelectContent>
                        {mowcubPositions.map(position => (
                          <SelectItem key={position.code} value={position.code}>
                            {position.code} - {position.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.lastMowcubPosition && <p className="text-red-500 text-sm">{errors.lastMowcubPosition}</p>}
                  </div>

                  {/* Current Council Office */}
                  <div className="space-y-2">
                    <Label htmlFor="currentCouncilOffice">Current Council Office</Label>
                    <Select value={formData.currentCouncilOffice} onValueChange={(value) => handleInputChange('currentCouncilOffice', value)}>
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

                {/* File Uploads */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="photoFile">Profile Photo</Label>
                    <Input
                      id="photoFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('photoFile', e.target.files?.[0] || null)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duesFile">Proof of Dues Payment</Label>
                    <Input
                      id="duesFile"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange('duesFile', e.target.files?.[0] || null)}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#E10600] hover:bg-[#C10500]"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Submit Application"}
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
