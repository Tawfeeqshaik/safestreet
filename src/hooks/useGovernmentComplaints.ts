import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface GovernmentComplaint {
  id: string;
  user_id: string;
  route_hash: string;
  start_location: string;
  end_location: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  walkability_score: number;
  distance_meters: number;
  complaint_type: string;
  description: string | null;
  cpgrams_redirect_url: string | null;
  redirected_at: string;
  created_at: string;
}

export interface CreateComplaintInput {
  route_hash: string;
  start_location: string;
  end_location: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  walkability_score: number;
  distance_meters: number;
  complaint_type: string;
  description?: string;
}

// CPGRAMS (Central Public Grievance Redress and Monitoring System) URL
export const CPGRAMS_URL = 'https://pgportal.gov.in/';

/**
 * Calculate the complaint threshold based on distance
 * - Short distances (< 1km): threshold = 40
 * - 1-3km: threshold = 35
 * - 3-5km: threshold = 25
 * - 5-7km: threshold = 20
 * - > 7km: complaints not allowed (impractical walking distance)
 */
export function getComplaintThreshold(distanceMeters: number): number | null {
  const distanceKm = distanceMeters / 1000;
  
  if (distanceKm > 7) {
    // Beyond practical walking limits - no complaint escalation
    return null;
  }
  
  if (distanceKm <= 1) return 40;
  if (distanceKm <= 3) return 35;
  if (distanceKm <= 5) return 25;
  return 20; // 5-7km
}

/**
 * Check if complaint escalation is allowed based on score and distance
 */
export function canEscalateComplaint(walkabilityScore: number, distanceMeters: number): boolean {
  const threshold = getComplaintThreshold(distanceMeters);
  
  if (threshold === null) {
    // Distance exceeds practical walking limits
    return false;
  }
  
  return walkabilityScore < threshold;
}

/**
 * Generate CPGRAMS redirect URL with pre-filled context
 */
export function generateCpgramsUrl(
  startLocation: string,
  endLocation: string,
  walkabilityScore: number,
  distanceMeters: number
): string {
  // CPGRAMS base URL - in production, this could include pre-filled form parameters
  // For now, we redirect to the main portal
  const baseUrl = CPGRAMS_URL;
  
  // You could encode context in URL parameters if the portal supports it
  // For CPGRAMS, users typically need to fill the form manually
  return baseUrl;
}

export function useUserComplaints() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-complaints', user?.id],
    queryFn: async (): Promise<GovernmentComplaint[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('government_complaints')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as GovernmentComplaint[];
    },
    enabled: !!user,
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateComplaintInput) => {
      if (!user) throw new Error('Must be logged in');

      const cpgramsUrl = generateCpgramsUrl(
        input.start_location,
        input.end_location,
        input.walkability_score,
        input.distance_meters
      );

      const { data, error } = await supabase
        .from('government_complaints')
        .insert({
          user_id: user.id,
          ...input,
          cpgrams_redirect_url: cpgramsUrl,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-complaints'] });
      queryClient.invalidateQueries({ queryKey: ['user-contributions'] });
    },
  });
}
