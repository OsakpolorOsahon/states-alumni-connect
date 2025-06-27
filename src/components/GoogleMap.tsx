
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GoogleMapProps } from '@/types/map';
import { useGoogleMap } from '@/hooks/useGoogleMap';
import { createUserLocationMarker } from '@/utils/mapMarkers';
import MapControls from './MapControls';

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  members = [], 
  center = { lat: 9.0820, lng: 8.6753 }, // Nigeria center
  zoom = 6,
  onLocationUpdate 
}) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { mapRef, mapInstance, isLoaded } = useGoogleMap(members, center, zoom, onLocationUpdate);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          
          if (mapInstance && window.google) {
            mapInstance.setCenter(location);
            mapInstance.setZoom(12);
            
            createUserLocationMarker(location, mapInstance);
          }

          if (onLocationUpdate) {
            onLocationUpdate(location.lat, location.lng);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E10600] mr-3"></div>
            <p>Loading Google Maps...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[600px] rounded-lg shadow-lg" />
      
      <MapControls 
        memberCount={members.length}
        onGetCurrentLocation={getCurrentLocation}
      />
    </div>
  );
};

export default GoogleMap;
