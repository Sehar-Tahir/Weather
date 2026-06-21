// ============================================================
// WEATHERVERSE — Weather Graph Component
// Uses Recharts with glassmorphism styling
// ============================================================

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, Droplets, Wind, CloudRain } from 'lucide-react';
import type { GraphDataPoint, GraphType, TimeRange } from '../types/weather';

interface WeatherGraphProps {
  data: GraphDataPoint[];
  onRangeChange: (range: TimeRange) => void;
  currentRange: TimeRange;
}

type GraphConfig = {
  label: string;
  icon: React.ReactNode;
  type: GraphType;
  color: string;
  color2?: string;
  unit: string;
  chartType: 'area' | 'bar' | 'line';
};

const GRAPH_CONFIGS: GraphConfig[] = [
  {
    label: 'Temperature',
    icon: <TrendingUp size={14} />,
    type: 'temperature',
    color: '#ffffff',
    color2: '#ffffff',
    unit: '°C',
    chartType: 'area',
  },
  {
    label: 'Humidity',
    icon: <Droplets size={14} />,
    type: 'humidity',
    color: '#ffffff',
    unit: '%',
    chartType: 'area',
  },
  {
    label: 'Wind Speed',
    icon: <Wind size={14} />,
    type: 'wind',
    color: '#ffffff',
    unit: 'km/h',
    chartType: 'bar',
  },
  {
    label: 'Precipitation',
    icon: <CloudRain size={14} />,
    type: 'precipitation',
    color: '#ffffff',
    unit: '%',
    chartType: 'bar',
  },
];

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: '24 Hours', value: 'hourly' },
  { label: '7 Days', value: '7days' },
  { label: '14 Days', value: '14days' },
];

// Custom Tooltip
function CustomTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="custom-tooltip"
      style={{
        background: 'rgba(10,22,40,0.96)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 12,
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      }}
    >
      <p style={{ color: '#ffffff', fontSize: 11, marginBottom: 6, fontWeight: 600 }}>
        {label}
      </p>

      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: '#ffffff', fontSize: 13, fontWeight: 700, margin: 0 }}>
          {entry.name}: {entry.value}{unit}
        </p>
      ))}
    </div>
  );
}

export default function WeatherGraph({ data, onRangeChange, currentRange }: WeatherGraphProps) {
  const [activeGraph, setActiveGraph] = useState<GraphType>('temperature');
  const cfg = GRAPH_CONFIGS.find(g => g.type === activeGraph)!;

  const getDataKey = () => {
    if (activeGraph === 'temperature') return 'temperature';
    if (activeGraph === 'humidity') return 'humidity';
    if (activeGraph === 'wind') return 'windSpeed';
    return 'precipitation';
  };

  const dataKey = getDataKey();
  const hasHighLow = activeGraph === 'temperature' && data.some(d => d.high !== undefined);

  const renderChart = () => {
    if (cfg.chartType === 'area') {
      return (
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={cfg.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={cfg.color} stopOpacity={0} />
            </linearGradient>

            {cfg.color2 && (
              <linearGradient id="colorGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cfg.color2} stopOpacity={0.25} />
                <stop offset="95%" stopColor={cfg.color2} stopOpacity={0} />
              </linearGradient>
            )}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />

          <XAxis dataKey="label" tick={{ fill: '#ffffff', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#ffffff', fontSize: 11 }} tickLine={false} axisLine={false} width={35} />

          <Tooltip content={<CustomTooltip unit={cfg.unit} />} />

          {hasHighLow ? (
            <>
              <Area type="monotone" dataKey="high" stroke="#ffffff" fill="url(#colorGrad1)"
                strokeWidth={2} name="High" dot={false} />

              <Area type="monotone" dataKey="low" stroke="#ffffff" fill="url(#colorGrad2)"
                strokeWidth={2} name="Low" dot={false} />

              <Legend wrapperStyle={{ color: '#ffffff', fontSize: 12, paddingTop: 8 }} />
            </>
          ) : (
            <Area type="monotone" dataKey={dataKey} stroke="#ffffff" fill="url(#colorGrad1)"
              strokeWidth={2.5} name={cfg.label} dot={false}
              activeDot={{ r: 5, fill: '#ffffff', stroke: '#020817', strokeWidth: 2 }}
            />
          )}
        </AreaChart>
      );
    }

    if (cfg.chartType === 'bar') {
      return (
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />

          <XAxis dataKey="label" tick={{ fill: '#ffffff', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#ffffff', fontSize: 11 }} tickLine={false} axisLine={false} width={35} />

          <Tooltip content={<CustomTooltip unit={cfg.unit} />} />

          <Bar dataKey={dataKey} fill="#ffffff" name={cfg.label}
            radius={[4, 4, 0, 0]} fillOpacity={0.75}
            activeBar={{ fill: '#ffffff', fillOpacity: 1 }}
          />
        </BarChart>
      );
    }

    return (
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />

        <XAxis dataKey="label" tick={{ fill: '#ffffff', fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: '#ffffff', fontSize: 11 }} tickLine={false} axisLine={false} width={35} />

        <Tooltip content={<CustomTooltip unit={cfg.unit} />} />

        <Line type="monotone" dataKey={dataKey} stroke="#ffffff" strokeWidth={2.5}
          name={cfg.label} dot={false}
          activeDot={{ r: 5, fill: '#ffffff' }} />
      </LineChart>
    );
  };

  return (
    <div className="graph-container animate-fade-in-up delay-300">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="section-badge">📊 Analytics</div>
          <h3 className="text-lg font-bold text-white mt-1">Weather Trends</h3>
        </div>

        <div className="graph-tabs">
          {TIME_RANGES.map(tr => (
            <button
              key={tr.value}
              className={`graph-tab ${currentRange === tr.value ? 'active' : ''}`}
              onClick={() => onRangeChange(tr.value)}
            >
              {tr.label}
            </button>
          ))}
        </div>
      </div>

      <div className="graph-tabs mb-5 flex-wrap gap-2">
        {GRAPH_CONFIGS.map(g => (
          <button
            key={g.type}
            className={`graph-tab flex items-center gap-1.5 ${activeGraph === g.type ? 'active' : ''}`}
            onClick={() => setActiveGraph(g.type)}
          >
            {g.icon}
            {g.label}
          </button>
        ))}
      </div>

      <div style={{ width: '100%', height: 260 }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            No data available
          </div>
        )}
      </div>

      <p className="text-[11px] text-white mt-4 text-center">
        {currentRange === 'hourly'
          ? '⏱ Showing next 24 hours (3h intervals)'
          : currentRange === '7days'
          ? '📆 7-day daily average forecast'
          : '📅 14-day extended forecast (experimental)'}
      </p>

    </div>
  );
}