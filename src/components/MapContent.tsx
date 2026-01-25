import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Street } from '@/data/streetData';
import 'leaflet/dist/leaflet.css';

const getStatusColor = (status: 'safe' | 'moderate' | 'unsafe'): string => {
  switch (status) {
    case 'safe': return '#22c55e';
    case 'moderate': return '#eab308';
    case 'unsafe': return '#ef4444';
  }
};

interface MapContentProps {
  streets: Street[];
  onStreetClick: (street: Street) => void;
}

const MapContent = ({ streets, onStreetClick }: MapContentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylinesRef = useRef<L.Polyline[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([28.6139, 77.2090], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update polylines when streets change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing polylines
    polylinesRef.current.forEach(polyline => {
      map.removeLayer(polyline);
    });
    polylinesRef.current = [];

    // Add new polylines
    streets.forEach((street) => {
      const polyline = L.polyline(
        street.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngTuple),
        {
          color: getStatusColor(street.status),
          weight: 6,
          opacity: 0.8,
        }
      );

      polyline.on('click', () => {
        onStreetClick(street);
      });

      polyline.addTo(map);
      polylinesRef.current.push(polyline);
    });
  }, [streets, onStreetClick]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default MapContent;
