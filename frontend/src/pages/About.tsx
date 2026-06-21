// ============================================================
// KARACHI WEATHER APP — About Page
// ============================================================

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarField from '../components/StarField';
import {
  Cloud, Target, Zap, Globe, Shield, TrendingUp,
  Thermometer, Droplets, Wind, MapPin, BarChart3, Users
} from 'lucide-react';

const FEATURES = [
  { icon: <Thermometer size={22} />, title: 'Live Temperature', desc: 'Real-time temperature updates with °C/°F toggle and "feels like" readings.' },
  { icon: <BarChart3 size={22} />, title: 'Interactive Graphs', desc: 'Visualize temperature, humidity, wind and precipitation trends over time.' },
  { icon: <MapPin size={22} />, title: 'Multi-Search', desc: 'Search by city name, ZIP/postal code, or use your GPS location instantly.' },
  { icon: <Wind size={22} />, title: 'Air Quality', desc: 'Monitor the Air Quality Index with color-coded health indicators.' },
  { icon: <TrendingUp size={22} />, title: 'Forecasts', desc: '7-day and hourly forecasts, plus past & future weather predictions.' },
  { icon: <Globe size={22} />, title: 'Global Coverage', desc: 'Access weather data for any city worldwide, with quick-access cities.' },
];

const STATS = [
  { value: '200K+', label: 'Cities Covered', icon: <Globe size={18} /> },
  { value: '99.9%', label: 'Uptime', icon: <Shield size={18} /> },
  { value: 'Real-Time', label: 'Data Updates', icon: <Zap size={18} /> },
  { value: '50K+', label: 'Daily Users', icon: <Users size={18} /> },
];

export default function About() {
  return (
    <div className="app-bg min-h-screen relative">
      <StarField />
      <div className="relative z-10">
        <Navbar />

        <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="section-badge mx-auto mb-4">
              <Cloud size={12} /> About Us
            </div>
            {/* <h1 className="font-display text-4xl sm:text-5xl font-900 text-white mb-4 text-3d">
              Karachi <span className="text-animate-gradient">Weather</span>
            </h1> */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-6xl font-bold text-white mb-6 text-3d">
                Karachi Weather
              </h1>
              
            <p className="text-white text-lg max-w-2xl mx-auto leading-relaxed">
              A modern, futuristic weather platform delivering accurate, real-time
              weather intelligence for Karachi and the entire world — beautifully designed and lightning fast.
            </p>
          </div>
          <br />

          {/* Mission */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16 items-center">
            <div className="glass-card p-8 hover-lift">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400/20 to-indigo-500/20
                border border-sky-400/30 flex items-center justify-center mb-5 float-3d">
                <Target size={26} className="text-sky-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
              <p className="text-white leading-relaxed mb-4">
                We believe everyone deserves access to reliable, easy-to-understand weather
                information. Our mission is to make weather data beautiful, accessible and
                actionable — helping the people of Karachi plan their day with confidence.
              </p>
              <p className="text-white leading-relaxed">
                From extreme heatwaves to sudden monsoon rains, we keep you one step ahead
                of the weather with cutting-edge forecasting and a delightful user experience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {STATS.map((s, i) => (
                <div key={i} className="admin-stat-card text-center hover-lift"
                  style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-10 h-10 mx-auto rounded-xl bg-sky-400/15 flex items-center justify-center text-sky-400 mb-3">
                    {s.icon}
                  </div>
                  <div className="text-2xl font-black text-white text-3d">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <br/>

          {/* Features grid */}
          <div className="text-center mb-10">
            <div className="section-badge mx-auto mb-3">✨ What We Offer</div>
            <h2 className="text-3xl font-bold text-white">Powerful Features</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card p-6 hover-lift shine perspective"
                style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400/20 to-indigo-500/20
                  border border-sky-400/25 flex items-center justify-center text-sky-400 mb-4 float-3d">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <br/>

          {/* CTA */}
          <div className="glass-card p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-indigo-500/5" />
            <div className="relative">
              <Droplets size={40} className="text-sky-400 mx-auto mb-4 float-3d" />
              <h2 className="text-2xl font-bold text-white mb-3">Stay Weather-Ready</h2>
              <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                Join thousands of users who trust Karachi Weather for accurate, real-time forecasts.
              </p>
              <a href="/" className="inline-block glass-btn-primary px-8 py-3 btn-3d">
                Check Weather Now →
              </a>
            </div>
          </div>
        </div>
<br/>
        <Footer />
      </div>
    </div>
  );
}
