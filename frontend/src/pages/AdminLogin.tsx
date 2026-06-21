// src/pages/AdminLogin.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StarField from '../components/StarField';
import {
  Lock, Mail, Eye, EyeOff, Shield, ArrowLeft, AlertCircle, Cloud
} from 'lucide-react';

export default function AdminLogin() {
  const { login, isLoggedIn } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isLoggedIn) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email.trim(), password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-bg min-h-screen relative flex items-center justify-center p-4">
      <StarField />

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="login-card p-8 page-enter">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-400/30 to-indigo-500/30
              border border-sky-400/40 flex items-center justify-center mb-4 float-3d">
              <Shield size={28} className="text-sky-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white text-3d">Admin Portal</h1>
            <p className="text-white text-sm mt-1 flex items-center justify-center gap-1">
              <Cloud size={13} /> Karachi Weather Management
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl
              bg-red-500/10 border border-red-500/25 text-red-400 text-sm animate-scale-in">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="admin-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="samaiqatanvir@gmail.com"
                  className="admin-input pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="admin-input pl-11 pr-11"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full glass-btn-primary py-3 btn-3d flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Authenticating...' : '🔐 Sign In'}
            </button>
          </form>

          {/* Demo Credentials Info */}
          {/* <div className="mt-6 p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 text-xs">
            <p className="text-slate-400 mb-2 font-medium">Default Super Admin Credentials:</p>
            <p className="text-emerald-400">Email: <span className="font-mono">samaiqatanvir@gmail.com</span></p>
            <p className="text-emerald-400">Password: <span className="font-mono">samaiqa321</span></p>
            <p className="text-slate-500 mt-3 text-[10px]">
              (These are saved in MongoDB)
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}