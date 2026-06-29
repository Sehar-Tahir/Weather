// pages/Stories.tsx - Updated Image Fallbacks

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarField from '../components/StarField';
import { useApp } from '../context/AppContext';
import type { Story } from '../store/localStore';
import { Play, Clock, X, FileText, Video } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';

// Local SVG fallback - No external dependencies
const FALLBACK_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#1a1a2e"/>
  <text x="400" y="180" font-family="Arial" font-size="32" fill="#475569" text-anchor="middle">No Image</text>
  <text x="400" y="230" font-family="Arial" font-size="24" fill="#334155" text-anchor="middle">📷</text>
</svg>
`);

const FALLBACK_THUMB = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <rect width="400" height="200" fill="#1a1a2e"/>
  <text x="200" y="95" font-family="Arial" font-size="20" fill="#475569" text-anchor="middle">No Image</text>
  <text x="200" y="125" font-family="Arial" font-size="16" fill="#334155" text-anchor="middle">📷</text>
</svg>
`);

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Stories() {
  const { stories } = useApp();
  const [selected, setSelected] = useState<Story | null>(null);

  return (
    <div className="app-bg min-h-screen relative">
      <StarField />
      <div className="relative z-10">
        <Navbar />

        <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="section-badge mx-auto mb-4">📰 Weather Stories</div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-6xl font-bold text-white mb-6 text-3d">
              Latest Stories
            </h1>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Breaking weather news, alerts and video reports from across Karachi and beyond.
            </p>
          </div>

          {/* Featured (first story) */}
          {stories[0] && (
            <div className="story-card mb-10 grid lg:grid-cols-2 gap-0 overflow-hidden"
              onClick={() => setSelected(stories[0])}>
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <img 
                  src={stories[0].thumbnail || FALLBACK_IMAGE} 
                  alt={stories[0].title} 
                  loading="lazy" 
                  decoding="async" 
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
                {stories[0].type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-sky-500/80 backdrop-blur-sm flex items-center justify-center live-glow">
                      <Play size={28} className="text-white ml-1" fill="white" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="category-tag">{stories[0].category}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={11} /> {timeAgo(stories[0].createdAt)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 leading-tight">{stories[0].title}</h2>
                <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                  {stories[0].type === 'text' ? stories[0].content : 'Watch the full video report.'}
                </p>
                <span className="text-sky-400 text-sm font-semibold">Read more →</span>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.slice(1).map((story, i) => (
              <RevealOnScroll key={story.id} variant="up" delay={i * 70} className="story-card">
                <div onClick={() => setSelected(story)} className="cursor-pointer">
                  <div className="relative">
                    <img 
                      src={story.thumbnail || FALLBACK_THUMB} 
                      alt={story.title} 
                      loading="lazy" 
                      decoding="async" 
                      className="w-full h-48 object-cover"
                      style={{ objectPosition: 'center' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_THUMB;
                      }}
                    />
                    <div className="story-card-overlay" />
                    {story.type === 'video' && (
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-sky-500/80 backdrop-blur-sm flex items-center justify-center">
                        <Play size={15} className="text-white ml-0.5" fill="white" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className="category-tag">{story.category}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-white mb-2 leading-snug line-clamp-2">{story.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        {story.type === 'video' ? <Video size={11} /> : <FileText size={11} />}
                        {story.author}
                      </span>
                      <span className="text-xs text-slate-600 flex items-center gap-1">
                        <Clock size={10} /> {timeAgo(story.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <Footer />
      </div>

      {/* Story Modal */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-content max-w-3xl" onClick={e => e.stopPropagation()}>
            {/* Media with proper sizing */}
            {selected.type === 'video' ? (
              <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                {selected.content.includes('youtube.com') || selected.content.includes('youtu.be') ? (
                  <iframe
                    src={selected.content.replace('watch?v=', 'embed/')}
                    title={selected.title}
                    className="w-full h-full absolute top-0 left-0"
                    style={{ border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    src={selected.content} 
                    controls 
                    className="w-full h-full absolute top-0 left-0 object-contain"
                    poster={selected.thumbnail}
                  />
                )}
              </div>
            ) : (
              selected.thumbnail && (
                <img 
                  src={selected.thumbnail || FALLBACK_IMAGE} 
                  alt={selected.title}
                  className="w-full max-h-96 object-contain bg-slate-900"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              )
            )}

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="category-tag">{selected.category}</span>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{selected.title}</h2>
              <p className="text-xs text-slate-500 mb-4 flex items-center gap-2">
                By {selected.author} · {timeAgo(selected.createdAt)}
              </p>
              {selected.type === 'text' && (
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{selected.content}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}