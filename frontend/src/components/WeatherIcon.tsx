// ============================================================
// WEATHERVERSE — Animated Weather Icon Component
// SVG-based with CSS animations per condition
// ============================================================

import type { WeatherCondition } from '../types/weather';
import cloudImage from "../assets/cloud.png";

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  className?: string;
}

export default function WeatherIcon({ condition, size = 80, className = '' }: WeatherIconProps) {
  const cls = `weather-icon-wrapper ${condition} ${className}`;
  const s = size;

  if (condition === 'sunny') {
    return (
      <div className={cls} style={{ width: s, height: s }}>
        <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
          {/* Rays */}
          {[0,45,90,135,180,225,270,315].map((deg, i) => (
            <line
              key={i}
              x1="40" y1="40"
              x2={40 + 34 * Math.cos((deg - 90) * Math.PI / 180)}
              y2={40 + 34 * Math.sin((deg - 90) * Math.PI / 180)}
              stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="4 6"
              opacity="0.8"
            />
          ))}
          {/* Sun core */}
          <circle cx="40" cy="40" r="17" fill="#FBBF24" />
          <circle cx="40" cy="40" r="13" fill="#FDE68A" />
          <circle cx="34" cy="34" r="3" fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>
    );
  }

  if (condition === 'cloudy') {
    return (
      <div className={cls} style={{ width: s, height: s }}>
        {/* <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
          <ellipse cx="40" cy="50" rx="28" ry="16" fill="rgba(148,163,184,0.5)" />
          <ellipse cx="32" cy="45" rx="16" ry="13" fill="#94A3B8" />
          <ellipse cx="50" cy="44" rx="18" ry="14" fill="#94A3B8" />
          <ellipse cx="40" cy="40" rx="14" ry="11" fill="#CBD5E1" />
          <ellipse cx="40" cy="38" rx="4" ry="3" fill="rgba(255,255,255,0.4)" />
        </svg> */}
        <img src={cloudImage} alt="Cloud Icon" />
      </div>
    );
  }

  if (condition === 'partly-cloudy') {
    return (
      <div className={cls} style={{ width: s, height: s }}>
        {/* <svg width={s} height={s} viewBox="0 0 80 80" fill="none"> */}
          {/* Sun behind */}
          {/* <circle cx="30" cy="28" r="14" fill="#FBBF24" opacity="0.9" />
          <circle cx="30" cy="28" r="10" fill="#FDE68A" /> */}
          {/* Cloud */}
          {/* <ellipse cx="46" cy="52" rx="26" ry="14" fill="rgba(148,163,184,0.5)" />
          <ellipse cx="36" cy="46" rx="16" ry="12" fill="#94A3B8" />
          <ellipse cx="52" cy="45" rx="18" ry="13" fill="#94A3B8" />
          <ellipse cx="44" cy="41" rx="13" ry="10" fill="#CBD5E1" /> */}
        {/* </svg> */}
        <img src={cloudImage} alt="Cloud Icon" />
      </div>
    );
  }

  if (condition === 'rainy') {
    return (
      <div className={cls} style={{ width: s, height: s }}>
        <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
          {/* Cloud */}
          <ellipse cx="40" cy="34" rx="26" ry="14" fill="rgba(71,85,105,0.5)" />
          <ellipse cx="30" cy="28" rx="15" ry="12" fill="#475569" />
          <ellipse cx="50" cy="27" rx="17" ry="13" fill="#475569" />
          <ellipse cx="40" cy="24" rx="12" ry="9" fill="#64748B" />
          {/* Rain drops */}
          {[[28,52,0],[36,55,0.15],[44,52,0.3],[52,55,0.1],[32,60,0.2],[48,62,0.05]].map(([x,y,delay], i) => (
            <ellipse key={i} cx={x} cy={y} rx="2" ry="5"
              fill="#7DD3FC" opacity="0.8"
              style={{ animation: `float ${1.2 + i * 0.2}s ease-in-out infinite`, animationDelay: `${delay}s` }}
            />
          ))}
        </svg>
      </div>
    );
  }

  if (condition === 'snowy') {
    return (
      <div className={cls} style={{ width: s, height: s }}>
        <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
          {/* Cloud */}
          <ellipse cx="40" cy="32" rx="26" ry="14" fill="rgba(148,163,184,0.4)" />
          <ellipse cx="30" cy="26" rx="15" ry="12" fill="#94A3B8" />
          <ellipse cx="50" cy="25" rx="17" ry="13" fill="#94A3B8" />
          {/* Snowflakes */}
          {[[28,52],[36,58],[44,54],[52,60],[40,66]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x},${y})`}>
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" />
              <line x1="0" y1="-5" x2="0" y2="5" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" />
              <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (condition === 'stormy') {
    return (
      <div className={cls} style={{ width: s, height: s }}>
        <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
          {/* Dark cloud */}
          <ellipse cx="40" cy="30" rx="28" ry="16" fill="rgba(30,41,59,0.8)" />
          <ellipse cx="28" cy="24" rx="17" ry="14" fill="#1E293B" />
          <ellipse cx="52" cy="23" rx="19" ry="15" fill="#1E293B" />
          {/* Lightning bolt */}
          <path d="M44 38 L36 50 L41 50 L37 64 L52 46 L46 46 Z"
            fill="#FCD34D" stroke="#FBBF24" strokeWidth="1" />
          <path d="M44 38 L36 50 L41 50 L37 64 L52 46 L46 46 Z"
            fill="rgba(252,211,77,0.3)" />
        </svg>
      </div>
    );
  }

  if (condition === 'foggy') {
    return (
      <div className={cls} style={{ width: s, height: s }}>
        <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
          {[20, 30, 40, 50, 60].map((y, i) => (
            <rect key={i} x="10" y={y} width={40 + i * 5} height="5"
              rx="2.5" fill="rgba(148,163,184,0.25)" />
          ))}
          {[25, 35, 45, 55].map((y, i) => (
            <rect key={i} x="20" y={y} width={30 + i * 5} height="4"
              rx="2" fill="rgba(148,163,184,0.15)" />
          ))}
        </svg>
      </div>
    );
  }

  if (condition === 'clear-night') {
    return (
      <div className={cls} style={{ width: s, height: s }}>
        <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
          {/* Moon */}
          <path d="M50 20 A20 20 0 1 0 50 60 A12 12 0 1 1 50 20Z"
            fill="#E2E8F0" />
          {/* Stars */}
          {[[20,18],[65,25],[70,45],[15,50],[60,60]].map(([x,y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 2 : 1.5}
              fill="white" opacity="0.8" />
          ))}
        </svg>
      </div>
    );
  }

  // Windy fallback
  return (
    <div className={cls} style={{ width: s, height: s }}>
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {[25, 35, 45, 55].map((y, i) => (
          <path key={i}
            d={`M10 ${y} Q${20 + i * 5} ${y - 8} ${50 + i * 3} ${y}`}
            stroke="#7DD3FC" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"
          />
        ))}
      </svg>
    </div>
  );
}
