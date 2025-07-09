
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Users } from "lucide-react";

interface MapControlsProps {
  memberCount: number;
  onGetCurrentLocation: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ memberCount, onGetCurrentLocation }) => {
  return (
    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Users className="h-4 w-4 text-[#E10600]" />
        <span className="font-semibold text-sm">SMMOWCUB Members</span>
      </div>
      <p className="text-xs text-muted-foreground">{memberCount} members shown</p>
      
      <Button
        size="sm"
        variant="outline"
        onClick={onGetCurrentLocation}
        className="mt-2 w-full text-xs"
      >
        <MapPin className="h-3 w-3 mr-1" />
        My Location
      </Button>
    </div>
  );
};

export default MapControls;
