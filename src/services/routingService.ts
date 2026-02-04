// OSRM Routing Service (Open Source Routing Machine)
import { Location } from './geocodingService';

export interface RouteStep {
  distance: number;
  duration: number;
  instruction: string;
  name: string;
  maneuver: {
    type: string;
    modifier?: string;
    location: [number, number];
  };
}

export interface Route {
  distance: number; // meters
  duration: number; // seconds
  geometry: [number, number][]; // lat, lng pairs
  steps: RouteStep[];
}

export interface RoutingResult {
  routes: Route[];
  waypoints: { name: string; location: [number, number] }[];
}

const OSRM_BASE_URL = 'https://router.project-osrm.org';

export async function calculateWalkingRoute(
  start: Location,
  end: Location
): Promise<RoutingResult | null> {
  try {
    // OSRM uses lng,lat format
    const coordinates = `${start.lng},${start.lat};${end.lng},${end.lat}`;
    
    // Request alternatives=true to get multiple route options including those using subways/underpasses
    // The foot profile considers pedestrian infrastructure (subways, footbridges, crossings) from OpenStreetMap
    const response = await fetch(
      `${OSRM_BASE_URL}/route/v1/foot/${coordinates}?overview=full&geometries=geojson&steps=true&annotations=true&alternatives=3`,
      {
        headers: {
          'User-Agent': 'WalkScoreCityHeart/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Routing request failed');
    }
    
    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      console.error('No route found:', data);
      return null;
    }
    
    const routes: Route[] = data.routes.map((route: any) => ({
      distance: route.distance,
      duration: route.duration,
      geometry: route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]), // Convert to lat, lng
      steps: route.legs[0]?.steps?.map((step: any) => ({
        distance: step.distance,
        duration: step.duration,
        instruction: getInstructionText(step.maneuver),
        name: step.name || 'Unnamed road',
        maneuver: {
          type: step.maneuver.type,
          modifier: step.maneuver.modifier,
          location: [step.maneuver.location[1], step.maneuver.location[0]] // Convert to lat, lng
        }
      })) || []
    }));
    
    // Sort routes by distance to ensure shortest route is first
    routes.sort((a, b) => a.distance - b.distance);
    
    return {
      routes,
      waypoints: data.waypoints.map((wp: any) => ({
        name: wp.name,
        location: [wp.location[1], wp.location[0]] // Convert to lat, lng
      }))
    };
  } catch (error) {
    console.error('Routing error:', error);
    return null;
  }
}

function getInstructionText(maneuver: { type: string; modifier?: string }): string {
  const { type, modifier } = maneuver;
  
  const instructions: Record<string, string> = {
    'depart': 'Start walking',
    'arrive': 'You have arrived',
    'turn-left': 'Turn left',
    'turn-right': 'Turn right',
    'turn-slight left': 'Turn slightly left',
    'turn-slight right': 'Turn slightly right',
    'turn-sharp left': 'Turn sharp left',
    'turn-sharp right': 'Turn sharp right',
    'continue': 'Continue straight',
    'merge': 'Merge',
    'fork-left': 'Keep left at the fork',
    'fork-right': 'Keep right at the fork',
    'roundabout': 'Enter the roundabout',
    'exit roundabout': 'Exit the roundabout',
    'end of road-left': 'At the end of the road, turn left',
    'end of road-right': 'At the end of the road, turn right',
    'new name': 'Continue',
    'notification': 'Note'
  };
  
  const key = modifier ? `${type}-${modifier}` : type;
  return instructions[key] || instructions[type] || `${type} ${modifier || ''}`.trim();
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
}

export function generateRouteHash(start: Location, end: Location): string {
  // Create a deterministic hash from coordinates (rounded to 4 decimal places)
  const startLat = start.lat.toFixed(4);
  const startLng = start.lng.toFixed(4);
  const endLat = end.lat.toFixed(4);
  const endLng = end.lng.toFixed(4);
  return `${startLat},${startLng}-${endLat},${endLng}`;
}
