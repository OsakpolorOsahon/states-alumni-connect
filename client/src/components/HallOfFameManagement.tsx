import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Plus, X, Star, Calendar, Trash2, Edit, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Member {
  id: string;
  full_name: string;
  nickname?: string;
  stateship_year: string;
}

interface HallOfFameEntry {
  id: string;
  member_id: string;
  achievement_title: string;
  achievement_description?: string;
  achievement_date?: string;
  created_at: string;
  member_name: string;
  member_nickname?: string;
  member_stateship_year: string;
}

const HallOfFameManagement = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [entries, setEntries] = useState<HallOfFameEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newEntry, setNewEntry] = useState({
    member_id: '',
    achievement_title: '',
    achievement_description: '',
    achievement_date: ''
  });

  const [editEntry, setEditEntry] = useState({
    achievement_title: '',
    achievement_description: '',
    achievement_date: ''
  });

  useEffect(() => {
    fetchMembers();
    fetchEntries();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, full_name, nickname, stateship_year')
        .eq('status', 'active')
        .order('full_name');
      
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to load members",
        variant: "destructive"
      });
    }
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hall_of_fame')
        .select(`
          id,
          member_id,
          achievement_title,
          achievement_description,
          achievement_date,
          created_at,
          members!inner(full_name, nickname, stateship_year)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const hallOfFameEntries = data?.map(entry => ({
        id: entry.id,
        member_id: entry.member_id,
        achievement_title: entry.achievement_title,
        achievement_description: entry.achievement_description,
        achievement_date: entry.achievement_date,
        created_at: entry.created_at,
        member_name: (entry.members as any)?.full_name || 'Unknown',
        member_nickname: (entry.members as any)?.nickname,
        member_stateship_year: (entry.members as any)?.stateship_year || 'Unknown'
      })) || [];
      
      setEntries(hallOfFameEntries);
    } catch (error) {
      console.error('Error fetching Hall of Fame entries:', error);
      toast({
        title: "Error",
        description: "Failed to load Hall of Fame entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async () => {
    if (!newEntry.member_id || !newEntry.achievement_title) {
      toast({
        title: "Error", 
        description: "Please fill in member and achievement title",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('hall_of_fame')
        .insert({
          member_id: newEntry.member_id,
          achievement_title: newEntry.achievement_title,
          achievement_description: newEntry.achievement_description,
          achievement_date: newEntry.achievement_date || null
        });

      if (error) throw error;

      // Award Hall of Famer badge automatically
      const { error: badgeError } = await supabase
        .from('badges')
        .insert({
          member_id: newEntry.member_id,
          badge_name: 'Hall of Famer',
          badge_code: 'HALL_OF_FAMER',
          description: `Inducted to Hall of Fame for: ${newEntry.achievement_title}`,
          awarded_by: member?.id,
          awarded_at: new Date().toISOString()
        });

      if (badgeError) {
        console.warn('Failed to award Hall of Famer badge:', badgeError);
      }

      toast({
        title: "Success",
        description: "Hall of Fame entry added successfully!",
      });

      setNewEntry({
        member_id: '',
        achievement_title: '',
        achievement_description: '',
        achievement_date: ''
      });
      setShowAddForm(false);
      fetchEntries();
    } catch (error) {
      console.error('Error adding Hall of Fame entry:', error);
      toast({
        title: "Error",
        description: "Failed to add Hall of Fame entry",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateEntry = async (entryId: string) => {
    if (!editEntry.achievement_title) {
      toast({
        title: "Error", 
        description: "Achievement title is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('hall_of_fame')
        .update({
          achievement_title: editEntry.achievement_title,
          achievement_description: editEntry.achievement_description,
          achievement_date: editEntry.achievement_date || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', entryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hall of Fame entry updated successfully!",
      });

      setEditingEntry(null);
      fetchEntries();
    } catch (error) {
      console.error('Error updating Hall of Fame entry:', error);
      toast({
        title: "Error",
        description: "Failed to update Hall of Fame entry",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const removeEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('hall_of_fame')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      toast({
        title: "Success", 
        description: "Hall of Fame entry removed successfully",
      });
      fetchEntries();
    } catch (error) {
      console.error('Error removing Hall of Fame entry:', error);
      toast({
        title: "Error",
        description: "Failed to remove Hall of Fame entry",
        variant: "destructive"
      });
    }
  };

  const startEditing = (entry: HallOfFameEntry) => {
    setEditEntry({
      achievement_title: entry.achievement_title,
      achievement_description: entry.achievement_description || '',
      achievement_date: entry.achievement_date || ''
    });
    setEditingEntry(entry.id);
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setEditEntry({
      achievement_title: '',
      achievement_description: '',
      achievement_date: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Hall of Fame Management</h3>
          <p className="text-sm text-muted-foreground">Recognize outstanding achievements of SMMOWCUB members</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="bg-[#E10600] hover:bg-[#E10600]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {/* Add Entry Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Add Hall of Fame Entry
                  </CardTitle>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Member</label>
                  <Select 
                    value={newEntry.member_id} 
                    onValueChange={(value) => setNewEntry(prev => ({ ...prev, member_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.full_name} ({member.stateship_year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Achievement Title *</label>
                  <Input
                    value={newEntry.achievement_title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, achievement_title: e.target.value }))}
                    placeholder="e.g., First PhD Graduate, Outstanding Leadership Award"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Achievement Description</label>
                  <Textarea
                    value={newEntry.achievement_description}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, achievement_description: e.target.value }))}
                    placeholder="Describe the achievement and its significance to SMMOWCUB"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Achievement Date</label>
                  <Input
                    value={newEntry.achievement_date}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, achievement_date: e.target.value }))}
                    placeholder="e.g., 2024, December 2023, or specific date"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={addEntry}
                    disabled={submitting}
                    className="bg-[#E10600] hover:bg-[#E10600]/90"
                  >
                    {submitting ? "Adding..." : "Add to Hall of Fame"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Hall of Fame Entries ({entries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E10600]"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No Hall of Fame entries yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:bg-muted/50"
                >
                  {editingEntry === entry.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Achievement Title</label>
                        <Input
                          value={editEntry.achievement_title}
                          onChange={(e) => setEditEntry(prev => ({ ...prev, achievement_title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={editEntry.achievement_description}
                          onChange={(e) => setEditEntry(prev => ({ ...prev, achievement_description: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input
                          value={editEntry.achievement_date}
                          onChange={(e) => setEditEntry(prev => ({ ...prev, achievement_date: e.target.value }))}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={cancelEditing}>
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => updateEntry(entry.id)}
                          disabled={submitting}
                          className="bg-[#E10600] hover:bg-[#E10600]/90"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-full bg-gold-100 text-gold-800">
                            <Star className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{entry.achievement_title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {entry.member_name}
                              {entry.member_nickname && ` (${entry.member_nickname})`}
                              {' - '}Stateship Year {entry.member_stateship_year}
                            </p>
                          </div>
                        </div>
                        
                        {entry.achievement_description && (
                          <p className="text-sm text-muted-foreground mb-2 ml-11">
                            {entry.achievement_description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground ml-11">
                          {entry.achievement_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {entry.achievement_date}
                            </span>
                          )}
                          <span>
                            Added {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(entry)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEntry(entry.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HallOfFameManagement;