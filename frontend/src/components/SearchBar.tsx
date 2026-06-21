// ============================================================
// WEATHERVERSE — SearchBar Component
// Supports: city name, GPS location, ZIP code
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Hash, X, Loader2 } from 'lucide-react';
import type { SearchMode } from '../types/weather';

interface SearchBarProps {
  onSearch: (query: string, mode: SearchMode) => void;
  isLoading: boolean;
}

const CITY_SUGGESTIONS = [
  'Karachi', 'London', 'New York', 'Dubai', 'Tokyo', 'Paris',
  'Sydney', 'Toronto', 'Mumbai', 'Singapore', 'Berlin', 'Moscow',
  'Los Angeles', 'Chicago', 'Istanbul', 'Seoul', 'Bangkok', 'Cairo',
];

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [mode, setMode] = useState<SearchMode>('city');
  const [query, setQuery] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on query
  useEffect(() => {
    if (mode === 'city' && query.length >= 1) {
      const filtered = CITY_SUGGESTIONS.filter(c =>
        c.toLowerCase().startsWith(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && query.length >= 1);
    } else {
      setShowSuggestions(false);
    }
  }, [query, mode]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Handle search submit
  const handleSubmit = (q = query) => {
    if (!q.trim()) return;
    setShowSuggestions(false);
    onSearch(q.trim(), mode);
  };

  // GPS location
  const handleGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation not supported');
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const coordStr = `${pos.coords.latitude},${pos.coords.longitude}`;
        setQuery(coordStr);
        onSearch(coordStr, 'location');
      },
      (err) => {
        setGpsLoading(false);
        setGpsError('Location access denied');
        console.error(err);
      },
      { timeout: 8000 }
    );
  };

  const placeholder =
    mode === 'city'     ? 'Search city (e.g. Karachi, London…)' :
    mode === 'zip'      ? 'Enter ZIP / Postal code (e.g. 75201)' :
                          'Fetching GPS coordinates…';

  return (
    <div className="search-container w-full animate-fade-in-up">
      {/* Search Input Row */}
      <div className="search-wrapper" ref={containerRef}>
        <Search size={18} className="search-icon-left" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.length >= 1 && setShowSuggestions(suggestions.length > 0)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') setShowSuggestions(false);
          }}
          placeholder={placeholder}
          disabled={mode === 'location'}
          className="glass-input search-input w-full"
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-24 text-white hover:text-slate-300 transition-colors"
          >
            <X size={16} />
          </button>
        )}

        {/* Search button */}
        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || !query.trim()}
          className="glass-btn-primary search-btn absolute right-2
            flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? <Loader2 size={15} className="animate-spin" />
            : <Search size={15} />
          }
          <span className="hidden sm:inline">Search</span>
        </button>

        {/* Auto-suggestions */}
        {showSuggestions && (
          <div className="suggestions-box">
            {suggestions.slice(0, 6).map(city => (
              <div
                key={city}
                className="suggestion-item"
                onMouseDown={() => {
                  setQuery(city);
                  setShowSuggestions(false);
                  handleSubmit(city);
                }}
              >
                <MapPin size={14} className="text-white flex-shrink-0" />
                {city}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mode Options */}
      <div className="search-options">
        {/* GPS */}
        <button
          className={`search-option-btn ${mode === 'location' ? 'active' : ''}`}
          onClick={() => {
            setMode('location');
            setQuery('');
            handleGPS();
          }}
          disabled={gpsLoading}
        >
          {gpsLoading
            ? <Loader2 size={14} className="animate-spin" />
            : <MapPin size={14} />
          }
          {gpsLoading ? 'Detecting…' : 'Use My Location'}
        </button>

        {/* ZIP */}
        <button
          className={`search-option-btn ${mode === 'zip' ? 'active' : ''}`}
          onClick={() => {
            setMode('zip');
            setQuery('');
            inputRef.current?.focus();
          }}
        >
          <Hash size={14} />
          Search by ZIP
        </button>

        {/* City (default) */}
        <button
          className={`search-option-btn ${mode === 'city' ? 'active' : ''}`}
          onClick={() => {
            setMode('city');
            setQuery('');
            inputRef.current?.focus();
          }}
        >
          <Search size={14} />
          City Name
        </button>
      </div>

      {/* GPS Error */}
      {gpsError && (
        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
          <X size={14} /> {gpsError}
        </p>
      )}
    </div>
  );
}
