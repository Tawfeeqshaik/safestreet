import { useState, useCallback, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Star, User, LogOut, Heart, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationSearch } from './LocationSearch';
import { RouteDetails } from './RouteDetails';
import { RateRouteModal } from './RateRouteModal';
import { AuthModal } from './AuthModal';
import { Location } from '@/services/geocodingService';
import { calculateWalkingRoute, Route, generateRouteHash } from '@/services/routingService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const RouteMapDisplay = lazy(() => import('./RouteMapDisplay').then(m => ({ default: m.RouteMapDisplay })));

const MapLoading = () => (
  <div className="h-full w-full flex items-center justify-center bg-secondary/50 rounded-xl">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  </div>
);

export function RoutePlanner() {
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user, isAuthenticated, signOut } = useAuth();

  const calculateRoute = useCallback(async () => {
    if (!startLocation || !endLocation) {
      toast.error('Please select both start and end locations');
      return;
    }

    setIsCalculating(true);
    try {
      const result = await calculateWalkingRoute(startLocation, endLocation);
      if (result && result.routes.length > 0) {
        setRoute(result.routes[0]);
        toast.success('Route calculated successfully!');
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
  };

  const handleRateRoute = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toast.info('Please sign in to rate routes');
      return;
    }
    setShowRatingModal(true);
  };

  const routeHash = startLocation && endLocation 
    ? generateRouteHash(startLocation, endLocation)
    : null;

  return (
    <section id="route-planner" className="py-20 bg-background">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Global Walking Route Planner
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the best walking routes anywhere in the world. Get directions, estimated times, and community ratings.
          </p>
        </motion.div>

        {/* Auth Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex justify-end mb-4"
        >
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Location Inputs */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
              <LocationSearch
                placeholder="Enter starting point"
                value={startLocation}
                onChange={setStartLocation}
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
                placeholder="Enter destination"
                value={endLocation}
                onChange={setEndLocation}
                icon="end"
              />
              
              <Button
                onClick={calculateRoute}
                disabled={!startLocation || !endLocation || isCalculating}
                className="w-full"
                size="lg"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    Get Walking Route
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Route Details */}
            {route && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-border p-4"
              >
                <RouteDetails route={route} routeHash={routeHash} />
                
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleRateRoute}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Rate Route
                  </Button>
                  {isAuthenticated && (
                    <Button variant="outline" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 rounded-2xl overflow-hidden border border-border shadow-xl"
            style={{ height: '600px' }}
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

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid sm:grid-cols-3 gap-4 mt-8"
        >
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">🌍</div>
            <div className="font-medium text-foreground">Worldwide Coverage</div>
            <div className="text-sm text-muted-foreground">Plan routes anywhere on Earth</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">⭐</div>
            <div className="font-medium text-foreground">Community Ratings</div>
            <div className="text-sm text-muted-foreground">Rate walkability & safety</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">🔓</div>
            <div className="font-medium text-foreground">100% Open Source</div>
            <div className="text-sm text-muted-foreground">No proprietary APIs</div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      {startLocation && endLocation && (
        <RateRouteModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          startLocation={startLocation}
          endLocation={endLocation}
        />
      )}
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </section>
  );
}
