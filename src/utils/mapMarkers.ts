
import { Member } from '@/types/map';

export const createMemberMarker = (member: Member, map: any) => {
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

  return marker;
};

export const createUserLocationMarker = (location: { lat: number; lng: number }, map: any) => {
  return new window.google.maps.Marker({
    position: location,
    map,
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
};
