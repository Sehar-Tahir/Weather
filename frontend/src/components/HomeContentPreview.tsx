// ============================================================
// KARACHI WEATHER APP — Home Content Preview
// Shows latest Stories & Blogs on the home page
// ============================================================

import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Play, ArrowRight, Clock, Newspaper, BookOpen } from 'lucide-react';

function timeAgo(ts: number): string {
  const h = Math.floor((Date.now() - ts) / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function HomeContentPreview() {
  const { stories, blogs } = useApp();

  return (
    <div className="space-y-12">
      {/* ── STORIES ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="section-badge"><Newspaper size={11} /> Trending Now</div>
            <h2 className="text-2xl font-bold text-white mt-1">Weather Stories</h2>
          </div>
          <Link to="/stories" className="text-sm text-white hover:text-sky-300 flex items-center gap-1 font-semibold">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stories.slice(0, 4).map(story => (
            <Link to="/stories" key={story.id} className="story-card block">
              <div className="relative">
                <img src={story.thumbnail} alt={story.title} loading="lazy" decoding="async" className="story-card-img h-40" />
                <div className="story-card-overlay" />
                {story.type === 'video' && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-sky-500/80 backdrop-blur-sm flex items-center justify-center">
                    <Play size={13} className="text-white ml-0.5" fill="white" />
                  </div>
                )}
                <div className="absolute bottom-3 left-3">
                  <span className="category-tag">{story.category}</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-1">{story.title}</h3>
                <span className="text-[11px] text-whiteflex items-center gap-1">
                  <Clock size={10} /> {timeAgo(story.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BLOGS ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="section-badge"><BookOpen size={11} /> Read & Learn</div>
            <h2 className="text-2xl font-bold text-white mt-1">Latest Articles</h2>
          </div>
          <Link to="/blog" className="text-sm text-white hover:text-sky-300 flex items-center gap-1 font-semibold">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {blogs.slice(0, 3).map(blog => (
            <Link to="/blog" key={blog.id} className="blog-card block">
              <div className="h-40 overflow-hidden">
                <img src={blog.coverImage} alt={blog.title} loading="lazy" decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="category-tag">{blog.category}</span>
                  <span className="text-[11px] text-white">{blog.readTime} min</span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug line-clamp-2 mb-1">{blog.title}</h3>
                <p className="text-xs text-white line-clamp-2">{blog.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
