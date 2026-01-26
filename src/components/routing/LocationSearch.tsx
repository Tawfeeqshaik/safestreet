import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchLocations, GeocodingResult, geocodingResultToLocation, Location } from '@/services/geocodingService';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationSearchProps {
  placeholder: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
  icon?: 'start' | 'end';
}

export function LocationSearch({ placeholder, value, onChange, icon = 'start' }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setQuery(value.name.split(',')[0]); // Show short name
    }
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      const searchResults = await searchLocations(query);
      setResults(searchResults);
      setIsSearching(false);
      setShowResults(true);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: GeocodingResult) => {
    const location = geocodingResultToLocation(result);
    onChange(location);
    setQuery(result.display_name.split(',')[0]);
    setShowResults(false);
  };

  const handleClear = () => {
    setQuery('');
    onChange(null);
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${icon === 'start' ? 'text-status-safe' : 'text-status-unsafe'}`}>
          <MapPin className="w-4 h-4" />
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          className="pl-10 pr-10 h-12 bg-background border-border"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : query ? (
            <button onClick={handleClear} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
          >
            {results.map((result) => (
              <button
                key={result.place_id}
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors flex items-start gap-3"
              >
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {result.display_name.split(',')[0]}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {result.display_name.split(',').slice(1, 4).join(',')}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
