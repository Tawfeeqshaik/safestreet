import { useState, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, RotateCcw, Info, Footprints, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationSearch } from './routing/LocationSearch';
import { ShareScoreModal } from './ShareScoreModal';
import { Location } from '@/services/geocodingService';
import { calculateWalkingRoute, Route } from '@/services/routingService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const RouteMapDisplay = lazy(() => import('./routing/RouteMapDisplay').then(m => ({ default: m.RouteMapDisplay })));

interface WalkScoreResult {
  score: number;
  category: 'high' | 'moderate' | 'low';
  label: string;
  explanation: string;
  color: string;
}

function generateWalkScore(): WalkScoreResult {
  // Simulated score for prototype - can be replaced with real data later
  const score = Math.floor(Math.random() * 101);
  
  if (score >= 70) {
    return {
      score,
      category: 'high',
      label: 'Highly Walkable',
      explanation: 'Highly walkable area with good pedestrian access, well-lit paths, and safe crossings. Most errands can be accomplished on foot.',
      color: 'text-status-safe',
    };
  } else if (score >= 40) {
    return {
      score,
      category: 'moderate',
      label: 'Moderately Walkable',
      explanation: 'Moderate walkability with some pedestrian infrastructure. Some improvements needed for better accessibility and safety.',
      color: 'text-status-moderate',
    };
  } else {
    return {
      score,
      category: 'low',
      label: 'Poor Walkability',
      explanation: 'Low walkability, not pedestrian friendly. Limited sidewalks, poor lighting, and challenging crossings. Driving is likely required for most errands.',
      color: 'text-status-unsafe',
    };
  }
}

const MapLoading = () => (
  <div className="h-full w-full flex items-center justify-center bg-secondary/50 rounded-xl">
    <div className="text-center">
      <Loader2 className="w-10 h-10 text-primary mx-auto mb-3 animate-spin" />
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  </div>
);

export function WalkScoreCalculator() {
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [walkScore, setWalkScore] = useState<WalkScoreResult | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const calculateScore = useCallback(async () => {
    if (!startLocation || !endLocation) {
      toast.error('Please select both start and end locations');
      return;
    }

    setIsCalculating(true);
    setWalkScore(null);

    try {
      const result = await calculateWalkingRoute(startLocation, endLocation);
      if (result && result.routes.length > 0) {
        setRoute(result.routes[0]);
        // Simulate score calculation with a slight delay for UX
        await new Promise(resolve => setTimeout(resolve, 800));
        setWalkScore(generateWalkScore());
        toast.success('Walk score calculated!');
      } else {
        toast.error('No walking route found between these locations');
      }
    } catch (error) {
      toast.error('Failed to calculate route');
    } finally {
      setIsCalculating(false);
    }
  }, [startLocation, endLocation]);

  const swapLocations = () => {
    const temp = startLocation;
    setStartLocation(endLocation);
    setEndLocation(temp);
    setRoute(null);
    setWalkScore(null);
  };

  const resetCalculation = () => {
    setStartLocation(null);
    setEndLocation(null);
    setRoute(null);
    setWalkScore(null);
  };

  return (
    <section id="walk-score" className="py-16 sm:py-24 bg-background">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Footprints className="w-4 h-4" />
            Walk Score Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How Walkable is Your Route?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your start and destination to get an instant walkability assessment. 
            Discover how pedestrian-friendly your journey will be.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Calculator Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Calculate Walk Score</CardTitle>
                <CardDescription>
                  Enter two locations to analyze the walkability of the route between them.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Location Inputs */}
                <div className="space-y-3">
                  <LocationSearch
                    placeholder="From: Enter starting location"
                    value={startLocation}
                    onChange={(loc) => {
                      setStartLocation(loc);
                      setWalkScore(null);
                    }}
                    icon="start"
                  />
                  
                  <div className="flex justify-center">
                    <button 
                      onClick={swapLocations}
                      className="p-2 hover:bg-secondary rounded-full transition-colors"
                      title="Swap locations"
                    >
                      <RotateCcw className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  
                  <LocationSearch
                    placeholder="To: Enter destination"
                    value={endLocation}
                    onChange={(loc) => {
                      setEndLocation(loc);
                      setWalkScore(null);
                    }}
                    icon="end"
                  />
                </div>
                
                {/* Calculate Button */}
                <Button
                  onClick={calculateScore}
                  disabled={!startLocation || !endLocation || isCalculating}
                  className="w-full"
                  size="lg"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Calculating Score...
                    </>
                  ) : (
                    <>
                      Calculate Walk Score
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                {/* Walk Score Result */}
                <AnimatePresence mode="wait">
                  {walkScore && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className={cn(
                        "p-6 rounded-2xl text-center border-2",
                        walkScore.category === 'high' && "bg-status-safe/10 border-status-safe/30",
                        walkScore.category === 'moderate' && "bg-status-moderate/10 border-status-moderate/30",
                        walkScore.category === 'low' && "bg-status-unsafe/10 border-status-unsafe/30",
                      )}
                    >
                      {/* Score Display */}
                      <div className="mb-3">
                        <span className={cn(
                          "text-6xl sm:text-7xl font-extrabold",
                          walkScore.color
                        )}>
                          {walkScore.score}
                        </span>
                        <span className="text-2xl text-muted-foreground font-medium">/100</span>
                      </div>
                      
                      {/* Category Badge */}
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4",
                        walkScore.category === 'high' && "bg-status-safe text-white",
                        walkScore.category === 'moderate' && "bg-status-moderate text-foreground",
                        walkScore.category === 'low' && "bg-status-unsafe text-white",
                      )}>
                        {walkScore.label}
                      </div>
                      
                      {/* Explanation */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {walkScore.explanation}
                      </p>
                      
                      {/* Share Button */}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowShareModal(true)}
                        className="w-full"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Your Score
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Prototype Note */}
                {walkScore && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground"
                  >
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      This is a prototype simulation. In the full version, scores are calculated using 
                      real data including pedestrian infrastructure, lighting, safety, and accessibility metrics.
                    </span>
                  </motion.div>
                )}

                {/* Reset Button */}
                {(route || walkScore) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetCalculation}
                    className="w-full text-muted-foreground"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start New Calculation
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Map Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl overflow-hidden border border-border shadow-lg"
            style={{ minHeight: '500px' }}
          >
            <Suspense fallback={<MapLoading />}>
              <RouteMapDisplay
                startLocation={startLocation}
                endLocation={endLocation}
                route={route}
              />
            </Suspense>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid sm:grid-cols-3 gap-4 mt-10"
        >
          {[
            { emoji: '🚶', title: 'Pedestrian Focus', desc: 'Analyzes sidewalks, paths & crossings' },
            { emoji: '💡', title: 'Safety Metrics', desc: 'Considers lighting & traffic patterns' },
            { emoji: '♿', title: 'Accessibility', desc: 'Evaluates ease for all abilities' },
          ].map((feature) => (
            <Card key={feature.title} className="text-center py-6">
              <CardContent className="pt-0">
                <span className="text-3xl mb-2 block">{feature.emoji}</span>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>

      {/* Share Modal */}
      {walkScore && startLocation && endLocation && (
        <ShareScoreModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          walkScore={walkScore}
          fromLocation={startLocation.name.split(',')[0]}
          toLocation={endLocation.name.split(',')[0]}
        />
      )}
    </section>
  );
}
