import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Street } from '@/data/streetData';
import 'leaflet/dist/leaflet.css';

const getStatusColor = (status: 'safe' | 'moderate' | 'unsafe'): string => {
  switch (status) {
    case 'safe': return '#22c55e';
    case 'moderate': return '#eab308';
    case 'unsafe': return '#ef4444';
  }
};

const MapController = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

interface MapContentProps {
  streets: Street[];
  onStreetClick: (street: Street) => void;
}

const MapContent = ({ streets, onStreetClick }: MapContentProps) => {
  const center: LatLngExpression = [28.6139, 77.2090];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={center} />
      {streets.map((street) => (
        <Polyline
          key={street.id}
          positions={street.coordinates as LatLngExpression[]}
          pathOptions={{
            color: getStatusColor(street.status),
            weight: 6,
            opacity: 0.8,
          }}
          eventHandlers={{
            click: () => onStreetClick(street),
          }}
        />
      ))}
    </MapContainer>
  );
};

export default MapContent;
