
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    graduationYear: "",
    lastWarSession: "",
    lastMowcubPosition: "",
    currentCouncilOffice: "",
    profilePhoto: null as File | null,
    proofOfDues: null as File | null,
    password: "",
  });

  const graduationYears = Array.from({ length: 30 }, (_, i) => 2024 - i);
  const warSessions = ["Session 1", "Session 2", "Session 3", "Session 4", "Session 5"];
  const mowcubPositions = [
    "None",
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Financial Secretary",
    "Public Relations Officer",
    "Welfare Officer",
    "Squad Leader",
    "Assistant Squad Leader"
  ];
  const councilOffices = [
    "None",
    "President",
    "Vice President",
    "Secretary General",
    "Assistant Secretary General",
    "Financial Secretary",
    "Treasurer",
    "Director of Socials",
    "Public Relations Officer",
    "Welfare Officer"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    navigate("/pending-approval");
  };

  const handleFileChange = (field: "profilePhoto" | "proofOfDues") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground">
                Create Your SMMOWCUB Account
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Join the exclusive network of University of Benin Man O' War Alumni
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jane Doe"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="focus:ring-red-300 focus:border-red-300"
                  />
                </div>

                {/* Nickname */}
                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-sm font-medium">
                    Nickname (Optional)
                  </Label>
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="JD"
                    value={formData.nickname}
                    onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                    className="focus:ring-red-300 focus:border-red-300"
                  />
                </div>

                {/* Graduation Year */}
                <div className="space-y-2">
                  <Label htmlFor="graduationYear" className="text-sm font-medium">
                    Graduation Year *
                  </Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, graduationYear: value }))}>
                    <SelectTrigger className="focus:ring-red-300 focus:border-red-300">
                      <SelectValue placeholder="Select graduation year" />
                    </SelectTrigger>
                    <SelectContent>
                      {graduationYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Last War Session */}
                <div className="space-y-2">
                  <Label htmlFor="lastWarSession" className="text-sm font-medium">
                    Last War Session *
                  </Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, lastWarSession: value }))}>
                    <SelectTrigger className="focus:ring-red-300 focus:border-red-300">
                      <SelectValue placeholder="Select your last war session" />
                    </SelectTrigger>
                    <SelectContent>
                      {warSessions.map(session => (
                        <SelectItem key={session} value={session}>{session}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Last MOWCUB Position */}
                <div className="space-y-2">
                  <Label htmlFor="lastMowcubPosition" className="text-sm font-medium">
                    Last MOWCUB Position *
                  </Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, lastMowcubPosition: value }))}>
                    <SelectTrigger className="focus:ring-red-300 focus:border-red-300">
                      <SelectValue placeholder="Select your last position" />
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
                  <Label htmlFor="currentCouncilOffice" className="text-sm font-medium">
                    Current Council Office *
                  </Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, currentCouncilOffice: value }))}>
                    <SelectTrigger className="focus:ring-red-300 focus:border-red-300">
                      <SelectValue placeholder="Select your current office" />
                    </SelectTrigger>
                    <SelectContent>
                      {councilOffices.map(office => (
                        <SelectItem key={office} value={office}>{office}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Profile Photo */}
                <div className="space-y-2">
                  <Label htmlFor="profilePhoto" className="text-sm font-medium">
                    Profile Photo *
                  </Label>
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileChange("profilePhoto")}
                    className="focus:ring-red-300 focus:border-red-300"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a clear photo of yourself (JPG, PNG, max 5MB)
                  </p>
                </div>

                {/* Proof of Dues Payment */}
                <div className="space-y-2">
                  <Label htmlFor="proofOfDues" className="text-sm font-medium">
                    Proof of Dues Payment *
                  </Label>
                  <Input
                    id="proofOfDues"
                    type="file"
                    accept="image/*,.pdf"
                    required
                    onChange={handleFileChange("proofOfDues")}
                    className="focus:ring-red-300 focus:border-red-300"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload receipt or proof of membership dues payment
                  </p>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="focus:ring-red-300 focus:border-red-300"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters long
                  </p>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-[#E10600] hover:bg-[#C10500] text-white"
                  size="lg"
                >
                  Sign Up
                </Button>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <a href="/login" className="text-[#E10600] hover:underline font-medium">
                      Log in here
                    </a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
