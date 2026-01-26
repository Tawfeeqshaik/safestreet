import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Location } from '@/services/geocodingService';
import { Route } from '@/services/routingService';
import 'leaflet/dist/leaflet.css';

// Custom marker icons
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

interface RouteMapDisplayProps {
  startLocation: Location | null;
  endLocation: Location | null;
  route: Route | null;
}

export function RouteMapDisplay({ startLocation, endLocation, route }: RouteMapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers and route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    if (startMarkerRef.current) {
      map.removeLayer(startMarkerRef.current);
      startMarkerRef.current = null;
    }
    if (endMarkerRef.current) {
      map.removeLayer(endMarkerRef.current);
      endMarkerRef.current = null;
    }
    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    // Add start marker
    if (startLocation) {
      startMarkerRef.current = L.marker([startLocation.lat, startLocation.lng], {
        icon: createMarkerIcon('#22c55e')
      }).addTo(map);
      startMarkerRef.current.bindPopup(`<b>Start:</b><br>${startLocation.name.split(',')[0]}`);
    }

    // Add end marker
    if (endLocation) {
      endMarkerRef.current = L.marker([endLocation.lat, endLocation.lng], {
        icon: createMarkerIcon('#ef4444')
      }).addTo(map);
      endMarkerRef.current.bindPopup(`<b>End:</b><br>${endLocation.name.split(',')[0]}`);
    }

    // Add route line
    if (route && route.geometry.length > 0) {
      routeLineRef.current = L.polyline(
        route.geometry.map(coord => [coord[0], coord[1]] as L.LatLngTuple),
        {
          color: '#3b82f6',
          weight: 5,
          opacity: 0.8,
          lineCap: 'round',
          lineJoin: 'round'
        }
      ).addTo(map);
    }

    // Fit bounds
    const bounds = L.latLngBounds([]);
    
    if (startLocation) {
      bounds.extend([startLocation.lat, startLocation.lng]);
    }
    if (endLocation) {
      bounds.extend([endLocation.lat, endLocation.lng]);
    }
    if (route) {
      route.geometry.forEach(coord => {
        bounds.extend([coord[0], coord[1]]);
      });
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [startLocation, endLocation, route]);

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full rounded-xl overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
}
