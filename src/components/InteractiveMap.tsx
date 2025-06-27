
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import GoogleMap from './GoogleMap';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: string;
  full_name: string;
  nickname?: string;
  latitude: number;
  longitude: number;
  current_council_office?: string;
  stateship_year: string;
}

const InteractiveMap = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('members-map-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members'
        },
        () => {
          fetchMembers(); // Refetch when members change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, full_name, nickname, latitude, longitude, current_council_office, stateship_year')
        .eq('status', 'Active')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) throw error;

      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to load member locations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = async (lat: number, lng: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to update your location",
          variant: "destructive"
        });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to update your location",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`https://ojxgyaylosexrbvvllzg.supabase.co/functions/v1/updateMemberLocation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lat, lng })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Location Updated",
          description: "Your location has been updated successfully"
        });
        fetchMembers(); // Refresh the map
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E10600] mr-3"></div>
            <p>Loading member locations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <GoogleMap 
      members={members}
      onLocationUpdate={handleLocationUpdate}
    />
  );
};

export default InteractiveMap;
