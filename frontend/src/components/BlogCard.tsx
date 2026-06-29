// components/BlogCard.tsx - Using Utility

import { User, Clock, ArrowRight } from 'lucide-react';
import type { Blog } from '../store/localStore';
import { FALLBACK_IMAGE, handleImageError, getImageWithFallback } from '../utils/fallbackImages';

interface BlogCardProps {
  blog: Blog;
  onClick?: () => void;
  compact?: boolean;
}

function timeAgo(ts: number): string {
  const h = Math.floor((Date.now() - ts) / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function BlogCard({ blog, onClick, compact }: BlogCardProps) {
  return (
    <div className="blog-card cursor-pointer" onClick={onClick}>
      <div className={compact ? 'h-40 overflow-hidden' : 'h-44 overflow-hidden'}>
        <img
          src={getImageWithFallback(blog.coverImage)}
          alt={blog.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          style={{ objectPosition: 'center' }}
          onError={handleImageError}
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="category-tag">{blog.category}</span>
          <span className="text-[11px] text-slate-500">{blog.readTime} min</span>
        </div>
        <h3 className="text-base font-bold text-white mb-2 leading-snug line-clamp-2">{blog.title}</h3>
        <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">{blog.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <User size={11} /> {blog.author}
          </span>
          <span className="text-sky-400 text-xs font-semibold flex items-center gap-1">
            Read <ArrowRight size={12} />
          </span>
        </div>
        {!compact && (
          <span className="text-[10px] text-slate-600 flex items-center gap-1 mt-2">
            <Clock size={9} /> {timeAgo(blog.createdAt)}
          </span>
        )}
      </div>
    </div>
  );
}