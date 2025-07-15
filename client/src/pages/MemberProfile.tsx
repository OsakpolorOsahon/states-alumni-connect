
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, User, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MemberProfileBadges from "@/components/MemberProfileBadges";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: string;
  full_name: string;
  nickname?: string;
  stateship_year: string;
  last_mowcub_position: string;
  current_council_office?: string;
  photo_url?: string;
  latitude?: number;
  longitude?: number;
  paid_through?: string;
}

const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!id) return;

      try {
        const memberData = await firebaseApi.getMember(id);
        setMember(memberData);
      } catch (error) {
        console.error('Error fetching member data:', error);
        toast({
          title: "Error",
          description: "Failed to load member profile",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, [id, toast]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isDuesExpired = () => {
    if (!member?.paid_through) return false;
    return new Date(member.paid_through) < new Date();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600] mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Member Not Found</h1>
            <p className="text-muted-foreground">The requested member profile could not be found.</p>
            <Button asChild className="mt-4">
              <a href="/directory">Back to Directory</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Dues Expiry Banner */}
          {isDuesExpired() && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Your dues have expired. Please renew to maintain active membership status.
                <Button size="sm" className="ml-4 bg-amber-600 hover:bg-amber-700">
                  Renew Your Dues
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Profile Header */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={member.photo_url} alt={`${member.full_name} profile`} />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-2xl font-semibold">
                    {getInitials(member.full_name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{member.full_name}</h1>
                    {member.nickname && (
                      <p className="text-xl text-muted-foreground">"{member.nickname}"</p>
                    )}
                    <p className="text-lg text-muted-foreground mt-2">Statesman</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#E10600]" />
                      <span className="text-sm">
                        <strong>War Session:</strong> {member.stateship_year}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#E10600]" />
                      <span className="text-sm">
                        <strong>Last Position:</strong> {member.last_mowcub_position}
                      </span>
                    </div>
                    {member.current_council_office && member.current_council_office !== "None" && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#E10600]" />
                        <span className="text-sm">
                          <strong>Current Office:</strong> {member.current_council_office}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Badges Section */}
            <MemberProfileBadges memberId={member.id} />

            {/* Location Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                {member.latitude && member.longitude ? (
                  <div className="space-y-4">
                    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">
                          Location: {member.latitude.toFixed(4)}, {member.longitude.toFixed(4)}
                        </p>
                        <p className="text-xs mt-1">
                          Interactive map integration coming soon
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/map">
                        <MapPin className="w-4 h-4 mr-2" />
                        View on Map
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Location not shared
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Button asChild variant="outline">
              <a href="/directory">← Back to Directory</a>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MemberProfile;
