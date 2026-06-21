import { Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
// import cloudImage from "../assets/cloud.png";
import type { HourlyForecast, TempUnit } from '../types/weather';

interface HourlyForecastRowProps {
  hourly: HourlyForecast[];
  unit: TempUnit;
}

function toF(c: number) { return Math.round(c * 9 / 5 + 32); }

export default function HourlyForecastRow({ hourly, unit }: HourlyForecastRowProps) {
  const d = (c: number) => unit === 'C' ? `${c}°` : `${toF(c)}°`;

  return (
    <div className="glass-card w-full animate-fade-in-up delay-100 overflow-hidden">
      {/* Header with better padding */}
      <div className="px-5 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
        <div className="section-badge mb-2">⏱ Hourly Forecast</div>
        <h3 className="text-white text-lg font-semibold hidden sm:block">Next 12 Hours</h3>
      </div>

      {/* Full width scrollable container - NO horizontal padding here */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="flex gap-3 px-5 sm:px-6" style={{ minWidth: 'min-content' }}>
          {hourly.slice(0, 12).map((h, i) => {
            const isNow = i === 0;
            return (
              <div
                key={i}
                className={`flex-shrink-0 w-[90px] sm:w-[100px] p-3 sm:p-4 rounded-2xl text-center transition-all duration-300
                  ${isNow 
                    ? 'bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/30 shadow-lg shadow-sky-500/10' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sky-500/30'
                  }`}
              >
                {/* Time */}
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  isNow ? 'text-white' : 'text-white'
                }`}>
                  {isNow ? 'NOW' : h.time}
                </span>

                {/* Icon */}
                <div className="my-2 flex items-center justify-center">
                  <WeatherIcon condition={h.condition} size={40} />
                  {/* <img src={cloudImage} alt="Cloud Icon" className='w-10 h-10'/> */}
                </div>

                {/* Temperature */}
                <span className="text-base sm:text-lg font-bold text-white block">
                  {d(h.temperature)}
                </span>

                {/* Precipitation */}
                {h.precipitation > 0 ? (
                  <span className="flex items-center justify-center gap-1 text-[10px] text-white font-medium mt-1">
                    <Droplets size={10} /> {h.precipitation}%
                  </span>
                ) : (
                  <span className="text-[10px] text-white mt-1 block">—</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}