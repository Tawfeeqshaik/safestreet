import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitRating } from '@/hooks/useRouteRatings';
import { Location } from '@/services/geocodingService';
import { generateRouteHash } from '@/services/routingService';
import { toast } from 'sonner';

interface RateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  startLocation: Location;
  endLocation: Location;
}

export function RateRouteModal({ isOpen, onClose, startLocation, endLocation }: RateRouteModalProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [walkabilityScore, setWalkabilityScore] = useState(0);
  const [safetyScore, setSafetyScore] = useState(0);
  const [lightingScore, setLightingScore] = useState(0);
  const [accessibilityScore, setAccessibilityScore] = useState(0);
  const [comment, setComment] = useState('');
  
  const submitRating = useSubmitRating();

  const handleSubmit = async () => {
    if (overallRating === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    try {
      await submitRating.mutateAsync({
        route_hash: generateRouteHash(startLocation, endLocation),
        start_lat: startLocation.lat,
        start_lng: startLocation.lng,
        end_lat: endLocation.lat,
        end_lng: endLocation.lng,
        start_name: startLocation.name,
        end_name: endLocation.name,
        overall_rating: overallRating,
        walkability_score: walkabilityScore || undefined,
        safety_score: safetyScore || undefined,
        lighting_score: lightingScore || undefined,
        accessibility_score: accessibilityScore || undefined,
        comment: comment || undefined
      });
      
      toast.success('Rating submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit rating. Please sign in first.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-2xl shadow-xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Rate This Route</h3>
                <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Overall Rating */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Overall Rating *
                  </label>
                  <StarRating value={overallRating} onChange={setOverallRating} />
                </div>

                {/* Detailed Ratings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Walkability
                    </label>
                    <StarRating value={walkabilityScore} onChange={setWalkabilityScore} size="sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Safety
                    </label>
                    <StarRating value={safetyScore} onChange={setSafetyScore} size="sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Lighting
                    </label>
                    <StarRating value={lightingScore} onChange={setLightingScore} size="sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Accessibility
                    </label>
                    <StarRating value={accessibilityScore} onChange={setAccessibilityScore} size="sm" />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Comments (optional)
                  </label>
                  <Textarea
                    placeholder="Share your experience walking this route..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={submitRating.isPending}
                  className="w-full"
                >
                  {submitRating.isPending ? 'Submitting...' : 'Submit Rating'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
}

function StarRating({ value, onChange, size = 'md' }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const starSize = size === 'sm' ? 'w-5 h-5' : 'w-7 h-7';

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`${starSize} ${
              star <= (hovered || value)
                ? 'text-primary fill-primary'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
