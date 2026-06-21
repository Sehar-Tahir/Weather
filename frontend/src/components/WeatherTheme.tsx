// ============================================================
// KARACHI WEATHER APP — Smart Weather Theme System
// Dynamically changes background + animations based on
// the searched city's temperature & condition.
// ============================================================

import { useMemo } from 'react';
import type { WeatherCondition } from '../types/weather';

export type ThemeMode = 'hot' | 'cold' | 'rainy' | 'pleasant';

interface WeatherThemeProps {
  temperature: number;
  condition: WeatherCondition;
}

// ── Decide theme from temp + condition ────────────────────
export function resolveTheme(temperature: number, condition: WeatherCondition): ThemeMode {
  // Rain / storm always wins
  if (condition === 'rainy' || condition === 'stormy') return 'rainy';
  // Snow or very cold
  if (condition === 'snowy' || temperature <= 5) return 'cold';
  // Hot
  if (temperature >= 32 || condition === 'sunny') return 'hot';
  // Cool-ish
  if (temperature <= 15) return 'cold';
  return 'pleasant';
}

export default function WeatherTheme({ temperature, condition }: WeatherThemeProps) {
  const theme = resolveTheme(temperature, condition);

  // Pre-compute rain drops
  const rainDrops = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      dur: `${0.5 + Math.random() * 0.6}s`,
      height: `${40 + Math.random() * 50}px`,
      opacity: 0.3 + Math.random() * 0.5,
    })), [theme]);

  // Pre-compute snowflakes
  const snowFlakes = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      dur: `${5 + Math.random() * 6}s`,
      size: `${8 + Math.random() * 12}px`,
      opacity: 0.4 + Math.random() * 0.5,
    })), [theme]);

  return (
    <div className={`weather-theme theme-${theme}`} aria-hidden="true">
      {/* ☀️ HOT — Sun rays + heat haze */}
      {theme === 'hot' && (
        <>
          <div className="sun-rays" />
          <div className="heat-haze" />
        </>
      )}

      {/* 🌧️ RAINY — Falling rain */}
      {theme === 'rainy' && (
        <div className="absolute inset-0 overflow-hidden">
          {rainDrops.map(d => (
            <div
              key={d.id}
              className="rain-drop"
              style={{
                left: d.left,
                height: d.height,
                animationDelay: d.delay,
                animationDuration: d.dur,
                opacity: d.opacity,
              }}
            />
          ))}
        </div>
      )}

      {/* ❄️ COLD — Falling snow */}
      {theme === 'cold' && (
        <div className="absolute inset-0 overflow-hidden">
          {snowFlakes.map(f => (
            <div
              key={f.id}
              className="snow-flake"
              style={{
                left: f.left,
                fontSize: f.size,
                animationDelay: f.delay,
                animationDuration: f.dur,
                opacity: f.opacity,
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
