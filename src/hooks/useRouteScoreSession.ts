import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface RouteScoreSession {
  id: string;
  user_id: string;
  route_hash: string;
  walkability_score: number;
  locked_at: string;
  expires_at: string;
}

/**
 * Hook to get a locked score session for a route
 * If a session exists and hasn't expired, returns the locked score
 */
export function useRouteScoreSession(routeHash: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['route-score-session', routeHash, user?.id],
    queryFn: async (): Promise<RouteScoreSession | null> => {
      if (!user || !routeHash) return null;

      const { data, error } = await supabase
        .from('route_score_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('route_hash', routeHash)
        .gte('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error) throw error;
      return data as RouteScoreSession | null;
    },
    enabled: !!user && !!routeHash,
  });
}

/**
 * Hook to create or update a score session for a route
 * This locks the walkability score for the user's current session
 */
export function useLockRouteScore() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ routeHash, walkabilityScore }: { routeHash: string; walkabilityScore: number }) => {
      if (!user) throw new Error('Must be logged in');

      // Upsert the session - creates or updates
      const { data, error } = await supabase
        .from('route_score_sessions')
        .upsert({
          user_id: user.id,
          route_hash: routeHash,
          walkability_score: walkabilityScore,
          locked_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
        }, {
          onConflict: 'user_id,route_hash'
        })
        .select()
        .single();

      if (error) throw error;
      return data as RouteScoreSession;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['route-score-session', variables.routeHash] });
    },
  });
}

/**
 * Generate a unique hash for a route based on start and end coordinates
 */
export function generateRouteHash(
  startLat: number, 
  startLng: number, 
  endLat: number, 
  endLng: number
): string {
  // Round to 5 decimal places for consistency
  const s1 = startLat.toFixed(5);
  const s2 = startLng.toFixed(5);
  const e1 = endLat.toFixed(5);
  const e2 = endLng.toFixed(5);
  
  return `${s1},${s2}_${e1},${e2}`;
}
