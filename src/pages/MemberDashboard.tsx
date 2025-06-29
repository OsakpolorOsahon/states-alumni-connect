
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Users, MapPin, Award, FileText, MessageSquare, Briefcase, BookOpen } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const MemberDashboard = () => {
  const { user, member, signOut, isSecretary } = useAuth();

  const quickLinks = [
    { title: "Empowerment Hub", description: "Access resources and training materials", icon: BookOpen, href: "/empowerment" },
    { title: "Job Board", description: "Explore career opportunities", icon: Briefcase, href: "/jobs" },
    { title: "Discussion Forums", description: "Connect with fellow members", icon: MessageSquare, href: "/forums" },
    { title: "Interactive Map", description: "Find members near you", icon: MapPin, href: "/map" },
    { title: "Hall of Fame", description: "Celebrate our distinguished members", icon: Award, href: "/hall-of-fame" },
    { title: "Directory", description: "Browse member directory", icon: Users, href: "/directory" }
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {member?.nickname || member?.full_name}!
              </h1>
              <p className="text-muted-foreground mt-2">
                {member?.current_council_office && member.current_council_office !== "None" 
                  ? `Current Office: ${member.current_council_office}` 
                  : `Last Position: ${member?.last_mowcub_position} (${member?.stateship_year})`
                }
              </p>
            </div>
            <div className="flex gap-2">
              {isSecretary && (
                <Button asChild className="bg-[#E10600] hover:bg-[#C10500]">
                  <a href="/secretary-dashboard">Secretary Dashboard</a>
                </Button>
              )}
              <Button variant="outline" onClick={signOut}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="mb-8">
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg text-amber-800 dark:text-amber-200">
                  Important Notice
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 dark:text-amber-300">
                Annual dues renewal is due by December 31st. Please ensure your membership remains active.
              </p>
              <Button size="sm" className="mt-3 bg-amber-600 hover:bg-amber-700">
                Renew Dues
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <Users className="h-8 w-8 text-[#E10600]" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Discussions</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <MessageSquare className="h-8 w-8 text-[#E10600]" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Job Openings</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Briefcase className="h-8 w-8 text-[#E10600]" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Your Badges</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Award className="h-8 w-8 text-[#E10600]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link) => (
              <Card key={link.title} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#E10600]/10 rounded-lg group-hover:bg-[#E10600]/20 transition-colors">
                      <link.icon className="h-5 w-5 text-[#E10600]" />
                    </div>
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{link.description}</p>
                  <Button asChild size="sm" variant="outline" className="border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white">
                    <a href={link.href}>Access</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-[#E10600] rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">New job posting available</p>
                  <p className="text-sm text-muted-foreground">Senior Software Engineer at TechCorp Nigeria</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-[#E10600] rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">New member joined</p>
                  <p className="text-sm text-muted-foreground">Welcome Michael Okonkwo (2019/2020)</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-[#E10600] rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Forum discussion started</p>
                  <p className="text-sm text-muted-foreground">"Networking Opportunities in Lagos"</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default MemberDashboard;
