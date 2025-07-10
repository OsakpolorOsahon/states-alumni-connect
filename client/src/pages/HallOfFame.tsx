import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Star, Medal, Award, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface HallOfFameMember {
  id: string;
  member_id: string;
  achievement_title: string;
  achievement_description?: string;
  achievement_date?: string;
  created_at: string;
  members: {
    full_name: string;
    nickname?: string;
    photo_url?: string;
    stateship_year: string;
    current_council_office?: string;
  };
}

const HallOfFame = () => {
  const [hallOfFameMembers, setHallOfFameMembers] = useState<HallOfFameMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    member_id: '',
    achievement_title: '',
    achievement_description: '',
    achievement_date: ''
  });
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);
  const { isSecretary } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchHallOfFame();
    if (isSecretary) {
      fetchAvailableMembers();
    }
  }, [isSecretary]);

  const fetchHallOfFame = async () => {
    try {
      const data = await firebaseApi.getAllHallOfFame();
      setHallOfFameMembers(data || []);
    } catch (error) {
      console.error('Error fetching hall of fame:', error);
      toast({
        title: "Error",
        description: "Failed to load Hall of Fame",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, full_name, nickname, stateship_year')
        .eq('status', 'Active')
        .order('full_name');

      if (error) throw error;
      setAvailableMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const addHallOfFameEntry = async () => {
    if (!newEntry.member_id || !newEntry.achievement_title) {
      toast({
        title: "Missing Information",
        description: "Please select a member and provide an achievement title",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const response = await fetch(`https://ojxgyaylosexrbvvllzg.supabase.co/functions/v1/addFameEntry`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEntry)
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Entry Added",
          description: "Hall of Fame entry has been added successfully"
        });
        setNewEntry({
          member_id: '',
          achievement_title: '',
          achievement_description: '',
          achievement_date: ''
        });
        setShowAddForm(false);
        fetchHallOfFame();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error adding hall of fame entry:', error);
      toast({
        title: "Error",
        description: "Failed to add Hall of Fame entry",
        variant: "destructive"
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAchievementIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('leadership') || lowerTitle.includes('president')) return Trophy;
    if (lowerTitle.includes('service') || lowerTitle.includes('community')) return Star;
    if (lowerTitle.includes('excellence') || lowerTitle.includes('outstanding')) return Medal;
    return Award;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Hall of Fame</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Celebrating the outstanding achievements and contributions of SMMOWCUB members
            who have made significant impacts in their communities and professions.
          </p>
        </div>

        {/* Add New Entry Button for Secretaries */}
        {isSecretary && (
          <div className="mb-8">
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#E10600] hover:bg-[#C10500]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Hall of Fame Entry
            </Button>
          </div>
        )}

        {/* Add New Entry Form */}
        {showAddForm && isSecretary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Hall of Fame Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Member</label>
                <select
                  value={newEntry.member_id}
                  onChange={(e) => setNewEntry({...newEntry, member_id: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Choose a member...</option>
                  {availableMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.full_name} ({member.stateship_year})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Achievement Title</label>
                <Input
                  value={newEntry.achievement_title}
                  onChange={(e) => setNewEntry({...newEntry, achievement_title: e.target.value})}
                  placeholder="e.g., Outstanding Leadership in Community Development"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Achievement Description</label>
                <Textarea
                  value={newEntry.achievement_description}
                  onChange={(e) => setNewEntry({...newEntry, achievement_description: e.target.value})}
                  placeholder="Describe the achievement in detail..."
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Achievement Date</label>
                <Input
                  type="date"
                  value={newEntry.achievement_date}
                  onChange={(e) => setNewEntry({...newEntry, achievement_date: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addHallOfFameEntry}>
                  Add Entry
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hall of Fame Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600] mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading Hall of Fame...</p>
          </div>
        ) : hallOfFameMembers.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Hall of Fame Entries Yet</h3>
            <p className="text-muted-foreground">
              Hall of Fame entries will appear here as members achieve outstanding recognition.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hallOfFameMembers.map((entry) => {
              const IconComponent = getAchievementIcon(entry.achievement_title);
              return (
                <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={entry.members.photo_url} alt={entry.members.full_name} />
                        <AvatarFallback className="bg-[#E10600] text-white">
                          {getInitials(entry.members.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{entry.members.full_name}</h3>
                        {entry.members.nickname && (
                          <p className="text-sm text-muted-foreground">"{entry.members.nickname}"</p>
                        )}
                        <Badge variant="secondary" className="text-xs mt-1">
                          {entry.members.stateship_year}
                        </Badge>
                      </div>

                      <IconComponent className="h-6 w-6 text-[#E10600]" />
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold text-[#E10600] mb-2">
                        {entry.achievement_title}
                      </h4>
                      {entry.achievement_description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {entry.achievement_description}
                        </p>
                      )}
                      {entry.achievement_date && (
                        <p className="text-xs text-muted-foreground">
                          Achievement Date: {new Date(entry.achievement_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HallOfFame;
