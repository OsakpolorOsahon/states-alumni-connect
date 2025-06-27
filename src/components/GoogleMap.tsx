
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users } from "lucide-react";

// Import the types to ensure they're loaded
import '../types/google-maps.d.ts';

interface Member {
  id: string;
  full_name: string;
  nickname?: string;
  latitude: number;
  longitude: number;
  current_council_office?: string;
  stateship_year: string;
}

interface GoogleMapProps {
  members?: Member[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onLocationUpdate?: (lat: number, lng: number) => void;
}

declare global {
  interface Window {
    google: any;
    initMap?: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  members = [], 
  center = { lat: 9.0820, lng: 8.6753 }, // Nigeria center
  zoom = 6,
  onLocationUpdate 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCg9S_V-LU6jR3lj0Q2WLDXTZURDRnMAAE&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#f5f5f5" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
          }
        ]
      });

      mapInstanceRef.current = map;
      setIsLoaded(true);

      // Add member markers
      members.forEach((member) => {
        const marker = new window.google.maps.Marker({
          position: { lat: member.latitude, lng: member.longitude },
          map,
          title: member.full_name,
          icon: {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#E10600" stroke="#000" stroke-width="1"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(15, 30)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-3 min-w-[200px]">
              <h3 class="font-semibold text-lg">${member.full_name}</h3>
              ${member.nickname ? `<p class="text-sm text-gray-600">"${member.nickname}"</p>` : ''}
              <p class="text-sm mt-1"><strong>Year:</strong> ${member.stateship_year}</p>
              ${member.current_council_office && member.current_council_office !== 'None' 
                ? `<p class="text-sm"><strong>Office:</strong> ${member.current_council_office}</p>` 
                : ''
              }
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      // Add click listener for location updates
      if (onLocationUpdate) {
        map.addListener('click', (event: any) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            onLocationUpdate(lat, lng);
          }
        });
      }
    };

    loadGoogleMaps();
  }, [members, center, zoom, onLocationUpdate]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          
          if (mapInstanceRef.current && window.google) {
            mapInstanceRef.current.setCenter(location);
            mapInstanceRef.current.setZoom(12);
            
            new window.google.maps.Marker({
              position: location,
              map: mapInstanceRef.current,
              title: "Your Location",
              icon: {
                url: 'data:image/svg+xml;base64,' + btoa(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="#fff" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" fill="#fff"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24),
                anchor: new window.google.maps.Point(12, 12)
              }
            });
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
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-[#E10600]" />
          <span className="font-semibold text-sm">SMMOWCUB Members</span>
        </div>
        <p className="text-xs text-muted-foreground">{members.length} members shown</p>
        
        <Button
          size="sm"
          variant="outline"
          onClick={getCurrentLocation}
          className="mt-2 w-full text-xs"
        >
          <MapPin className="h-3 w-3 mr-1" />
          My Location
        </Button>
      </div>
    </div>
  );
};

export default GoogleMap;
