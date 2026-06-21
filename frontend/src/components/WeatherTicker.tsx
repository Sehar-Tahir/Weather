// ============================================================
// WEATHERVERSE — Live Weather Ticker / Info Bar
// Shows scrolling world city temps
// ============================================================

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

interface TickerCity {
  name: string;
  temp: number;
  emoji: string;
}

const TICKER_CITIES: TickerCity[] = [
  { name: 'Karachi',   temp: 34, emoji: '⛅' },
  { name: 'London',    temp: 15, emoji: '🌧' },
  { name: 'New York',  temp: 22, emoji: '☀️' },
  { name: 'Dubai',     temp: 41, emoji: '🌞' },
  { name: 'Tokyo',     temp: 27, emoji: '🌦' },
  { name: 'Paris',     temp: 18, emoji: '⛅' },
  { name: 'Sydney',    temp: 23, emoji: '☀️' },
  { name: 'Moscow',    temp: -2, emoji: '❄️' },
  { name: 'Mumbai',    temp: 30, emoji: '🌧' },
  { name: 'Singapore', temp: 31, emoji: '⛈' },
  { name: 'Berlin',    temp: 14, emoji: '🌥' },
  { name: 'Toronto',   temp: 16, emoji: '🌤' },
];

export default function WeatherTicker() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });

  return (
    <div
      className="border-b overflow-hidden"
      style={{
        background: 'rgba(0,0,0,0.3)',
        borderColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 h-9">
        {/* Live badge */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <Zap size={11} className="text-yellow-400" />
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Live</span>
        </div>

        {/* Scrolling cities */}
        <div className="flex-1 overflow-hidden relative">
          <div
            className="flex gap-6 whitespace-nowrap"
            style={{ animation: 'ticker-scroll 40s linear infinite' }}
          >
            {[...TICKER_CITIES, ...TICKER_CITIES].map((city, i) => (
              <span key={i} className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>{city.emoji}</span>
                <span className="font-medium text-slate-400">{city.name}</span>
                <span className="text-sky-500 font-bold">{city.temp}°C</span>
              </span>
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />
        </div>

        {/* Clock */}
        <div className="flex-shrink-0 text-right hidden sm:block">
          <span className="font-display text-xs text-sky-400 font-bold">{timeStr}</span>
          <span className="text-[10px] text-slate-600 ml-2">{dateStr}</span>
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
