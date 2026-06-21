// src/components/Navbar.tsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin, ChevronDown, Calendar, Clock, BarChart3,
  History, TrendingUp, Menu, X
} from 'lucide-react';

interface NavbarProps {
  cityName?: string;
  onDropdownSelect?: (option: string) => void;
}

// import Logo from '../assets/logo2.png';   // Adjust path if needed
// import Logo1 from '../assets/logoicon1.jpeg';   // Adjust path if needed
import Logo from '../assets/logoiconn.png';   // Adjust path if needed

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Blog', path: '/blog' },
  { label: 'Stories', path: '/stories' },
  { label: 'Contact', path: '/contact' },     // ← Added
];

const DROPDOWN_ITEMS = [
  { icon: <Clock size={15} />, label: 'Past 10 Days', value: 'past10' },
  { icon: <Calendar size={15} />, label: '1 Week', value: '1week' },
  { icon: <BarChart3 size={15} />, label: '6 Months', value: '6months' },
  { icon: <TrendingUp size={15} />, label: 'Future Forecast', value: 'forecast' },
  { icon: <History size={15} />, label: 'Historical Data', value: 'history' },
];

export default function Navbar({ cityName = 'Karachi', onDropdownSelect }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDropdown = (value: string) => {
    setDropdownOpen(false);
    if (onDropdownSelect) {
      onDropdownSelect(value);
    } else {
      navigate('/', { state: { analytics: value } });
    }
  };

  return (
    <nav className="bg-[#2E6FCB] backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 navbar">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-32 h-20">
                <img src={Logo} alt="Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
              </div>
              
              {/* <div className="hidden sm:block">
                <span className="font-display text-lg font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-white">
                  Karachi Weather
                </span>
              </div> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="px-6 py-2.5 text-sm font-medium text-white hover:text-slate-300 hover:bg-white/10 rounded-2xl transition-all"
              >
                {link.label}
              </Link>
            ))}

            {/* Analytics Dropdown */}
            <div className="relative ml-4" ref={dropRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white hover:text-slate-300 hover:bg-white/10 rounded-2xl transition-all"
              >
                <BarChart3 size={18} />
                Analytics
                <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl py-2 z-50">
                  {DROPDOWN_ITEMS.map((item) => (
                    <div
                      key={item.value}
                      className="px-5 py-3 hover:bg-white/10 flex items-center gap-3 cursor-pointer text-sm text-slate-300 hover:text-white"
                      onClick={() => handleDropdown(item.value)}
                    >
                      {item.icon} {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-3" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-6 border-t border-white/10 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="px-5 py-3 text-base hover:bg-white/5 rounded-2xl"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}