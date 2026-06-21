// ============================================================
// WEATHERVERSE — 7-Day Forecast (FULL WIDTH FIXED)
// ============================================================

import WeatherIcon from './WeatherIcon';
import type { ForecastDay, TempUnit } from '../types/weather';
import { Droplets, Wind } from 'lucide-react';
// import cloudImage from "../assets/cloud.png";

interface ForecastCardProps {
  forecast: ForecastDay[];
  unit: TempUnit;
}

function toF(c: number) { return Math.round(c * 9 / 5 + 32); }

export default function ForecastCard({ forecast, unit }: ForecastCardProps) {
  const d = (c: number) => unit === 'C' ? `${c}°` : `${toF(c)}°`;

  return (
    <div className="w-full">
      {/* Full width scrollable forecast */}
      <div className="flex gap-3 overflow-x-auto pb-4 w-full" style={{ scrollbarWidth: 'thin' }}>
        {forecast.map((day, i) => (
          <div
            key={i}
            className={`flex-shrink-0 w-[110px] sm:w-[120px] p-3 rounded-xl text-center transition-all duration-300
              ${i === 0 
                ? 'bg-gradient-to-b from-sky-500/20 to-indigo-500/20 border border-sky-500/30' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sky-500/30'
              }`}
          >
            {/* Day */}
            <span className={`text-xs font-bold uppercase tracking-wider ${i === 0 ? 'text-white' : 'text-white'}`}>
              {day.dayName}
            </span>
            <span className="text-[10px] text-white block mt-0.5">{day.date}</span>

            {/* Icon */}
            <div className="my-2 flex justify-center">
              <WeatherIcon condition={day.condition} size={44} />
              {/* <img src={cloudImage} alt="Cloud Icon" className='w-10 h-10'/> */}
            </div>

            {/* Temps */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-bold text-white">{d(day.high)}</span>
              <span className="text-xs text-white">{d(day.low)}</span>
            </div>

            {/* Details */}
            <div className="flex items-center justify-center gap-2 mt-2 text-[10px]">
              <span className="flex items-center gap-0.5 text-white">
                <Droplets size={9} /> {day.humidity}%
              </span>
              <span className="flex items-center gap-0.5 text-white">
                <Wind size={9} /> {day.windSpeed}
              </span>
            </div>

            <span className="text-[9px] text-white text-center capitalize block mt-2">
              {day.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}