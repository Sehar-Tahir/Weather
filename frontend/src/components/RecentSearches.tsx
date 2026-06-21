// components/RecentSearches.tsx - COMPLETE FIX
import { History, X, MapPin, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RecentSearchesProps {
  onSelect: (city: string) => void;
}

export default function RecentSearches({ onSelect }: RecentSearchesProps) {
  const context = useApp();
  
  // Safety check - if context is undefined or missing recentSearches
  if (!context || !context.recentSearches) {
    return null; // Don't render if context isn't ready
  }
  
  const { recentSearches, clearRecent } = context;

  // Check if recentSearches exists and has items
  if (!recentSearches || recentSearches.length === 0) {
    return null;
  }

  return (
    <div className="glass-card p-4 max-w-3xl mx-auto mt-4 animate-fade-in mb-10">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 text-xs text-white font-semibold uppercase tracking-wider">
          <History size={13} className="text-sky-400" />
          Recent Searches
        </span>
        <button
          onClick={clearRecent}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={11} /> Clear
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {recentSearches.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s.city)}
            className="group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full
              bg-white/5 border border-white/10 hover:bg-sky-400/10 hover:border-sky-400/30
              transition-all"
          >
            <MapPin size={11} className="text-sky-400" />
            <span className="text-xs text-white group-hover:text-white font-medium">
              {s.city}
            </span>
            <span className="text-xs font-bold text-sky-200">{s.temp}°</span>
            <X size={11} className="text-slate-600 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}