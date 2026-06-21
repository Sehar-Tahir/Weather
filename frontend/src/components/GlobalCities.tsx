// ============================================================
// WEATHERVERSE — Global Cities Quick Access Component
// ============================================================

import { MapPin, Globe, TrendingUp } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import type { WeatherCondition } from '../types/weather';

interface CityData {
  name: string;
  country: string;
  emoji: string;
  temp: number;
  condition: WeatherCondition;
  trending?: boolean;
}

const FEATURED_CITIES: CityData[] = [
  { name: 'Karachi',   country: 'PK', emoji: '🇵🇰', temp: 34, condition: 'partly-cloudy', trending: true },
  { name: 'London',    country: 'GB', emoji: '🇬🇧', temp: 15, condition: 'cloudy' },
  { name: 'New York',  country: 'US', emoji: '🇺🇸', temp: 22, condition: 'sunny', trending: true },
  { name: 'Dubai',     country: 'AE', emoji: '🇦🇪', temp: 41, condition: 'sunny' },
  { name: 'Tokyo',     country: 'JP', emoji: '🇯🇵', temp: 27, condition: 'rainy', trending: true },
  { name: 'Paris',     country: 'FR', emoji: '🇫🇷', temp: 18, condition: 'partly-cloudy' },
  { name: 'Sydney',    country: 'AU', emoji: '🇦🇺', temp: 23, condition: 'sunny' },
  { name: 'Toronto',   country: 'CA', emoji: '🇨🇦', temp: 16, condition: 'cloudy' },
  { name: 'Moscow',    country: 'RU', emoji: '🇷🇺', temp: -2, condition: 'snowy', trending: false },
  { name: 'Mumbai',    country: 'IN', emoji: '🇮🇳', temp: 30, condition: 'rainy' },
  { name: 'Singapore', country: 'SG', emoji: '🇸🇬', temp: 31, condition: 'stormy' },
  { name: 'Berlin',    country: 'DE', emoji: '🇩🇪', temp: 14, condition: 'cloudy' },
];

interface GlobalCitiesProps {
  onCitySelect: (city: string) => void;
}

export default function GlobalCities({ onCitySelect }: GlobalCitiesProps) {
  return (
    <div className="glass-card p-6 animate-fade-in-up delay-400">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="section-badge">
            <Globe size={11} />
            Global Weather
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Search Worldwide
          </h3>
          <p className="text-white text-sm">
            Quick access to major cities
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs textwhite">
          <TrendingUp size={13} className="text-white" />
          Trending cities
        </div>
      </div>

      {/* City Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {FEATURED_CITIES.map((city) => (
          <button
            key={city.name}
            onClick={() => onCitySelect(city.name)}
            className="relative flex flex-col items-center gap-2 p-3
              bg-white/[0.03] border border-white/[0.07] rounded-2xl
              hover:bg-sky-400/10 hover:border-sky-400/25
              transition-all duration-300 hover:-translate-y-1
              hover:shadow-[0_0_16px_rgba(56,189,248,0.12)]
              group cursor-pointer text-left w-full"
          >
            {/* Trending badge */}
            {city.trending && (
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-sky-400
                shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
            )}

            {/* Icon */}
            <WeatherIcon condition={city.condition} size={36} />

            {/* Info */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm">{city.emoji}</span>
                <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                  {city.name}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <MapPin size={9} className="text-white" />
                <span className="text-[10px] text-white">{city.country}</span>
              </div>
            </div>

            {/* Temp */}
            <span className="text-base font-black text-white group-hover:text-sky-300 transition-colors">
              {city.temp}°
            </span>
          </button>
        ))}
      </div>

      {/* Quick Chip Buttons */}
      <div className="mt-5 pt-5 border-t border-white/5">
        <p className="text-xs text-white mb-3 uppercase tracking-wider font-semibold">
          ⚡ Quick Access
        </p>
        <div className="flex flex-wrap gap-2">
          {['Karachi', 'London', 'New York', 'Dubai', 'Tokyo', 'Sydney', 'Moscow'].map(city => (
            <button
              key={city}
              className="city-chip"
              onClick={() => onCitySelect(city)}
            >
              <MapPin size={11} />
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
