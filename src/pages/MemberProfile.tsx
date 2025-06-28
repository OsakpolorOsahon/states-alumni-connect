
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Award, Calendar, User, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: string;
  full_name: string;
  nickname?: string;
  graduation_year: string;
  stateship_year: string;
  last_mowcub_position: string;
  current_council_office?: string;
  photo_url?: string;
  latitude?: number;
  longitude?: number;
  paid_through?: string;
}

interface Badge {
  id: string;
  badge_name: string;
  badge_code: string;
  description?: string;
  awarded_at: string;
}

const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [member, setMember] = useState<Member | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!id) return;

      try {
        // Fetch member details
        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .select('*')
          .eq('id', id)
          .eq('status', 'Active')
          .single();

        if (memberError) throw memberError;

        setMember(memberData);

        // Fetch member badges
        const { data: badgeData, error: badgeError } = await supabase
          .from('badges')
          .select('*')
          .eq('member_id', id);

        if (badgeError) throw badgeError;

        setBadges(badgeData || []);
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
                      <Calendar className="w-4 h-4 text-[#E10600]" />
                      <span className="text-sm">
                        <strong>Graduation:</strong> {member.graduation_year}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#E10600]" />
                      <span className="text-sm">
                        <strong>War Session:</strong> {member.stateship_year}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#E10600]" />
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recognition Badges ({badges.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length > 0 ? (
                  <div className="space-y-4">
                    {badges.map(badge => (
                      <div key={badge.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 bg-[#E10600] text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {badge.badge_code}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{badge.badge_name}</h4>
                          {badge.description && (
                            <p className="text-sm text-muted-foreground">{badge.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Awarded: {new Date(badge.awarded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No badges awarded yet
                  </p>
                )}
              </CardContent>
            </Card>

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
                    <Button variant="outline" className="w-full">
                      <MapPin className="w-4 h-4 mr-2" />
                      View on Map
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
