
import { useEffect, useRef, useState } from 'react';
import { Member, MapInstance } from '@/types/map';
import { loadGoogleMapsScript, createMapStyles } from '@/utils/googleMapsLoader';
import { createMemberMarker } from '@/utils/mapMarkers';

export const useGoogleMap = (
  members: Member[],
  center: { lat: number; lng: number },
  zoom: number,
  onLocationUpdate?: (lat: number, lng: number) => void
) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        await loadGoogleMapsScript();
        
        if (!mapRef.current || !window.google) return;

        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: createMapStyles()
        });

        mapInstanceRef.current = map;
        setIsLoaded(true);

        // Add member markers
        members.forEach((member) => {
          createMemberMarker(member, map);
        });

        // Add click listener for location updates
        if (onLocationUpdate) {
          map.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();
              onLocationUpdate(lat, lng);
            }
          });
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    initializeMap();
  }, [members, center, zoom, onLocationUpdate]);

  return {
    mapRef,
    mapInstance: mapInstanceRef.current,
    isLoaded
  };
};
