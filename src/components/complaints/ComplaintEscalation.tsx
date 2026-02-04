import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ExternalLink, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  useCreateComplaint, 
  canEscalateComplaint, 
  getComplaintThreshold,
  CPGRAMS_URL 
} from '@/hooks/useGovernmentComplaints';
import { useIncrementContribution } from '@/hooks/useUserContributions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ComplaintEscalationProps {
  routeHash: string;
  startLocation: string;
  endLocation: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  walkabilityScore: number;
  distanceMeters: number;
  onAuthRequired: () => void;
}

export function ComplaintEscalation({
  routeHash,
  startLocation,
  endLocation,
  startLat,
  startLng,
  endLat,
  endLng,
  walkabilityScore,
  distanceMeters,
  onAuthRequired,
}: ComplaintEscalationProps) {
  const { user, isAuthenticated } = useAuth();
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  const createComplaint = useCreateComplaint();
  const incrementContribution = useIncrementContribution();

  const canEscalate = canEscalateComplaint(walkabilityScore, distanceMeters);
  const threshold = getComplaintThreshold(distanceMeters);
  const distanceKm = (distanceMeters / 1000).toFixed(1);

  const handleEscalate = async () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    setIsSubmitting(true);
    try {
      await createComplaint.mutateAsync({
        route_hash: routeHash,
        start_location: startLocation,
        end_location: endLocation,
        start_lat: startLat,
        start_lng: startLng,
        end_lat: endLat,
        end_lng: endLng,
        walkability_score: walkabilityScore,
        distance_meters: distanceMeters,
        complaint_type: 'walkability',
        description: description || undefined,
      });

      await incrementContribution.mutateAsync('complaints_raised');

      // Open CPGRAMS in new tab
      window.open(CPGRAMS_URL, '_blank');
      setHasRedirected(true);
      
      toast.success('Complaint logged! Redirecting to CPGRAMS portal...');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If distance is too far, show message about impractical walking
  if (threshold === null) {
    return (
      <Card className="border-muted">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Distance Notice</p>
              <p className="text-sm text-muted-foreground">
                At {distanceKm}km, this route exceeds practical walking limits. 
                Complaint escalation is not available for very long distances.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If score is above threshold, show why escalation isn't available
  if (!canEscalate) {
    return (
      <Card className="border-status-safe/30 bg-status-safe/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-status-safe/20 flex items-center justify-center">
              ✓
            </div>
            <div>
              <p className="font-medium text-foreground">Route Meets Walkability Standards</p>
              <p className="text-sm text-muted-foreground">
                With a score of {walkabilityScore}/100 for a {distanceKm}km route, 
                this meets the minimum threshold of {threshold}/100. 
                No complaint escalation needed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show escalation option
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-status-unsafe/30 bg-status-unsafe/5">
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-status-unsafe/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-status-unsafe" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-foreground">Poor Walkability Detected</p>
                <Badge variant="destructive" className="text-xs">
                  Score: {walkabilityScore}/100
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                This {distanceKm}km route falls below the threshold of {threshold}/100. 
                You can report this to municipal authorities via CPGRAMS.
              </p>
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Additional Details (optional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe specific issues: broken sidewalks, poor lighting, missing crossings..."
              rows={3}
            />
          </div>

          {/* Escalate Button */}
          {hasRedirected ? (
            <div className="p-3 rounded-lg bg-secondary text-center">
              <p className="text-sm text-muted-foreground">
                Complaint logged! You can{' '}
                <a 
                  href={CPGRAMS_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  visit CPGRAMS again
                </a>
                {' '}to track your complaint.
              </p>
            </div>
          ) : (
            <Button
              onClick={handleEscalate}
              disabled={isSubmitting}
              className="w-full bg-status-unsafe hover:bg-status-unsafe/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging Complaint...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Report to Authorities (CPGRAMS)
                </>
              )}
            </Button>
          )}

          {/* CPGRAMS Info */}
          <p className="text-xs text-center text-muted-foreground">
            CPGRAMS is India's Central Public Grievance Redress and Monitoring System
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
