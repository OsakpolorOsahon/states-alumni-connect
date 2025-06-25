import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Mock member data with locations - using proper tuple types
  const members = [
    { id: 1, name: "John Doe", location: [3.3792, 6.5244] as [number, number], city: "Lagos, Nigeria" },
    { id: 2, name: "Jane Smith", location: [7.3775, 3.9470] as [number, number], city: "Abuja, Nigeria" },
    { id: 3, name: "David Johnson", location: [7.0785, 4.2574] as [number, number], city: "Ibadan, Nigeria" },
    { id: 4, name: "Sarah Wilson", location: [4.8156, 7.0498] as [number, number], city: "Port Harcourt, Nigeria" },
    { id: 5, name: "Michael Brown", location: [6.5244, 3.3792] as [number, number], city: "Benin City, Nigeria" }
  ];

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [8.6753, 9.0820], // Nigeria center
      zoom: 5.5,
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      setIsMapLoaded(true);
      
      // Add member markers
      members.forEach((member) => {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="p-2">
            <h3 class="font-semibold">${member.name}</h3>
            <p class="text-sm text-gray-600">${member.city}</p>
          </div>`
        );

        new mapboxgl.Marker({
          color: '#E10600',
          scale: 0.8
        })
          .setLngLat(member.location)
          .setPopup(popup)
          .addTo(map.current!);
      });

      // Add hover effects
      map.current!.on('mouseenter', 'members', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });

      map.current!.on('mouseleave', 'members', () => {
        map.current!.getCanvas().style.cursor = '';
      });
    });
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!mapboxToken) {
    return (
      <Card className="w-full max-w-md mx-auto animate-fade-in">
        <CardHeader>
          <CardTitle>Interactive Member Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To view the interactive map, please enter your Mapbox public token.
            You can get one from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-[#E10600] hover:underline">mapbox.com</a>
          </p>
          <Input
            type="text"
            placeholder="Enter Mapbox public token"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <Button 
            onClick={initializeMap}
            className="w-full bg-[#E10600] hover:bg-[#C10500]"
            disabled={!mapboxToken}
          >
            Load Map
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[600px] animate-scale-in">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h3 className="font-semibold text-sm mb-1">SMMOWCUB Members</h3>
        <p className="text-xs text-muted-foreground">{members.length} members shown</p>
      </div>
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E10600] mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
