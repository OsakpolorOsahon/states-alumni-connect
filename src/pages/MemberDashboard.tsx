
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Users, MapPin, Award, FileText, MessageSquare, Briefcase, BookOpen } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PushNotifications from "@/components/PushNotifications";

const MemberDashboard = () => {
  const { user, member, signOut, isSecretary } = useAuth();

  const quickLinks = [
    { title: "News & Events", description: "Latest updates and upcoming events", icon: FileText, href: "/news-events" },
    { title: "Hall of Fame", description: "Celebrate distinguished members", icon: Award, href: "/hall-of-fame" },
    { title: "Interactive Map", description: "Find members near you", icon: MapPin, href: "/map" },
    { title: "Directory", description: "Browse member directory", icon: Users, href: "/directory" },
    { title: "Job Board", description: "Explore career opportunities", icon: Briefcase, href: "/jobs" },
    { title: "Discussion Forums", description: "Connect with fellow members", icon: MessageSquare, href: "/forums" }
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Members</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Hall of Fame</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <Award className="h-8 w-8 text-[#E10600]" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Events This Month</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <FileText className="h-8 w-8 text-[#E10600]" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Your Network</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <MapPin className="h-8 w-8 text-[#E10600]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <Button
                        key={index}
                        asChild
                        variant="outline"
                        className="h-auto p-4 flex-col items-start gap-2 hover:bg-muted/50"
                      >
                        <a href={link.href}>
                          <div className="flex items-center gap-2 w-full">
                            <IconComponent className="h-5 w-5 text-[#E10600]" />
                            <span className="font-medium">{link.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground text-left">
                            {link.description}
                          </p>
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <div>
            <PushNotifications />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MemberDashboard;
