import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RouteRating {
  id: string;
  user_id: string;
  route_hash: string;
  overall_rating: number;
  walkability_score: number | null;
  safety_score: number | null;
  lighting_score: number | null;
  accessibility_score: number | null;
  comment: string | null;
  created_at: string;
}

export interface RatingInput {
  route_hash: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  start_name?: string;
  end_name?: string;
  overall_rating: number;
  walkability_score?: number;
  safety_score?: number;
  lighting_score?: number;
  accessibility_score?: number;
  comment?: string;
}

export interface AggregateRating {
  average_overall: number;
  average_walkability: number;
  average_safety: number;
  average_lighting: number;
  average_accessibility: number;
  total_ratings: number;
}

export function useRouteRatings(routeHash: string | null) {
  return useQuery({
    queryKey: ['route-ratings', routeHash],
    queryFn: async (): Promise<RouteRating[]> => {
      if (!routeHash) return [];
      
      const { data, error } = await supabase
        .from('route_ratings')
        .select('*')
        .eq('route_hash', routeHash)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as RouteRating[];
    },
    enabled: !!routeHash
  });
}

export function useAggregateRating(routeHash: string | null) {
  const { data: ratings } = useRouteRatings(routeHash);
  
  if (!ratings || ratings.length === 0) {
    return null;
  }
  
  const aggregate: AggregateRating = {
    average_overall: ratings.reduce((sum, r) => sum + r.overall_rating, 0) / ratings.length,
    average_walkability: ratings.filter(r => r.walkability_score).reduce((sum, r) => sum + (r.walkability_score || 0), 0) / ratings.filter(r => r.walkability_score).length || 0,
    average_safety: ratings.filter(r => r.safety_score).reduce((sum, r) => sum + (r.safety_score || 0), 0) / ratings.filter(r => r.safety_score).length || 0,
    average_lighting: ratings.filter(r => r.lighting_score).reduce((sum, r) => sum + (r.lighting_score || 0), 0) / ratings.filter(r => r.lighting_score).length || 0,
    average_accessibility: ratings.filter(r => r.accessibility_score).reduce((sum, r) => sum + (r.accessibility_score || 0), 0) / ratings.filter(r => r.accessibility_score).length || 0,
    total_ratings: ratings.length
  };
  
  return aggregate;
}

export function useSubmitRating() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: RatingInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to rate');
      
      const { data, error } = await supabase
        .from('route_ratings')
        .upsert({
          user_id: user.id,
          ...input
        }, {
          onConflict: 'user_id,route_hash'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['route-ratings', variables.route_hash] });
    }
  });
}
