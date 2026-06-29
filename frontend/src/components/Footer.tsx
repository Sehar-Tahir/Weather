// ============================================================
// KARACHI WEATHER APP — Footer
// ============================================================

import { Link } from 'react-router-dom';
import { Send, Globe, Mail, MapPin } from 'lucide-react';
import logo from '../assets/logoiconn.png';  // ← Import image

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-10 relative z-10 footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand with Logo Image */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {/* Logo Image from imported asset */}
              <img 
                src={logo}  // ← Use imported variable
                alt="Karachi Weather Logo" 
                className="w-28 h-28 object-contain rounded-lg"
              />
              {/* <span className="font-display text-sm font-bold text-animate-gradient">
                Karachi Weather
              </span> */}
            </div>
            <p className="text-xs text-white leading-relaxed">
              Real-time weather intelligence for Karachi & the world.
              Live temperature, forecasts, air quality and more.
            </p>
          </div>

          {/* Rest of the code remains same */}
          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Explore</h4>
            <ul className="space-y-2">
              {[['Home', '/'], ['About', '/about'], ['Blog', '/blog'], ['Stories', '/stories']].map(([l, p]) => (
                <li key={l}>
                  <Link to={p} className="text-xs text-white hover:text-sky-400 transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Features</h4>
            <ul className="space-y-2 text-xs text-white">
              <li>🌡 Live Temperature</li>
              <li>📊 Weather Graphs</li>
              <li>📍 GPS & ZIP Search</li>
              <li>💨 Air Quality Index</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Connect</h4>
            <div className="flex gap-2 mb-3">
              {[<Send size={15} />, <Globe size={15} />, <Mail size={15} />].map((icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                    bg-white/5 border border-white/10 text-white
                    hover:text-sky-400 hover:border-sky-400/30 transition-all">
                  {icon}
                </a>
              ))}
            </div>
            
            <p className="flex items-center gap-1 text-xs text-white">
              <MapPin size={11} /> Karachi, Pakistan
            </p>
          </div>
        </div>

        <div className="divider my-6" />
          <p className="text-xs text-white text-center mt-5 footText">
            ©{new Date().getFullYear()} Karachi Weather App. All rights reserved.
          </p>
      </div>
    </footer>
  );
}