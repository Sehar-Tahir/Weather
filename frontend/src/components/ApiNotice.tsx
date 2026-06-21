// ============================================================
// WEATHERVERSE — API Key Notice Banner
// ============================================================

import { Info, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';

export default function ApiNotice() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="animate-fade-in-up mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
      <div
        className="flex items-start gap-3 p-4 rounded-2xl"
        style={{
          background: 'rgba(56,189,248,0.06)',
          border: '1px solid rgba(56,189,248,0.20)',
        }}
      >
        <Info size={16} className="text-sky-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-sky-300 font-semibold">Demo Mode Active</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Using realistic mock data. For live weather, add your{' '}
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 underline inline-flex items-center gap-0.5"
            >
              OpenWeatherMap API key <ExternalLink size={10} />
            </a>{' '}
            as <code className="bg-white/10 px-1 py-0.5 rounded text-sky-300">VITE_OPENWEATHER_API_KEY</code> in your .env file.
          </p>
        </div>
        <button onClick={() => setDismissed(true)} className="text-slate-500 hover:text-slate-300 transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
