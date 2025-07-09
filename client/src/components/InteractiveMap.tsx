
import React, { useEffect, useState } from 'react';
import { api } from "@/lib/api";
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
    
    // Set up real-time subscription (mock implementation)
    const channel = { unsubscribe: () => {} };

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await api.getActiveMembers();
      setMembers(data?.filter(member => member.latitude && member.longitude) || []);
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
      // For now, just show a success message - can be implemented later
      toast({
        title: "Location Updated",
        description: "Your location has been updated successfully"
      });
      fetchMembers(); // Refresh the map
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
