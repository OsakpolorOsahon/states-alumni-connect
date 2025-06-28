
export interface Member {
  id: string;
  full_name: string;
  nickname?: string;
  latitude: number;
  longitude: number;
  current_council_office?: string;
  stateship_year: string;
}

export interface GoogleMapProps {
  members?: Member[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onLocationUpdate?: (lat: number, lng: number) => void;
}

export interface MapInstance {
  map: typeof window.google.maps.Map | null;
  isLoaded: boolean;
}
