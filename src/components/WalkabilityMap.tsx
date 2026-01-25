import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, AlertCircle, Lightbulb, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sampleStreets, Street, cityStats } from '@/data/streetData';

const getStatusBg = (status: 'safe' | 'moderate' | 'unsafe'): string => {
  switch (status) {
    case 'safe': return 'bg-status-safe';
    case 'moderate': return 'bg-status-moderate';
    case 'unsafe': return 'bg-status-unsafe';
  }
};

interface StreetDetailProps {
  street: Street;
  onClose: () => void;
}

const StreetDetail = ({ street, onClose }: StreetDetailProps) => {
  const scoreItems = [
    { label: 'Footpath Condition', value: street.score.footpathCondition, max: 2 },
    { label: 'Street Lighting', value: street.score.streetLighting, max: 2 },
    { label: 'Pedestrian Crossings', value: street.score.pedestrianCrossings, max: 2 },
    { label: 'Traffic Safety', value: street.score.trafficSafety, max: 2 },
    { label: 'Accessibility', value: street.score.accessibility, max: 2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] overflow-y-auto bg-card rounded-2xl shadow-xl border border-border z-[1000]"
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-bold text-foreground">{street.name}</h3>
          <p className="text-sm text-muted-foreground">{street.neighborhood}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Score Badge */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl text-primary-foreground font-bold text-xl ${getStatusBg(street.status)}`}>
            {street.totalScore}/10
          </div>
          <div>
            <p className="font-semibold text-foreground capitalize">{street.status}</p>
            <p className="text-sm text-muted-foreground">Walkability Score</p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Score Breakdown</h4>
          {scoreItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <div className="flex gap-1">
                {[...Array(item.max)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < item.value ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Issues */}
        {street.issues.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-status-unsafe" />
              Issues Identified
            </h4>
            <div className="space-y-2">
              {street.issues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg text-sm ${
                    issue.severity === 'high'
                      ? 'bg-status-unsafe/10 text-status-unsafe'
                      : issue.severity === 'medium'
                      ? 'bg-status-moderate/10 text-status-moderate'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {issue.description}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {street.improvements.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-accent" />
              Suggested Improvements
            </h4>
            <ul className="space-y-1">
              {street.improvements.map((improvement, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Lazy load the actual map component
const LazyMapContent = lazy(() => import('./MapContent'));

const MapLoading = () => (
  <div className="h-full w-full flex items-center justify-center bg-secondary/50">
    <div className="text-center">
      <MapPin className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  </div>
);

interface WalkabilityMapProps {}

export const WalkabilityMap = ({}: WalkabilityMapProps) => {
  const [selectedStreet, setSelectedStreet] = useState<Street | null>(null);
  const [filter, setFilter] = useState<'all' | 'safe' | 'moderate' | 'unsafe'>('all');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredStreets = sampleStreets.filter(
    (street) => filter === 'all' || street.status === filter
  );

  return (
    <section id="map" className="py-20 bg-secondary/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Interactive Walkability Map
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore street-level walkability data. Click on any street to see detailed scoring and improvement suggestions.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-card p-4 rounded-xl border border-border text-center">
            <div className="text-2xl font-bold text-foreground">{cityStats.totalStreets}</div>
            <div className="text-sm text-muted-foreground">Total Streets</div>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border text-center">
            <div className="text-2xl font-bold text-status-safe">{cityStats.safeStreets}</div>
            <div className="text-sm text-muted-foreground">Safe Streets</div>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border text-center">
            <div className="text-2xl font-bold text-status-moderate">{cityStats.moderateStreets}</div>
            <div className="text-sm text-muted-foreground">Moderate</div>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border text-center">
            <div className="text-2xl font-bold text-status-unsafe">{cityStats.unsafeStreets}</div>
            <div className="text-sm text-muted-foreground">Needs Work</div>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Streets
          </Button>
          <Button
            variant={filter === 'safe' ? 'safe' : 'outline'}
            size="sm"
            onClick={() => setFilter('safe')}
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Safe (8-10)
          </Button>
          <Button
            variant={filter === 'moderate' ? 'moderate' : 'outline'}
            size="sm"
            onClick={() => setFilter('moderate')}
          >
            <AlertCircle className="w-4 h-4 mr-1" /> Moderate (5-7)
          </Button>
          <Button
            variant={filter === 'unsafe' ? 'unsafe' : 'outline'}
            size="sm"
            onClick={() => setFilter('unsafe')}
          >
            <AlertTriangle className="w-4 h-4 mr-1" /> Unsafe (0-4)
          </Button>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative rounded-2xl overflow-hidden border border-border shadow-xl"
          style={{ height: '500px' }}
        >
          {isClient ? (
            <Suspense fallback={<MapLoading />}>
              <LazyMapContent
                streets={filteredStreets}
                onStreetClick={setSelectedStreet}
              />
            </Suspense>
          ) : (
            <MapLoading />
          )}

          <AnimatePresence>
            {selectedStreet && (
              <StreetDetail
                street={selectedStreet}
                onClose={() => setSelectedStreet(null)}
              />
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm p-3 rounded-xl shadow-lg z-[1000]">
            <div className="text-xs font-semibold text-foreground mb-2">Walkability Legend</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-1 rounded-full bg-status-safe" />
                <span className="text-muted-foreground">Safe (8-10)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-1 rounded-full bg-status-moderate" />
                <span className="text-muted-foreground">Moderate (5-7)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-1 rounded-full bg-status-unsafe" />
                <span className="text-muted-foreground">Unsafe (0-4)</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
