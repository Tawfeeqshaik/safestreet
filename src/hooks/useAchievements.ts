import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AchievementType =
  | 'first_route' | 'explorer_10' | 'explorer_50' | 'explorer_100'
  | 'first_rating' | 'rater_10' | 'rater_50' | 'rater_100'
  | 'first_upload' | 'photographer_10' | 'photographer_50'
  | 'first_complaint' | 'advocate_10' | 'advocate_50'
  | 'safety_advocate' | 'urban_explorer' | 'active_contributor';

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement: AchievementType;
  earned_at: string;
}

export interface AchievementInfo {
  id: AchievementType;
  name: string;
  description: string;
  icon: string;
  tag?: string;
}

export const ACHIEVEMENTS: AchievementInfo[] = [
  // Route achievements
  { id: 'first_route', name: 'First Steps', description: 'Analyzed your first route', icon: '🚶' },
  { id: 'explorer_10', name: 'City Explorer', description: 'Analyzed 10 routes', icon: '🗺️' },
  { id: 'explorer_50', name: 'Urban Pioneer', description: 'Analyzed 50 routes', icon: '🏙️' },
  { id: 'explorer_100', name: 'Master Navigator', description: 'Analyzed 100 routes', icon: '🧭', tag: 'Urban Explorer' },
  
  // Rating achievements
  { id: 'first_rating', name: 'Voice Heard', description: 'Submitted your first rating', icon: '⭐' },
  { id: 'rater_10', name: 'Active Rater', description: 'Submitted 10 ratings', icon: '📊' },
  { id: 'rater_50', name: 'Street Critic', description: 'Submitted 50 ratings', icon: '📝' },
  { id: 'rater_100', name: 'Community Pillar', description: 'Submitted 100 ratings', icon: '🏆' },
  
  // Upload achievements
  { id: 'first_upload', name: 'First Snapshot', description: 'Uploaded your first image', icon: '📸' },
  { id: 'photographer_10', name: 'Street Photographer', description: 'Uploaded 10 images', icon: '📷' },
  { id: 'photographer_50', name: 'Visual Reporter', description: 'Uploaded 50 images', icon: '🎥' },
  
  // Complaint achievements
  { id: 'first_complaint', name: 'Citizen Voice', description: 'Raised your first complaint', icon: '📢' },
  { id: 'advocate_10', name: 'Community Advocate', description: 'Raised 10 complaints', icon: '🗣️', tag: 'Safety Advocate' },
  { id: 'advocate_50', name: 'Change Maker', description: 'Raised 50 complaints', icon: '⚡' },
  
  // Special tags
  { id: 'safety_advocate', name: 'Safety Advocate', description: 'Committed to street safety', icon: '🛡️', tag: 'Safety Advocate' },
  { id: 'urban_explorer', name: 'Urban Explorer', description: 'Dedicated route analyzer', icon: '🔍', tag: 'Urban Explorer' },
  { id: 'active_contributor', name: 'Active Contributor', description: 'Consistent platform engagement', icon: '💪', tag: 'Active Contributor' },
];

export function useUserAchievements() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async (): Promise<UserAchievement[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return (data || []) as UserAchievement[];
    },
    enabled: !!user,
  });
}

export function useAwardAchievement() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (achievement: AchievementType) => {
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement,
        });

      // Ignore if achievement already exists
      if (error && error.code !== '23505') throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
    },
  });
}

export function getUserTags(achievements: UserAchievement[]): string[] {
  const tags: string[] = [];
  const earnedIds = new Set(achievements.map(a => a.achievement));
  
  // Check for special tags based on achievements
  if (earnedIds.has('explorer_100') || earnedIds.has('urban_explorer')) {
    tags.push('Urban Explorer');
  }
  if (earnedIds.has('advocate_10') || earnedIds.has('safety_advocate')) {
    tags.push('Safety Advocate');
  }
  if (earnedIds.has('active_contributor') || 
      (earnedIds.has('explorer_10') && earnedIds.has('rater_10'))) {
    tags.push('Active Contributor');
  }
  
  return tags;
}
