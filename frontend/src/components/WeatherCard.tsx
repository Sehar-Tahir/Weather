// ============================================================
// WEATHERVERSE — Main Weather Card Component
// ============================================================

import { useState } from 'react';
import {
  Droplets, Wind, Gauge, Eye, Thermometer, Sunrise, Sunset,
  Cloud, ArrowUp, ArrowDown, RefreshCw
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
// import cloudImage from "../assets/cloud.png";
import type { WeatherData, TempUnit } from '../types/weather';

interface WeatherCardProps {
  data: WeatherData;
  onRefresh?: () => void;
}

function toF(c: number) { return Math.round(c * 9 / 5 + 32); }

function formatTime(ts: number, tz: number): string {
  const d = new Date((ts + tz) * 1000);
  return d.toUTCString().slice(17, 22);
}

function getWindDir(deg: number): string {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function getAqiColor(aqi?: number): string {
  if (!aqi) return '#34d399';
  if (aqi === 1) return '#34d399';
  if (aqi === 2) return '#fbbf24';
  if (aqi === 3) return '#fb923c';
  if (aqi >= 4)  return '#f87171';
  return '#34d399';
}

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg?: string;
}

function StatPill({ icon, label, value, iconBg }: StatPillProps) {
  return (
    <div className="stat-pill">
      <div className="stat-icon" style={iconBg ? { background: iconBg } : {}}>
        {icon}
      </div>
      <span className="text-[10px] text-white uppercase tracking-wider font-semibold">
        {label}
      </span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

export default function WeatherCard({ data, onRefresh }: WeatherCardProps) {
  const [unit, setUnit] = useState<TempUnit>('C');

  const displayTemp = (c: number) => unit === 'C' ? `${c}°` : `${toF(c)}°`;
  const aqiPct = data.aqi ? ((data.aqi - 1) / 4) * 100 : 20;

  return (
    <div className="weather-hero-card animate-scale-in">
      <div className="p-6 sm:p-8">

        {/* ── Top Row: City + Refresh + Unit ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="section-badge mb-2">
              <Cloud size={11} />
              Live Weather
            </div>
            <h2 className="text-2xl font-bold text-white">
              {data.city}
              <span className="text-white text-lg ml-2 font-normal">{data.country}</span>
            </h2>
            <p className="text-white text-sm mt-0.5 capitalize">{data.description}</p>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* Unit toggle */}
            <div className="temp-unit-toggle">
              <button className={`unit-btn ${unit === 'C' ? 'active' : ''}`} onClick={() => setUnit('C')}>°C</button>
              <button className={`unit-btn ${unit === 'F' ? 'active' : ''}`} onClick={() => setUnit('F')}>°F</button>
            </div>
            {/* Refresh */}
            {onRefresh && (
              <button onClick={onRefresh}
                className="text-white hover:text-sky-400 transition-colors p-1">
                <RefreshCw size={16} />
              </button>
            )}
          </div>
        </div>

        {/* ── Main Temp + Icon ── */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          {/* Temperature */}
          <div>
            <div className="temp-display">{displayTemp(data.temperature)}</div>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-sm text-white/80">
                <Thermometer size={14} className="text-sky-400" />
                Feels {displayTemp(data.feelsLike)}
              </span>
              <span className="flex items-center gap-1 text-sm text-white/80 font-medium">
                <ArrowUp size={12} /> {displayTemp(data.temperature + 3)}
                <ArrowDown size={12} className="ml-1" /> {displayTemp(data.temperature - 5)}
              </span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Weather Icon */}
          <WeatherIcon condition={data.condition} size={100} />
          {/* <img src={cloudImage} alt="Cloud Icon" className='w-40 h-40'/> */}
        </div>

        {/* ── Stat Pills Grid ── */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <StatPill
            icon={<Droplets size={16} />}
            label="Humidity"
            value={`${data.humidity}%`}
            iconBg="rgba(56,189,248,0.12)"
          />
          <StatPill
            icon={<Wind size={16} />}
            label="Wind"
            value={`${data.windSpeed} km/h`}
            iconBg="rgba(129,140,248,0.12)"
          />
          <StatPill
            icon={<Gauge size={16} />}
            label="Pressure"
            value={`${data.pressure} hPa`}
            iconBg="rgba(52,211,153,0.12)"
          />
          <StatPill
            icon={<Eye size={16} />}
            label="Visibility"
            value={`${data.visibility} km`}
            iconBg="rgba(251,191,36,0.12)"
          />
          <StatPill
            icon={<Cloud size={16} />}
            label="Cloud Cover"
            value={`${data.cloudCover}%`}
            iconBg="rgba(148,163,184,0.12)"
          />
          <StatPill
            icon={
              <span className="text-xs font-black">
                {getWindDir(data.windDirection)}
              </span>
            }
            label="Wind Dir"
            value={`${data.windDirection}°`}
            iconBg="rgba(248,113,113,0.12)"
          />
        </div>

        {/* ── Sunrise / Sunset + AQI ── */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sunrise / Sunset */}
          <div className="glass-card flex items-center justify-around flex-1 p-4">
            <div className="flex flex-col items-center gap-1">
              <Sunrise size={20} className="text-white" />
              <span className="text-[10px] text-white uppercase tracking-wider">Sunrise</span>
              <span className="text-sm font-bold text-white">
                {formatTime(data.sunrise, data.timezone)}
              </span>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <Sunset size={20} className="text-white" />
              <span className="text-[10px] text-white uppercase tracking-wider">Sunset</span>
              <span className="text-sm font-bold text-white">
                {formatTime(data.sunset, data.timezone)}
              </span>
            </div>
          </div>

          {/* AQI */}
          {data.aqi && (
            <div className="glass-card flex-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white font-semibold uppercase tracking-wider">
                  Air Quality Index
                </span>
                <span
                  className="text-sm font-bold px-2 py-0.5 rounded-full"
                  style={{
                    color: getAqiColor(data.aqi),
                    background: `${getAqiColor(data.aqi)}20`,
                    border: `1px solid ${getAqiColor(data.aqi)}40`,
                  }}
                >
                  {data.aqiLabel}
                </span>
              </div>
              <div className="aqi-bar">
                <div
                  className="aqi-indicator"
                  style={{ left: `${Math.min(Math.max(aqiPct, 5), 95)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-green-400">Good</span>
                <span className="text-[10px] text-yellow-400">Moderate</span>
                <span className="text-[10px] text-red-400">Poor</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
