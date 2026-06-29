// pages/Blog.tsx - Updated Image Fallbacks

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarField from '../components/StarField';
import { useApp } from '../context/AppContext';
import type { Blog as BlogType } from '../store/localStore';
import { Clock, X, BookOpen, User } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import RevealOnScroll from '../components/RevealOnScroll';

// Local SVG fallback - No external dependencies
const FALLBACK_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#1a1a2e"/>
  <text x="400" y="180" font-family="Arial" font-size="32" fill="#475569" text-anchor="middle">No Image</text>
  <text x="400" y="230" font-family="Arial" font-size="24" fill="#334155" text-anchor="middle">📷</text>
</svg>
`);

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Blog() {
  const { blogs } = useApp();
  const [selected, setSelected] = useState<BlogType | null>(null);

  return (
    <div className="app-bg min-h-screen relative">
      <StarField />
      <div className="relative z-10">
        <Navbar />

        <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="section-badge mx-auto mb-4"><BookOpen size={12} /> Weather Blog</div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-6xl font-bold text-white mb-6 text-3d">
              Karachi Weather
            </h1>
            <p className="text-white text-lg max-w-2xl mx-auto">
              In-depth articles, guides and analysis on climate, forecasting and weather science.
            </p>
          </div>

          {/* Featured blog */}
          {blogs[0] && (
            <div className="blog-card mb-10 lg:flex-row hover-lift cursor-pointer"
              onClick={() => setSelected(blogs[0])}>
              <div className="lg:w-1/2 h-64 lg:h-auto overflow-hidden">
                <img 
                  src={blogs[0].coverImage || FALLBACK_IMAGE} 
                  alt={blogs[0].title} 
                  loading="lazy" 
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  style={{ objectPosition: 'center' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }} 
                />
              </div>
              <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="category-tag">{blogs[0].category}</span>
                  <span className="text-xs text-slate-500">{blogs[0].readTime} min read</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 leading-tight">{blogs[0].title}</h2>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3">{blogs[0].excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <User size={12} /> {blogs[0].author}
                  <span>·</span>
                  <Clock size={11} /> {timeAgo(blogs[0].createdAt)}
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(1).map((blog, i) => (
              <RevealOnScroll key={blog.id} variant="up" delay={i * 80}>
                <BlogCard blog={blog} onClick={() => setSelected(blog)} />
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <Footer />
      </div>

      {/* Blog Modal */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-content max-w-3xl" onClick={e => e.stopPropagation()}>
            {selected.coverImage && (
              <img 
                src={selected.coverImage || FALLBACK_IMAGE} 
                alt={selected.title} 
                className="w-full max-h-96 object-contain bg-slate-900"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="category-tag">{selected.category}</span>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{selected.title}</h2>
              <p className="text-xs text-slate-500 mb-5 flex items-center gap-2">
                <User size={12} /> {selected.author} · {selected.readTime} min read · {timeAgo(selected.createdAt)}
              </p>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{selected.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}