
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    lastMowcubWarSession: "",
    lastMowcubPosition: "",
    currentCouncilOffice: "",
    profilePhoto: null as File | null,
    proofOfDues: null as File | null,
    password: "",
  });

  // Generate war session options from 2024/2025 back to 1976/1977
  const warSessions = Array.from({ length: 49 }, (_, i) => {
    const startYear = 2024 - i;
    const endYear = startYear + 1;
    return `${startYear}/${endYear}`;
  });

  const mowcubPositions = [
    "None",
    "President (PRES)",
    "Vice President (VP)",
    "Secretary General (SEC-GEN)",
    "Assistant Secretary General (ASST SEC-GEN)",
    "Financial Secretary (FIN-SEC)",
    "Treasurer (TREAS)",
    "Director of Socials (DOS)",
    "Public Relations Officer (PRO)",
    "Welfare Officer (WO)",
    "Squad Leader Alpha (SL-A)",
    "Squad Leader Bravo (SL-B)",
    "Squad Leader Charlie (SL-C)",
    "Assistant Squad Leader Alpha (ASL-A)",
    "Assistant Squad Leader Bravo (ASL-B)",
    "Assistant Squad Leader Charlie (ASL-C)"
  ];

  const councilOffices = [
    "None",
    "President (PRES)",
    "Vice President (VP)",
    "Secretary General (SEC-GEN)",
    "Assistant Secretary General (ASST SEC-GEN)",
    "Financial Secretary (FIN-SEC)",
    "Treasurer (TREAS)",
    "Director of Socials (DOS)",
    "Public Relations Officer (PRO)",
    "Welfare Officer (WO)",
    "Legal Advisor (LA)",
    "Publicity Secretary (PUB-SEC)",
    "Ex-Officio Member (EX-OFF)"
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
    <div className="min-h-screen bg-background dark:bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="dark:bg-card dark:border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground dark:text-foreground">
                Create Your SMMOWCUB Account
              </CardTitle>
              <p className="text-muted-foreground dark:text-muted-foreground mt-2">
                Join the exclusive network of University of Benin Man O' War Alumni
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium dark:text-foreground">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jane Doe"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="focus:ring-red-300 focus:border-red-300 dark:bg-background dark:border-border dark:text-foreground"
                  />
                </div>

                {/* Nickname */}
                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-sm font-medium dark:text-foreground">
                    Nickname (Optional)
                  </Label>
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="JD"
                    value={formData.nickname}
                    onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                    className="focus:ring-red-300 focus:border-red-300 dark:bg-background dark:border-border dark:text-foreground"
                  />
                </div>

                {/* Last MOWCUB War Session */}
                <div className="space-y-2">
                  <Label htmlFor="lastMowcubWarSession" className="text-sm font-medium dark:text-foreground">
                    Last MOWCUB War Session *
                  </Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, lastMowcubWarSession: value }))}>
                    <SelectTrigger className="focus:ring-red-300 focus:border-red-300 dark:bg-background dark:border-border dark:text-foreground">
                      <SelectValue placeholder="Select your last war session" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-popover dark:border-border">
                      {warSessions.map(session => (
                        <SelectItem key={session} value={session} className="dark:text-foreground dark:focus:bg-accent">
                          {session}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Last MOWCUB Position */}
                <div className="space-y-2">
                  <Label htmlFor="lastMowcubPosition" className="text-sm font-medium dark:text-foreground">
                    Last MOWCUB Position *
                  </Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, lastMowcubPosition: value }))}>
                    <SelectTrigger className="focus:ring-red-300 focus:border-red-300 dark:bg-background dark:border-border dark:text-foreground">
                      <SelectValue placeholder="Select your last position" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-popover dark:border-border">
                      {mowcubPositions.map(position => (
                        <SelectItem key={position} value={position} className="dark:text-foreground dark:focus:bg-accent">
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Council Office - Now Optional */}
                <div className="space-y-2">
                  <Label htmlFor="currentCouncilOffice" className="text-sm font-medium dark:text-foreground">
                    Current Council Office (Optional)
                  </Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, currentCouncilOffice: value }))}>
                    <SelectTrigger className="focus:ring-red-300 focus:border-red-300 dark:bg-background dark:border-border dark:text-foreground">
                      <SelectValue placeholder="Select your current office" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-popover dark:border-border">
                      {councilOffices.map(office => (
                        <SelectItem key={office} value={office} className="dark:text-foreground dark:focus:bg-accent">
                          {office}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Profile Photo */}
                <div className="space-y-2">
                  <Label htmlFor="profilePhoto" className="text-sm font-medium dark:text-foreground">
                    Profile Photo *
                  </Label>
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileChange("profilePhoto")}
                    className="focus:ring-red-300 focus:border-red-300 dark:bg-background dark:border-border dark:text-foreground"
                  />
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                    Upload a clear photo of yourself (JPG, PNG, max 5MB)
                  </p>
                </div>

                {/* Proof of Dues Payment */}
                <div className="space-y-2">
                  <Label htmlFor="proofOfDues" className="text-sm font-medium dark:text-foreground">
                    Proof of Dues Payment *
                  </Label>
                  <Input
                    id="proofOfDues"
                    type="file"
                    accept="image/*,.pdf"
                    required
                    onChange={handleFileChange("proofOfDues")}
                    className="focus:ring-red-300 focus:border-red-300 dark:bg-background dark:border-border dark:text-foreground"
                  />
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                    Upload receipt or proof of membership dues payment
                  </p>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium dark:text-foreground">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="focus:ring-red-300 focus:border-red-300 dark:bg-background dark:border-border dark:text-foreground"
                  />
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">
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
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
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
      <Footer />
    </div>
  );
};

export default SignUp;
