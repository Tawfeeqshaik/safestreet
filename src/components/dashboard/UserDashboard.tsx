import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Star, Image, AlertTriangle, Award, 
  ChevronRight, LogOut, Settings, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useUserContributions } from '@/hooks/useUserContributions';
import { useUserAchievements, ACHIEVEMENTS, getUserTags } from '@/hooks/useAchievements';
import { useUserStreetIssues } from '@/hooks/useStreetIssues';
import { useUserComplaints } from '@/hooks/useGovernmentComplaints';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface UserDashboardProps {
  onClose?: () => void;
}

export function UserDashboard({ onClose }: UserDashboardProps) {
  const { user, signOut } = useAuth();
  const { data: contributions, isLoading: loadingContribs } = useUserContributions();
  const { data: achievements, isLoading: loadingAchievements } = useUserAchievements();
  const { data: issues, isLoading: loadingIssues } = useUserStreetIssues();
  const { data: complaints, isLoading: loadingComplaints } = useUserComplaints();

  const userTags = achievements ? getUserTags(achievements) : [];
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      onClose?.();
    }
  };

  const stats = [
    { 
      label: 'Routes Analyzed', 
      value: contributions?.routes_analyzed || 0, 
      icon: MapPin, 
      color: 'text-primary' 
    },
    { 
      label: 'Scores Submitted', 
      value: contributions?.scores_submitted || 0, 
      icon: Star, 
      color: 'text-status-safe' 
    },
    { 
      label: 'Images Uploaded', 
      value: contributions?.images_uploaded || 0, 
      icon: Image, 
      color: 'text-status-moderate' 
    },
    { 
      label: 'Complaints Raised', 
      value: contributions?.complaints_raised || 0, 
      icon: AlertTriangle, 
      color: 'text-status-unsafe' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{displayName}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {userTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <CardContent className="pt-4 pb-3">
              <stat.icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for Different Sections */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">
            <Award className="w-4 h-4 mr-2" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="issues">
            <Image className="w-4 h-4 mr-2" />
            Issues
          </TabsTrigger>
          <TabsTrigger value="complaints">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Complaints
          </TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const isEarned = achievements?.some(a => a.achievement === achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "p-4 rounded-xl border text-center transition-all",
                    isEarned 
                      ? "bg-primary/5 border-primary/30" 
                      : "bg-secondary/50 border-border opacity-50"
                  )}
                >
                  <span className="text-3xl block mb-2">{achievement.icon}</span>
                  <p className="font-medium text-sm text-foreground">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues" className="mt-4">
          {issues && issues.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {issues.map((issue) => (
                <Card key={issue.id} className="p-3">
                  <div className="flex items-start gap-3">
                    {issue.image_urls?.[0] && (
                      <img 
                        src={issue.image_urls[0]} 
                        alt="Issue" 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground capitalize">
                        {issue.issue_type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {issue.description || issue.location_name || 'No description'}
                      </p>
                      <Badge 
                        variant={issue.status === 'pending' ? 'secondary' : 'default'}
                        className="mt-2 text-xs"
                      >
                        {issue.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No issues reported yet</p>
              <p className="text-xs">Upload photos of walkability problems to help improve your city</p>
            </div>
          )}
        </TabsContent>

        {/* Complaints Tab */}
        <TabsContent value="complaints" className="mt-4">
          {complaints && complaints.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {complaints.map((complaint) => (
                <Card key={complaint.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {complaint.start_location} → {complaint.end_location}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Score: {complaint.walkability_score}/100 • {(complaint.distance_meters / 1000).toFixed(1)}km
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No complaints submitted yet</p>
              <p className="text-xs">Report poor walkability routes to authorities</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
