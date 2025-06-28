
import { useState, useEffect } from "react";
import { Search, MapPin, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
}

const Directory = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGradYear, setSelectedGradYear] = useState("all");
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [selectedSession, setSelectedSession] = useState("all");
  const [nearbyRadius, setNearbyRadius] = useState("10");
  const [isLoading, setIsLoading] = useState(true);

  const graduationYears = Array.from({ length: 11 }, (_, i) => (2015 + i).toString());
  const stateshipYears = [
    '2015/2016', '2016/2017', '2017/2018', '2018/2019', '2019/2020', '2020/2021',
    '2021/2022', '2022/2023', '2023/2024', '2024/2025', '2025/2026'
  ];
  const councilOffices = [
    'President', 'Vice President (Diaspora)', 'Vice President (National)',
    'Secretary-General', 'Assistant Secretary-General', 'Treasurer',
    'Director of Finance', 'Director of Socials', 'Director of Public Relations',
    'Provost Marshal', 'Deputy Provost Marshal', 'Ex-Officio (I)', 'Ex-Officio (II)'
  ];

  // Fetch members and set up real-time subscription
  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('status', 'Active');

      if (error) {
        console.error('Error fetching members:', error);
        toast({
          title: "Error",
          description: "Failed to load members directory",
          variant: "destructive"
        });
      } else {
        setMembers(data || []);
      }
      setIsLoading(false);
    };

    fetchMembers();

    // Set up real-time subscription
    const subscription = supabase
      .channel('members-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'members' },
        (payload) => {
          if (payload.new.status === 'Active') {
            setMembers(prev => [...prev, payload.new as Member]);
          }
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'members' },
        (payload) => {
          if (payload.new.status === 'Active') {
            setMembers(prev => prev.map(member => 
              member.id === payload.new.id ? payload.new as Member : member
            ));
          } else {
            setMembers(prev => prev.filter(member => member.id !== payload.new.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Filter and sort members
  useEffect(() => {
    let filtered = members.filter(member => {
      const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (member.nickname && member.nickname.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesGradYear = selectedGradYear === "all" || member.graduation_year === selectedGradYear;
      const matchesOffice = selectedOffice === "all" || member.current_council_office === selectedOffice;
      const matchesSession = selectedSession === "all" || member.stateship_year === selectedSession;

      return matchesSearch && matchesGradYear && matchesOffice && matchesSession;
    });

    // Sort by: Office → Stateship Year (oldest first) → Last MOWCUB Position
    filtered.sort((a, b) => {
      // First by office (those with office positions first)
      const aHasOffice = a.current_council_office && a.current_council_office !== 'None';
      const bHasOffice = b.current_council_office && b.current_council_office !== 'None';
      
      if (aHasOffice && !bHasOffice) return -1;
      if (!aHasOffice && bHasOffice) return 1;
      
      // Then by stateship year (oldest first)
      if (a.stateship_year !== b.stateship_year) {
        return a.stateship_year.localeCompare(b.stateship_year);
      }
      
      // Finally by last MOWCUB position
      return a.last_mowcub_position.localeCompare(b.last_mowcub_position);
    });

    setFilteredMembers(filtered);
  }, [members, searchTerm, selectedGradYear, selectedOffice, selectedSession]);

  const handleNearbySearch = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const { data, error } = await supabase.rpc('get_nearby_members', {
            target_lat: latitude,
            target_lng: longitude,
            radius_km: parseInt(nearbyRadius)
          });

          if (error) throw error;

          setFilteredMembers(data || []);
          toast({
            title: "Nearby Members Found",
            description: `Found ${data?.length || 0} members within ${nearbyRadius}km`,
          });
        } catch (error) {
          console.error('Error finding nearby members:', error);
          toast({
            title: "Error",
            description: "Failed to find nearby members",
            variant: "destructive"
          });
        }
      },
      (error) => {
        toast({
          title: "Location Access Denied",
          description: "Please allow location access to find nearby members",
          variant: "destructive"
        });
      }
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600] mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading directory...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Statesmen Directory</h1>
          <p className="text-base text-muted-foreground max-w-3xl">
            Connect with fellow SMMOWCUB members across Nigeria and beyond. 
            Filter by graduation year, council office, or find members near you.
          </p>
        </div>

        {/* Sticky Controls Bar */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border mb-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search Bar */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Graduation Year Filter */}
            <Select value={selectedGradYear} onValueChange={setSelectedGradYear}>
              <SelectTrigger>
                <SelectValue placeholder="Graduation Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {graduationYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Council Office Filter */}
            <Select value={selectedOffice} onValueChange={setSelectedOffice}>
              <SelectTrigger>
                <SelectValue placeholder="Council Office" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Offices</SelectItem>
                <SelectItem value="None">None</SelectItem>
                {councilOffices.map(office => (
                  <SelectItem key={office} value={office}>{office}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Stateship Year Filter */}
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger>
                <SelectValue placeholder="War Session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                {stateshipYears.map(session => (
                  <SelectItem key={session} value={session}>{session}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Nearby Search */}
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="km"
                value={nearbyRadius}
                onChange={(e) => setNearbyRadius(e.target.value)}
                className="w-16"
              />
              <Button onClick={handleNearbySearch} variant="outline" className="flex-shrink-0">
                <MapPin className="w-4 h-4 mr-1" />
                Nearby
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">
              Showing {filteredMembers.length} of {members.length} active members
            </span>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <Card 
              key={member.id} 
              className="group hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => window.location.href = `/directory/${member.id}`}
            >
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={member.photo_url} alt={`${member.full_name} profile`} />
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-lg font-semibold">
                      {getInitials(member.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground">{member.full_name}</h3>
                    {member.nickname && (
                      <p className="text-sm text-muted-foreground">"{member.nickname}"</p>
                    )}
                    <p className="text-sm text-muted-foreground">Statesman</p>
                    <p className="text-sm text-gray-600">
                      {member.last_mowcub_position} ({member.stateship_year})
                    </p>
                    {member.current_council_office && member.current_council_office !== "None" && (
                      <Badge variant="secondary" className="text-xs">
                        {member.current_council_office}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No members found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search term.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Directory;
