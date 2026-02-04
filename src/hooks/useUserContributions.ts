import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserContributions {
  id: string;
  user_id: string;
  routes_analyzed: number;
  scores_submitted: number;
  images_uploaded: number;
  complaints_raised: number;
  created_at: string;
  updated_at: string;
}

export function useUserContributions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-contributions', user?.id],
    queryFn: async (): Promise<UserContributions | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_contributions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If no record exists, create one
        if (error.code === 'PGRST116') {
          const { data: newData, error: insertError } = await supabase
            .from('user_contributions')
            .insert({ user_id: user.id })
            .select()
            .single();
          
          if (insertError) throw insertError;
          return newData as UserContributions;
        }
        throw error;
      }
      return data as UserContributions;
    },
    enabled: !!user,
  });
}

export function useIncrementContribution() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (field: 'routes_analyzed' | 'scores_submitted' | 'images_uploaded' | 'complaints_raised') => {
      if (!user) throw new Error('Must be logged in');

      // Get current value first
      const { data: current, error: fetchError } = await supabase
        .from('user_contributions')
        .select(field)
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // Create record if doesn't exist
        const { error: insertError } = await supabase
          .from('user_contributions')
          .insert({ user_id: user.id, [field]: 1 });
        if (insertError) throw insertError;
        return;
      }

      if (fetchError) throw fetchError;

      const newValue = ((current as any)?.[field] || 0) + 1;
      
      const { error } = await supabase
        .from('user_contributions')
        .update({ [field]: newValue })
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-contributions'] });
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
    },
  });
}
