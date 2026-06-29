// pages/Contact.tsx

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarField from '../components/StarField';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { contactApi } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    message: '' 
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await contactApi.submit(formData);
      console.log('✅ Contact submitted:', response.data);
      
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setError(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-bg min-h-screen relative">
      <StarField />
      <div className="relative z-10">
        <Navbar />

        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-white mb-3">Contact Us</h1>
            <p className="text-white">We'd love to hear from you</p>
          </div>

          {success ? (
            <div className="glass-card p-12 text-center animate-scale-in">
              <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4" />
              <h2 className="text-3xl text-emerald-400 mb-4">✅ Thank You!</h2>
              <p className="text-white">Your message has been received. We'll get back to you soon!</p>
              <button 
                onClick={() => setSuccess(false)} 
                className="glass-btn mt-6"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              
              <input 
                type="text" 
                placeholder="Your Name" 
                className="admin-input" 
                required
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
              
              <input 
                type="email" 
                placeholder="Email Address" 
                className="admin-input" 
                required
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
              
              <input 
                type="tel" 
                placeholder="Phone Number (Optional)" 
                className="admin-input"
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
              />
              
              <textarea 
                placeholder="Your Message" 
                rows={5} 
                className="admin-input" 
                required
                value={formData.message} 
                onChange={e => setFormData({...formData, message: e.target.value})} 
              />

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full glass-btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={18} /> 
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}