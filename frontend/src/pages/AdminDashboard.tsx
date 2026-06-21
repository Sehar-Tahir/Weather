// pages/AdminDashboard.tsx - COMPLETE VERSION WITH IMPROVED CONTACTS MANAGEMENT
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MediaUploader from '../components/MediaUploader';
import {
  LayoutDashboard, Newspaper, BookOpen, LogOut, Plus, Trash2,
  X, Loader2, Users, Shield, UserPlus, Edit2, Power, CheckCircle,
  Upload, Image as ImageIcon, Mail, MessageSquare, Phone, Clock
} from 'lucide-react';

type Tab = 'overview' | 'stories' | 'blogs' | 'admins' | 'contacts';

export default function AdminDashboard() {
  const { 
    currentAdmin, 
    isLoggedIn, 
    logout, 
    stories, 
    blogs, 
    admins, 
    contacts = [], 
    refreshStories, 
    refreshBlogs,
    refreshContacts 
  } = useApp();

  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin');
      return;
    }
    const loadData = async () => {
      await Promise.all([
        refreshStories(), 
        refreshBlogs(),
        refreshContacts ? refreshContacts() : Promise.resolve()
      ]);
      setLoading(false);
    };
    loadData();
  }, [isLoggedIn, navigate, refreshStories, refreshBlogs, refreshContacts]);

  if (!isLoggedIn || loading) {
    return (
      <div className="app-bg min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-sky-400" />
      </div>
    );
  }

  const isSuperAdmin = currentAdmin?.role === 'superadmin';

  return (
    <div className="app-bg min-h-screen relative">
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="lg:w-72 lg:min-h-screen border-r border-white/5 bg-black/40 backdrop-blur-xl p-4">
          {/* Admin Profile */}
          <div className="flex items-center gap-3 px-2 mb-6 pb-4 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400/30 to-indigo-500/30 border border-sky-400/30 flex items-center justify-center">
              <Shield size={22} className="text-sky-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{currentAdmin?.name}</p>
              <p className="text-xs text-white">{currentAdmin?.email}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isSuperAdmin ? 'bg-purple-500/20 text-purple-400' : 'bg-sky-500/20 text-sky-400'}`}>
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>

          <nav className="flex lg:flex-col gap-1">
            <button className={`admin-sidebar-item ${tab === 'overview' ? 'active' : ''}`}
              onClick={() => setTab('overview')}>
              <LayoutDashboard size={18} /> <span>Overview</span>
            </button>
            <button className={`admin-sidebar-item ${tab === 'stories' ? 'active' : ''}`}
              onClick={() => setTab('stories')}>
              <Newspaper size={18} /> <span>Stories</span>
            </button>
            <button className={`admin-sidebar-item ${tab === 'blogs' ? 'active' : ''}`}
              onClick={() => setTab('blogs')}>
              <BookOpen size={18} /> <span>Blogs</span>
            </button>

            {/* Contacts - Visible to ALL Admins */}
            <button className={`admin-sidebar-item ${tab === 'contacts' ? 'active' : ''}`}
              onClick={() => setTab('contacts')}>
              <Mail size={18} /> <span>Contacts / Queries</span>
            </button>

            {isSuperAdmin && (
              <button className={`admin-sidebar-item ${tab === 'admins' ? 'active' : ''}`}
                onClick={() => setTab('admins')}>
                <Users size={18} /> <span>Manage Admins</span>
              </button>
            )}
          </nav>

          <div className="divider my-2" />
          <button className="admin-sidebar-item text-red-400 hover:bg-red-500/10" onClick={logout}>
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          {tab === 'overview' && <Overview stories={stories} blogs={blogs} setTab={setTab} currentAdmin={currentAdmin} />}
          {tab === 'stories' && <StoriesManager />}
          {tab === 'blogs' && <BlogsManager />}
          {tab === 'admins' && <AdminsManager />}
          {tab === 'contacts' && <ContactsManager />}
        </main>
      </div>
    </div>
  );
}

// ============================================================
// OVERVIEW COMPONENT
// ============================================================
function Overview({ stories, blogs, setTab, currentAdmin }: any) {
  const stats = [
    { label: 'Total Stories', value: stories.length, icon: <Newspaper size={20} />, color: 'from-sky-400 to-blue-500', tab: 'stories' },
    { label: 'Published Blogs', value: blogs.length, icon: <BookOpen size={20} />, color: 'from-emerald-400 to-teal-500', tab: 'blogs' },
    { label: 'Admin Users', value: currentAdmin?.role === 'superadmin' ? 'Full Access' : 'Limited', icon: <Shield size={20} />, color: 'from-purple-400 to-indigo-500', tab: 'admins' },
    { label: 'Media Items', value: 'Manage', icon: <ImageIcon size={20} />, color: 'from-amber-400 to-orange-500', tab: 'stories' },
  ];

  const recentStories = stories.slice(0, 5);
  const recentBlogs = blogs.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white mt-1">Welcome back, {currentAdmin?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-5 cursor-pointer hover:scale-105 transition-all" onClick={() => setTab(stat.tab)}>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20 flex items-center justify-center mb-3`}>
              <div className="text-white">{stat.icon}</div>
            </div>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Stories */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Recent Stories</h2>
            <button onClick={() => setTab('stories')} className="text-xs text-sky-400 hover:text-sky-300">View all →</button>
          </div>
          {recentStories.length === 0 ? (
            <p className="text-slate-500 text-sm">No stories yet. Click "Add Story" to create one.</p>
          ) : (
            <div className="space-y-3">
              {recentStories.map((story: any) => (
                <div key={story._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5">
                  {story.thumbnail && (
                    <img src={story.thumbnail} alt={story.title} className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium line-clamp-1">{story.title}</p>
                    <p className="text-xs text-slate-500">{new Date(story.createdAt).toLocaleDateString()}</p>
                  </div>
                  {story.type === 'video' && <Video size={14} className="text-sky-400" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Blogs */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Recent Blogs</h2>
            <button onClick={() => setTab('blogs')} className="text-xs text-sky-400 hover:text-sky-300">View all →</button>
          </div>
          {recentBlogs.length === 0 ? (
            <p className="text-slate-500 text-sm">No blogs yet. Click "Add Blog" to create one.</p>
          ) : (
            <div className="space-y-3">
              {recentBlogs.map((blog: any) => (
                <div key={blog._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5">
                  {blog.coverImage && (
                    <img src={blog.coverImage} alt={blog.title} className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium line-clamp-1">{blog.title}</p>
                    <p className="text-xs text-slate-500">{blog.readTime} min read • {new Date(blog.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STORIES MANAGER COMPONENT
// ============================================================
function StoriesManager() {
  const { stories, addStory, updateStory, deleteStory } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'text',
    content: '',
    thumbnail: '',
    category: 'Weather Alert'
  });

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'text',
      content: '',
      thumbnail: '',
      category: 'Weather Alert'
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    setLoading(true);
    try {
      if (editing) {
        await updateStory(editing._id, formData);
      } else {
        await addStory(formData);
      }
      resetForm();
    } catch (error) {
      alert('Failed to save story');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      setLoading(true);
      try {
        await deleteStory(id);
      } catch (error) {
        alert('Failed to delete story');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMediaUpload = (url: string, type: string) => {
    setFormData(prev => ({ ...prev, thumbnail: url }));
    setShowUploader(false);
  };

  const categories = ['Weather Alert', 'Forecast', 'Local News', 'Climate', 'Emergency'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Stories</h1>
          <p className="text-slate-400 text-sm mt-1">Create and manage weather stories</p>
        </div>
        <button onClick={() => setShowForm(true)} className="glass-btn-primary px-5 py-2.5 flex items-center gap-2">
          <Plus size={16} /> Add Story
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-backdrop" onClick={resetForm}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">{editing ? 'Edit Story' : 'New Story'}</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input className="admin-input" placeholder="Story Title" value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })} required disabled={loading} />

              <select className="admin-input" value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as 'text' | 'video' })}>
                <option value="text">Text Story</option>
                <option value="video">Video Story</option>
              </select>

              <select className="admin-input" value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              {formData.type === 'text' ? (
                <textarea className="admin-input min-h-[200px]" placeholder="Story Content (HTML supported)"
                  value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required />
              ) : (
                <input className="admin-input" placeholder="YouTube Video URL or Embed Code"
                  value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required />
              )}

              <div>
                <label className="admin-label">Thumbnail Image</label>
                <div className="flex gap-2">
                  <input className="admin-input flex-1" placeholder="Image URL" value={formData.thumbnail}
                    onChange={e => setFormData({ ...formData, thumbnail: e.target.value })} />
                  <button type="button" onClick={() => setShowUploader(true)} className="glass-btn px-4">
                    <Upload size={16} />
                  </button>
                </div>
                {formData.thumbnail && (
                  <img src={formData.thumbnail} alt="Preview" className="mt-2 h-24 rounded-lg object-cover" />
                )}
              </div>

              <button type="submit" className="glass-btn-primary w-full py-2.5" disabled={loading}>
                {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : (editing ? 'Update Story' : 'Create Story')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Media Uploader */}
      {showUploader && <MediaUploader onUpload={handleMediaUpload} onClose={() => setShowUploader(false)} />}

      {/* Stories List */}
      <div className="grid gap-4">
        {stories.length === 0 ? (
          <div className="glass-card p-10 text-center text-slate-500">No stories yet. Click "Add Story" to create one.</div>
        ) : (
          stories.map((story: any) => (
            <div key={story._id} className="glass-card p-4 flex items-start gap-4 hover-lift">
              {story.thumbnail && (
                <img src={story.thumbnail} alt={story.title} className="w-20 h-20 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">{story.title}</h3>
                  {story.type === 'video' && <Video size={14} className="text-sky-400" />}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400">{story.category}</span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">{story.content.substring(0, 100)}</p>
                <p className="text-xs text-slate-500 mt-1">By {story.author} • {new Date(story.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(story); setFormData(story); setShowForm(true); }} 
                  className="p-2 text-sky-400 hover:bg-sky-500/10 rounded-lg">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(story._id)} 
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================
// BLOGS MANAGER COMPONENT
// ============================================================
function BlogsManager() {
  const { blogs, addBlog, updateBlog, deleteBlog } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'Climate Science',
    readTime: 5
  });

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      category: 'Climate Science',
      readTime: 5
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    setLoading(true);
    try {
      if (editing) {
        await updateBlog(editing._id, formData);
      } else {
        await addBlog(formData);
      }
      resetForm();
    } catch (error) {
      alert('Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      setLoading(true);
      try {
        await deleteBlog(id);
      } catch (error) {
        alert('Failed to delete blog');
      } finally {
        setLoading(false);
      }
    }
  };

  const categories = ['Climate Science', 'Guides', 'Environment', 'Technology', 'News', 'Analysis'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Blogs</h1>
          <p className="text-slate-400 text-sm mt-1">Create and manage blog articles</p>
        </div>
        <button onClick={() => setShowForm(true)} className="glass-btn-primary px-5 py-2.5 flex items-center gap-2">
          <Plus size={16} /> Add Blog
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-backdrop" onClick={resetForm}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">{editing ? 'Edit Blog' : 'New Blog'}</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input className="admin-input" placeholder="Blog Title" value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })} required disabled={loading} />

              <input className="admin-input" placeholder="Short Excerpt (summary)" value={formData.excerpt}
                onChange={e => setFormData({ ...formData, excerpt: e.target.value })} required />

              <textarea className="admin-input min-h-[200px]" placeholder="Blog Content (HTML supported)"
                value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required />

              <div className="grid grid-cols-2 gap-4">
                <select className="admin-input" value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <input className="admin-input" type="number" placeholder="Read Time (minutes)" value={formData.readTime}
                  onChange={e => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })} />
              </div>

              <div>
                <label className="admin-label">Cover Image</label>
                <div className="flex gap-2">
                  <input className="admin-input flex-1" placeholder="Image URL" value={formData.coverImage}
                    onChange={e => setFormData({ ...formData, coverImage: e.target.value })} />
                  <button type="button" onClick={() => setShowUploader(true)} className="glass-btn px-4">
                    <Upload size={16} />
                  </button>
                </div>
                {formData.coverImage && (
                  <img src={formData.coverImage} alt="Preview" className="mt-2 h-24 rounded-lg object-cover" />
                )}
              </div>

              <button type="submit" className="glass-btn-primary w-full py-2.5" disabled={loading}>
                {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : (editing ? 'Update Blog' : 'Create Blog')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Media Uploader */}
      {showUploader && <MediaUploader onUpload={(url: string) => setFormData(prev => ({ ...prev, coverImage: url }))} onClose={() => setShowUploader(false)} />}

      {/* Blogs List */}
      <div className="grid gap-4">
        {blogs.length === 0 ? (
          <div className="glass-card p-10 text-center text-slate-500">No blogs yet. Click "Add Blog" to create one.</div>
        ) : (
          blogs.map((blog: any) => (
            <div key={blog._id} className="glass-card p-4 flex items-start gap-4 hover-lift">
              {blog.coverImage && (
                <img src={blog.coverImage} alt={blog.title} className="w-20 h-20 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">{blog.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">{blog.category}</span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-1">{blog.excerpt}</p>
                <p className="text-xs text-slate-500 mt-1">{blog.readTime} min read • By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(blog); setFormData(blog); setShowForm(true); }} 
                  className="p-2 text-sky-400 hover:bg-sky-500/10 rounded-lg">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(blog._id)} 
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================
// ADMINS MANAGER (Super Admin Only)
// ============================================================
function AdminsManager() {
  const { admins, createAdmin, updateAdmin, deleteAdmin, refreshStories } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'admin',
    permissions: {
      stories: true,
      blogs: true,
      media: true,
      manageAdmins: false
    }
  });

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      password: '',
      role: 'admin',
      permissions: { stories: true, blogs: true, media: true, manageAdmins: false }
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name || (!editing && !formData.password)) return;
    
    setLoading(true);
    try {
      if (editing) {
        await updateAdmin(editing._id, formData);
      } else {
        await createAdmin(formData);
      }
      await refreshStories();
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (admin: any) => {
    if (admin.role === 'superadmin') {
      alert('Cannot delete super admin');
      return;
    }
    if (confirm(`Are you sure you want to delete ${admin.name}?`)) {
      setLoading(true);
      try {
        await deleteAdmin(admin._id);
        await refreshStories();
      } catch (error) {
        alert('Failed to delete');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleActive = async (admin: any) => {
    if (admin.role === 'superadmin') return;
    setLoading(true);
    try {
      await updateAdmin(admin._id, { isActive: !admin.isActive });
      await refreshStories();
    } catch (error) {
      alert('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Admins</h1>
          <p className="text-slate-400 text-sm mt-1">Create and manage admin accounts</p>
        </div>
        <button onClick={() => setShowForm(true)} className="glass-btn-primary px-5 py-2.5 flex items-center gap-2">
          <UserPlus size={16} /> Add Admin
        </button>
      </div>

      {showForm && (
        <div className="modal-backdrop" onClick={resetForm}>
          <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{editing ? 'Edit Admin' : 'New Admin'}</h2>
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input className="admin-input" placeholder="Full Name" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} required disabled={loading} />
              
              <input className="admin-input" placeholder="Email" type="email" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })} required disabled={loading} />

              {!editing && (
                <input className="admin-input" placeholder="Password" type="password" value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })} required disabled={loading} />
              )}

              <select className="admin-input" value={formData.role} 
                onChange={e => setFormData({ ...formData, role: e.target.value })} disabled={loading}>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>

              <div className="space-y-2">
                <label className="admin-label">Permissions</label>
                {['stories', 'blogs', 'media', 'manageAdmins'].map(perm => (
                  <label key={perm} className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={formData.permissions[perm]}
                      onChange={e => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, [perm]: e.target.checked }
                      })} disabled={loading || formData.role === 'superadmin'} />
                    <span className="capitalize">{perm.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>

              <button type="submit" className="glass-btn-primary w-full py-2.5" disabled={loading}>
                {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : (editing ? 'Update Admin' : 'Create Admin')}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {admins.length === 0 ? (
          <div className="glass-card p-10 text-center text-slate-500">No admins found</div>
        ) : (
          admins.map((admin: any) => (
            <div key={admin._id} className="glass-card p-4 flex items-center gap-4 hover-lift">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${admin.role === 'superadmin' ? 'bg-purple-500/20' : 'bg-sky-500/20'}`}>
                <Shield size={20} className={admin.role === 'superadmin' ? 'text-purple-400' : 'text-sky-400'} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white">{admin.name}</h3>
                  {admin.role === 'superadmin' && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">Super</span>}
                  {!admin.isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Inactive</span>}
                </div>
                <p className="text-xs text-slate-500">{admin.email}</p>
                <p className="text-xs text-slate-600 mt-1">Last login: {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(admin); setFormData(admin); setShowForm(true); }} 
                  className="p-2 text-sky-400 hover:bg-sky-500/10 rounded-lg">
                  <Edit2 size={16} />
                </button>
                {admin.role !== 'superadmin' && (
                  <>
                    <button onClick={() => handleToggleActive(admin)} 
                      className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-lg">
                      {admin.isActive ? <Power size={16} /> : <CheckCircle size={16} />}
                    </button>
                    <button onClick={() => handleDelete(admin)} 
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================
// CONTACTS MANAGER COMPONENT (Improved UI)
// ============================================================
function ContactsManager() {
  const { contacts = [], refreshContacts, updateContactStatus, deleteContact } = useApp();

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');

  const filteredContacts = contacts
    .filter(c => filter === 'all' || c.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = async (id: string, newStatus: 'new' | 'read' | 'replied') => {
    setLoading(true);
    try {
      await updateContactStatus(id, newStatus);
      if (refreshContacts) await refreshContacts();
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete message from ${name}?`)) return;
    setLoading(true);
    try {
      await deleteContact(id);
      if (refreshContacts) await refreshContacts();
    } catch (error) {
      alert('Failed to delete contact');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'new') return 'bg-yellow-500 text-black font-medium';
    if (status === 'read') return 'bg-blue-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Mail size={32} className="text-sky-400" /> User Queries
          </h1>
          <p className="text-slate-400 text-sm mt-1">View and manage contact form submissions</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        {(['all', 'new', 'read', 'replied'] as const).map(st => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === st 
                ? 'bg-white text-black shadow-lg' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {st === 'all' ? 'All' : st.charAt(0).toUpperCase() + st.slice(1)}
          </button>
        ))}
      </div>

      {filteredContacts.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <MessageSquare size={64} className="mx-auto text-slate-500 mb-6" />
          <p className="text-xl text-slate-400">No contact messages found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredContacts.map((contact: any) => (
            <div key={contact._id} className="glass-card p-6 rounded-2xl hover-lift border border-white/10">
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <Users size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{contact.name}</h3>
                    <a href={`mailto:${contact.email}`} className="text-sky-400 hover:underline text-sm block">
                      {contact.email}
                    </a>
                    {contact.phone && (
                      <p className="text-slate-400 text-sm flex items-center gap-1 mt-0.5">
                        <Phone size={15} /> {contact.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-4 py-1.5 rounded-full ${getStatusColor(contact.status)}`}>
                    {contact.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={15} />
                    {new Date(contact.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-5 mb-6 text-slate-100 leading-relaxed min-h-[80px]">
                {contact.message || "No message content"}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => handleStatusChange(contact._id, 'read')}
                  disabled={contact.status === 'read' || loading}
                  className="flex-1 bg-blue-600/90 hover:bg-blue-600 disabled:bg-blue-900/50 py-3 rounded-xl text-white font-medium transition-all"
                >
                  Mark as Read
                </button>

                <button 
                  onClick={() => handleStatusChange(contact._id, 'replied')}
                  disabled={contact.status === 'replied' || loading}
                  className="flex-1 bg-emerald-600/90 hover:bg-emerald-600 disabled:bg-emerald-900/50 py-3 rounded-xl text-white font-medium transition-all"
                >
                  Mark as Replied
                </button>

                <button 
                  onClick={() => handleDelete(contact._id, contact.name)}
                  disabled={loading}
                  className="px-6 bg-red-500/80 hover:bg-red-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}