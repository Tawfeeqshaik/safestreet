import { Clock, Navigation, Star, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Route, formatDistance, formatDuration } from '@/services/routingService';
import { useAggregateRating } from '@/hooks/useRouteRatings';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface RouteDetailsProps {
  route: Route;
  routeHash: string | null;
}

export function RouteDetails({ route, routeHash }: RouteDetailsProps) {
  const aggregateRating = useAggregateRating(routeHash);
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary/50 rounded-xl p-4 text-center">
          <Navigation className="w-5 h-5 mx-auto mb-2 text-primary" />
          <div className="text-xl font-bold text-foreground">
            {formatDistance(route.distance)}
          </div>
          <div className="text-xs text-muted-foreground">Distance</div>
        </div>
        <div className="bg-secondary/50 rounded-xl p-4 text-center">
          <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
          <div className="text-xl font-bold text-foreground">
            {formatDuration(route.duration)}
          </div>
          <div className="text-xs text-muted-foreground">Walking Time</div>
        </div>
      </div>

      {/* Rating Display */}
      {aggregateRating && (
        <div className="bg-primary/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary fill-primary" />
              <span className="text-lg font-bold text-foreground">
                {aggregateRating.average_overall.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/5</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{aggregateRating.total_ratings} ratings</span>
            </div>
          </div>
          
          {/* Detailed scores */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {aggregateRating.average_walkability > 0 && (
              <RatingBadge label="Walkability" value={aggregateRating.average_walkability} />
            )}
            {aggregateRating.average_safety > 0 && (
              <RatingBadge label="Safety" value={aggregateRating.average_safety} />
            )}
            {aggregateRating.average_lighting > 0 && (
              <RatingBadge label="Lighting" value={aggregateRating.average_lighting} />
            )}
            {aggregateRating.average_accessibility > 0 && (
              <RatingBadge label="Accessibility" value={aggregateRating.average_accessibility} />
            )}
          </div>
        </div>
      )}

      {/* Turn-by-turn directions */}
      {route.steps.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="w-full px-4 py-3 flex items-center justify-between bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <span className="font-medium text-foreground">
              Directions ({route.steps.length} steps)
            </span>
            {showSteps ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          
          <AnimatePresence>
            {showSteps && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="max-h-60 overflow-y-auto">
                  {route.steps.map((step, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 border-t border-border flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-foreground">
                          {step.instruction}
                        </div>
                        {step.name && step.name !== 'Unnamed road' && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            on {step.name}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDistance(step.distance)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function RatingBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs bg-secondary/50 rounded-lg px-2 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value.toFixed(1)}</span>
    </div>
  );
}
