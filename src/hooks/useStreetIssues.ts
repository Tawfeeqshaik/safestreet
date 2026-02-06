import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface StreetIssue {
  id: string;
  user_id: string;
  route_hash: string;
  lat: number;
  lng: number;
  location_name: string | null;
  issue_type: string;
  description: string | null;
  image_urls: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStreetIssueInput {
  route_hash: string;
  lat: number;
  lng: number;
  location_name?: string;
  issue_type: string;
  description?: string;
  image_urls?: string[];
}

export const ISSUE_TYPES = [
  { value: 'broken_sidewalk', label: 'Broken Sidewalk', icon: '🚧' },
  { value: 'poor_lighting', label: 'Poor Lighting', icon: '💡' },
  { value: 'no_crossing', label: 'No Pedestrian Crossing', icon: '🚶' },
  { value: 'pothole', label: 'Pothole', icon: '🕳️' },
  { value: 'obstruction', label: 'Path Obstruction', icon: '🚫' },
  { value: 'safety_hazard', label: 'Safety Hazard', icon: '⚠️' },
  { value: 'accessibility', label: 'Accessibility Issue', icon: '♿' },
  { value: 'other', label: 'Other Issue', icon: '📝' },
];

export function useStreetIssues(routeHash?: string) {
  return useQuery({
    queryKey: ['street-issues', routeHash],
    queryFn: async (): Promise<StreetIssue[]> => {
      let query = supabase
        .from('street_issues')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (routeHash) {
        query = query.eq('route_hash', routeHash);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      return (data || []) as StreetIssue[];
    },
  });
}

export function useUserStreetIssues() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-street-issues', user?.id],
    queryFn: async (): Promise<StreetIssue[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('street_issues')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as StreetIssue[];
    },
    enabled: !!user,
  });
}

export function useCreateStreetIssue() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateStreetIssueInput) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('street_issues')
        .insert({
          user_id: user.id,
          ...input,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['street-issues'] });
      queryClient.invalidateQueries({ queryKey: ['user-street-issues'] });
      queryClient.invalidateQueries({ queryKey: ['user-contributions'] });
    },
  });
}

export async function uploadIssueImage(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('street-issues')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Use signed URL since bucket is now private
  const { data, error } = await supabase.storage
    .from('street-issues')
    .createSignedUrl(fileName, 86400); // 24 hour expiration

  if (error) throw error;
  return data.signedUrl;
}
