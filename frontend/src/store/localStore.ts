// // ============================================================
// // KARACHI WEATHER APP — Local Store
// // localStorage-backed persistence for demo (works without backend).
// // In production, swap these calls with backend API calls (see /backend).
// // ============================================================

// export interface Story {
//   id: string;
//   title: string;
//   type: 'video' | 'text';
//   content: string;       // text body OR video URL
//   thumbnail?: string;    // image URL
//   category: string;
//   author: string;
//   createdAt: number;
// }

// export interface Blog {
//   id: string;
//   title: string;
//   excerpt: string;
//   content: string;
//   coverImage?: string;
//   category: string;
//   author: string;
//   readTime: number;
//   createdAt: number;
// }

// export interface RecentSearch {
//   query: string;
//   city: string;
//   temp: number;
//   condition: string;
//   timestamp: number;
// }

// // ── Keys ──────────────────────────────────────────────────
// const KEYS = {
//   stories: 'kw_stories',
//   blogs: 'kw_blogs',
//   recent: 'kw_recent_searches',
//   auth: 'kw_admin_auth',
// };

// // ── Generic helpers ───────────────────────────────────────
// function read<T>(key: string, fallback: T): T {
//   try {
//     const raw = localStorage.getItem(key);
//     return raw ? JSON.parse(raw) : fallback;
//   } catch {
//     return fallback;
//   }
// }

// function write<T>(key: string, value: T): void {
//   try {
//     localStorage.setItem(key, JSON.stringify(value));
//   } catch {}
// }

// // ── ID generator ──────────────────────────────────────────
// export const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// // ============================================================
// // STORIES
// // ============================================================
// const SEED_STORIES: Story[] = [
//   {
//     id: 'seed-s1',
//     title: 'Karachi Heatwave Alert: How to Stay Safe',
//     type: 'text',
//     content: 'Temperatures in Karachi are expected to soar past 40°C this week. Authorities advise residents to stay hydrated, avoid direct sunlight between 12 PM and 4 PM, and check on elderly neighbours. Heatstroke centres have been set up across the city.',
//     thumbnail: 'https://images.unsplash.com/photo-1561553543-e4c7b608b98d?w=800&q=80',
//     category: 'Weather Alert',
//     author: 'Weather Desk',
//     createdAt: Date.now() - 3600_000 * 2,
//   },
//   {
//     id: 'seed-s2',
//     title: 'Monsoon Season 2025: What to Expect in Sindh',
//     type: 'video',
//     content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
//     thumbnail: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&q=80',
//     category: 'Forecast',
//     author: 'Meteorology Team',
//     createdAt: Date.now() - 3600_000 * 8,
//   },
//   {
//     id: 'seed-s3',
//     title: 'Sea Breeze Returns: Relief for Coastal Karachi',
//     type: 'text',
//     content: 'The much-awaited sea breeze has resumed along the Karachi coastline, bringing down the apparent temperature by several degrees. Residents near Clifton and DHA reported a pleasant evening after days of stifling heat.',
//     thumbnail: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
//     category: 'Local News',
//     author: 'City Reporter',
//     createdAt: Date.now() - 3600_000 * 20,
//   },
// ];

// export const StoriesStore = {
//   getAll(): Story[] {
//     const data = read<Story[]>(KEYS.stories, []);
//     if (data.length === 0) {
//       write(KEYS.stories, SEED_STORIES);
//       return SEED_STORIES;
//     }
//     return data.sort((a, b) => b.createdAt - a.createdAt);
//   },
//   add(story: Omit<Story, 'id' | 'createdAt'>): Story {
//     const all = this.getAll();
//     const newStory: Story = { ...story, id: genId(), createdAt: Date.now() };
//     write(KEYS.stories, [newStory, ...all]);
//     return newStory;
//   },
//   remove(id: string): void {
//     write(KEYS.stories, this.getAll().filter(s => s.id !== id));
//   },
// };

// // ============================================================
// // BLOGS
// // ============================================================
// const SEED_BLOGS: Blog[] = [
//   {
//     id: 'seed-b1',
//     title: 'Understanding Karachi\'s Unique Coastal Climate',
//     excerpt: 'Why does Karachi feel hotter than the thermometer says? We break down humidity, sea breeze, and the urban heat island effect.',
//     content: 'Karachi sits on the Arabian Sea coast, giving it a hot desert climate moderated by ocean proximity. The high humidity often makes the "feels like" temperature significantly higher than the actual reading. The urban heat island effect — caused by concrete and reduced greenery — pushes night-time temperatures up as well. Understanding these factors helps residents prepare better for extreme weather days.',
//     coverImage: 'https://images.unsplash.com/photo-1532978379173-523e16f371f9?w=1000&q=80',
//     category: 'Climate Science',
//     author: 'Dr. Ayesha Khan',
//     readTime: 5,
//     createdAt: Date.now() - 3600_000 * 24,
//   },
//   {
//     id: 'seed-b2',
//     title: 'Top 7 Apps & Tools for Tracking Pakistan Weather',
//     excerpt: 'From radar maps to air-quality monitors, here are the best free tools to stay ahead of the weather in 2025.',
//     content: 'Staying informed about weather is easier than ever. This guide covers the best radar tools, AQI monitors, and forecast models available for Pakistan. We compare accuracy, update frequency, and ease of use so you can choose the right tool for your needs.',
//     coverImage: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=1000&q=80',
//     category: 'Guides',
//     author: 'Tech Editor',
//     readTime: 7,
//     createdAt: Date.now() - 3600_000 * 50,
//   },
//   {
//     id: 'seed-b3',
//     title: 'How Climate Change Is Reshaping Monsoon Patterns',
//     excerpt: 'Rainfall is becoming more erratic across South Asia. Here\'s what the latest research tells us.',
//     content: 'Climate scientists have observed increasingly erratic monsoon behaviour over the past decade. Rainfall now arrives in shorter, more intense bursts, increasing urban flooding risk. This article explores the data and what cities like Karachi can do to adapt their infrastructure.',
//     coverImage: 'https://images.unsplash.com/photo-1438449805896-28a666819a20?w=1000&q=80',
//     category: 'Environment',
//     author: 'Environmental Desk',
//     readTime: 6,
//     createdAt: Date.now() - 3600_000 * 72,
//   },
// ];

// export const BlogsStore = {
//   getAll(): Blog[] {
//     const data = read<Blog[]>(KEYS.blogs, []);
//     if (data.length === 0) {
//       write(KEYS.blogs, SEED_BLOGS);
//       return SEED_BLOGS;
//     }
//     return data.sort((a, b) => b.createdAt - a.createdAt);
//   },
//   add(blog: Omit<Blog, 'id' | 'createdAt'>): Blog {
//     const all = this.getAll();
//     const newBlog: Blog = { ...blog, id: genId(), createdAt: Date.now() };
//     write(KEYS.blogs, [newBlog, ...all]);
//     return newBlog;
//   },
//   remove(id: string): void {
//     write(KEYS.blogs, this.getAll().filter(b => b.id !== id));
//   },
// };

// // ============================================================
// // RECENT SEARCHES
// // ============================================================
// export const RecentStore = {
//   getAll(): RecentSearch[] {
//     return read<RecentSearch[]>(KEYS.recent, []);
//   },
//   add(search: RecentSearch): void {
//     let all = this.getAll();
//     // Remove duplicate by city
//     all = all.filter(s => s.city.toLowerCase() !== search.city.toLowerCase());
//     all.unshift(search);
//     all = all.slice(0, 8); // keep last 8
//     write(KEYS.recent, all);
//   },
//   clear(): void {
//     write(KEYS.recent, []);
//   },
// };

// // ============================================================
// // ADMIN AUTH (demo — client side)
// // In production this is handled by the backend with JWT.
// // ============================================================
// export const ADMIN_CREDENTIALS = {
//   email: 'admin@karachiweather.com',
//   password: 'admin123',
// };

// export const AuthStore = {
//   isLoggedIn(): boolean {
//     return read<boolean>(KEYS.auth, false);
//   },
//   login(email: string, password: string): boolean {
//     if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
//       write(KEYS.auth, true);
//       return true;
//     }
//     return false;
//   },
//   logout(): void {
//     write(KEYS.auth, false);
//   },
// };
