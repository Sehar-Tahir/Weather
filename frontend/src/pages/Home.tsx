// ============================================================
// WEATHERVERSE — Home Page
// Main dashboard layout with all weather components
// ============================================================

import { useState, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
import WeatherGraph from "../components/WeatherGraph";
import GlobalCities from "../components/GlobalCities";
import HourlyForecastRow from "../components/HourlyForecastRow";
import ApiNotice from "../components/ApiNotice";
import WeatherTicker from "../components/WeatherTicker";
import RecentSearches from "../components/RecentSearches";
import Footer from "../components/Footer";
import HomeContentPreview from "../components/HomeContentPreview";
import RevealOnScroll from "../components/RevealOnScroll";
import { useApp } from "../context/AppContext";
import { useLocation } from "react-router-dom";
import {
  WeatherCardSkeleton,
  ForecastSkeleton,
  GraphSkeleton,
} from "../components/LoadingSkeleton";
import StarField from "../components/StarField";
import WeatherTheme from "../components/WeatherTheme";
import {
  getWeatherByCity,
  getWeatherByCoords,
  getWeatherByZip,
  getForecast,
  buildGraphData,
  USE_MOCK,
} from "../services/weatherService";
import type {
  WeatherData,
  ForecastDay,
  HourlyForecast,
  GraphDataPoint,
  SearchMode,
  TempUnit,
  TimeRange,
} from "../types/weather";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Home() {
  const { addRecent } = useApp();
  const location = useLocation();

  // ── State ──────────────────────────────────────────────
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourly, setHourly] = useState<HourlyForecast[]>([]);
  const [graphData, setGraphData] = useState<GraphDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("hourly");
  const [unit, setUnit] = useState<TempUnit>("C");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState("Karachi");
  const [geolocationLoaded, setGeolocationLoaded] = useState(false);

  // ── Load weather data ───────────────────────────────────
  const loadWeather = useCallback(
    async (query: string, mode: SearchMode = "city") => {
      setLoading(true);
      setError(null);

      try {
        let data: WeatherData;

        if (mode === "location") {
          const [lat, lon] = query.split(",").map(Number);
          data = await getWeatherByCoords(lat, lon);
        } else if (mode === "zip") {
          data = await getWeatherByZip(query);
        } else {
          data = await getWeatherByCity(query);
        }

        // Fetch forecast
        const { daily, hourly: hourlyData } = await getForecast(
          data.city,
          data.temperature,
        );

        setWeather(data);
        setForecast(daily);
        setHourly(hourlyData);
        setCurrentCity(data.city);

        // Save to recent searches
        addRecent({
          query,
          city: data.city,
          temp: data.temperature,
          condition: data.condition,
          timestamp: Date.now(),
        });

        // Build initial graph data
        const gData = buildGraphData(hourlyData, daily, timeRange);
        setGraphData(gData);
      } catch (err: any) {
        const msg =
          err?.response?.status === 404
            ? `City "${query}" not found. Please check the spelling.`
            : err?.response?.status === 401
              ? "Invalid API key. Please check your VITE_OPENWEATHER_API_KEY."
              : `Failed to fetch weather data. ${err.message || ""}`;
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [timeRange, addRecent],
  );

  // ── Handle time range change ────────────────────────────
  const handleRangeChange = useCallback(
    (range: TimeRange) => {
      setTimeRange(range);
      if (hourly.length && forecast.length) {
        setGraphData(buildGraphData(hourly, forecast, range));
      }
    },
    [hourly, forecast],
  );

  // ── Handle dropdown analytics select ───────────────────
  const handleDropdownSelect = useCallback(
    (option: string) => {
      const rangeMap: Record<string, TimeRange> = {
        past10: "14days",
        "1week": "7days",
        "6months": "14days",
        forecast: "7days",
        history: "14days",
      };
      const mapped = rangeMap[option];
      if (mapped) {
        handleRangeChange(mapped);
        // Scroll to graph section
        document
          .getElementById("graph-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [handleRangeChange],
  );

  // ── Initial load with Geolocation ──────────────────────
  useEffect(() => {
    // Try geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            setGeolocationLoaded(true);
            await loadWeather(`${latitude},${longitude}`, "location");
          } catch (e) {
            // If geolocation weather fails, fallback to Karachi
            console.log(
              "Geolocation weather fetch failed, falling back to Karachi",
            );
            loadWeather("Karachi", "city");
          }
        },
        () => {
          // Permission denied or error - fallback to Karachi
          console.log("Geolocation permission denied, falling back to Karachi");
          loadWeather("Karachi", "city");
        },
      );
    } else {
      // Geolocation not supported - fallback to Karachi
      console.log("Geolocation not supported, falling back to Karachi");
      loadWeather("Karachi", "city");
    }
  }, []); // Empty dependency array - runs once on mount

  // ── Handle analytics intent from navbar (other pages) ──
  useEffect(() => {
    const intent = (location.state as any)?.analytics;
    if (intent) {
      setTimeout(() => handleDropdownSelect(intent), 400);
    }
  }, [location.state, handleDropdownSelect]);

  // ── Re-build graph when range changes ──────────────────
  useEffect(() => {
    if (hourly.length && forecast.length) {
      setGraphData(buildGraphData(hourly, forecast, timeRange));
    }
  }, [timeRange, hourly, forecast]);

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="app-bg min-h-screen relative">
      {/* Smart dynamic weather background */}
      {/* {weather && (
        <WeatherTheme temperature={weather.temperature} condition={weather.condition} />
      )} */}
      {/* <StarField /> */}

      {/* Content above stars */}
      <div className="relative z-10">
        {/* Ticker */}
        <WeatherTicker />

        {/* Navbar */}
        <Navbar
          cityName={currentCity}
          onDropdownSelect={handleDropdownSelect}
        />

        {/* API Demo Notice */}
        {USE_MOCK && <ApiNotice />}

        {/* ── Hero Section (UPDATED) ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          {/* Unified Centered Container */}
          <div className="max-w-[680px] mx-auto">
            <div className="text-center mb-10">
              {/*<h1 className="font-display text-5xl sm:text-6xl lg:text-6xl font-bold text-white mb-4 text-3d topHeading">
                <span className="text-animate-gradient">KarachiWeather</span>
              </h1> */}

              <h1 className="font-display text-5xl sm:text-6xl lg:text-6xl font-bold text-white mb-4 text-3d topHeading">
                KarachiWeather
              </h1>

              <div className="section-badge mx-auto mb-4">
                🌍 Real-Time Weather Intelligence · Live Now
              </div>

              <p className=" text-lg leading-relaxed max-w-md mx-auto text-white">
                Real-time temperature, forecasts, interactive graphs and global
                insights.
              </p>
            </div>

            {/* SearchBar will now inherit the same width */}
            <SearchBar onSearch={loadWeather} isLoading={loading} />

            {/* Recent Searches */}
            <div className="mt-10 recentSearch">
              <RecentSearches onSelect={(city) => loadWeather(city, "city")} />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-card max-w-2xl mx-auto mt-8 flex flex-col items-center gap-3 animate-scale-in">
              <AlertTriangle size={32} className="text-red-400" />
              <p className="font-semibold">{error}</p>
              <button
                onClick={() => loadWeather(currentCity)}
                className="glass-btn flex items-center gap-2 px-4 py-2 text-sm"
              >
                <RefreshCw size={14} /> Try Again
              </button>
            </div>
          )}
        </section>

        {/* ── Main Dashboard Grid ── */}
        {!error && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left / Full-width top: Weather Card */}
              <div className="xl:col-span-2 space-y-6">
                {loading ? (
                  <WeatherCardSkeleton />
                ) : (
                  weather && (
                    <WeatherCard
                      data={weather}
                      onRefresh={() => loadWeather(currentCity)}
                    />
                  )
                )}

                {/* Hourly Forecast */}
                {loading ? (
                  <div className="glass-card p-5 h-40 skeleton" />
                ) : (
                  hourly.length > 0 && (
                    <HourlyForecastRow hourly={hourly} unit={unit} />
                  )
                )}

                {/* 7-Day Forecast */}
                {loading ? (
                  <ForecastSkeleton />
                ) : (
                  forecast.length > 0 && (
                    <ForecastCard forecast={forecast} unit={unit} />
                  )
                )}
              </div>

              {/* Right sidebar: Extra Info Panel */}
              {weather && !loading && (
                <div className="space-y-4">
                  {/* Wind Compass Card */}
                  <WindCompassCard
                    speed={weather.windSpeed}
                    direction={weather.windDirection}
                    unit={unit}
                  />

                  {/* Sun Card */}
                  <SunPositionCard
                    sunrise={weather.sunrise}
                    sunset={weather.sunset}
                    timezone={weather.timezone}
                  />

                  {/* Quick Stats Card */}
                  <QuickStatsCard weather={weather} />

                  {/* Unit Toggle */}
                  <div className="glass-card p-4 flex items-center justify-between">
                    <span className="text-sm text-white font-medium">
                      Temperature Unit
                    </span>
                    <div className="temp-unit-toggle">
                      <button
                        className={`unit-btn ${unit === "C" ? "active" : ""}`}
                        onClick={() => setUnit("C")}
                      >
                        °C
                      </button>
                      <button
                        className={`unit-btn ${unit === "F" ? "active" : ""}`}
                        onClick={() => setUnit("F")}
                      >
                        °F
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Graph Section ── */}
        {!error && (
          <section
            id="graph-section"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 graphSection"
          >
            {loading ? (
              <GraphSkeleton />
            ) : (
              graphData.length > 0 && (
                <WeatherGraph
                  data={graphData}
                  onRangeChange={handleRangeChange}
                  currentRange={timeRange}
                />
              )
            )}
          </section>
        )}

        {/* ── Global Cities Section ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 ">
          <RevealOnScroll variant="up">
            {/* <GlobalCities onCitySelect={(city) => loadWeather(city, "city")} /> */}
            <GlobalCities
              onCitySelect={(city) => {
                loadWeather(city, "city");
                window.scrollTo({
                  top: 500, //scroll to dashboard section
                  behavior: "smooth",
                });
              }}
            />
          </RevealOnScroll>
        </section>

        {/* ── Stories & Blogs Preview ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RevealOnScroll variant="up">
            <HomeContentPreview />
          </RevealOnScroll>
        </section>

        {/* ── Footer ── */}
        <Footer />
      </div>
    </div>
  );
}

// ============================================================
// INLINE MINI COMPONENTS (sidebar)
// ============================================================

function WindCompassCard({
  speed,
  direction,
}: {
  speed: number;
  direction: number;
  unit: TempUnit;
}) {
  const rad = (direction * Math.PI) / 180;
  const arrowX = 50 + 32 * Math.sin(rad);
  const arrowY = 50 - 32 * Math.cos(rad);

  return (
    <div className="glass-card p-5 animate-fade-in-up delay-200">
      <div className="section-badge mb-3">🧭 Wind Compass</div>
      <div className="flex items-center gap-4">
        {/* Compass SVG */}
        <svg width="90" height="90" viewBox="0 0 100 100" className="shrink-0">
          {/* Outer ring */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1.5"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(56,189,248,0.15)"
            strokeWidth="1"
          />
          {/* Cardinal directions */}
          {[
            { l: "N", x: 50, y: 12 },
            { l: "S", x: 50, y: 92 },
            { l: "E", x: 88, y: 52 },
            { l: "W", x: 12, y: 52 },
          ].map(({ l, x, y }) => (
            <text
              key={l}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={l === "N" ? "#f87171" : "#475569"}
              fontSize="10"
              fontWeight="700"
            >
              {l}
            </text>
          ))}
          {/* Arrow */}
          <line
            x1="50"
            y1="50"
            x2={arrowX}
            y2={arrowY}
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="4" fill="#38bdf8" />
          <circle cx={arrowX} cy={arrowY} r="3" fill="#38bdf8" />
        </svg>
        <div>
          <p className="text-2xl font-black text-white">{speed}</p>
          <p className="text-xs text-white">km/h</p>
          <p className="text-white text-sm font-semibold mt-1">{direction}°</p>
        </div>
      </div>
    </div>
  );
}

function SunPositionCard({
  sunrise,
  sunset,
  timezone,
}: {
  sunrise: number;
  sunset: number;
  timezone: number;
}) {
  function fmt(ts: number) {
    const d = new Date((ts + timezone) * 1000);
    return d.toUTCString().slice(17, 22);
  }

  // Current sun position percentage
  const now = Date.now() / 1000;
  const pct = Math.max(
    0,
    Math.min(100, ((now - sunrise) / (sunset - sunrise)) * 100),
  );

  return (
    <div className="glass-card p-5 animate-fade-in-up delay-300">
      <div className="section-badge mb-3">☀️ Sun Position</div>

      {/* Arc */}
      <div className="relative h-16 mb-3">
        <svg viewBox="0 0 200 80" width="100%" height="100%">
          {/* Arc path */}
          <path
            d="M 10 70 Q 100 10 190 70"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
          />
          <path
            d="M 10 70 Q 100 10 190 70"
            fill="none"
            stroke="rgba(251,191,36,0.3)"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
          {/* Sun dot along arc */}
          {(() => {
            const t = pct / 100;
            const x =
              (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 100 + t * t * 190;
            const y =
              (1 - t) * (1 - t) * 70 + 2 * (1 - t) * t * 10 + t * t * 70;
            return (
              <>
                <circle cx={x} cy={y} r="7" fill="#FBBF24" opacity="0.9" />
                <circle cx={x} cy={y} r="4" fill="#FDE68A" />
              </>
            );
          })()}
          {/* Horizon line */}
          <line
            x1="10"
            y1="70"
            x2="190"
            y2="70"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="flex justify-between text-sm">
        <div className="text-center">
          <span className="text-[10px] text-white block uppercase">
            Sunrise
          </span>
          <span className="text-white font-bold">{fmt(sunrise)}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-white block uppercase">Sunset</span>
          <span className="text-white font-bold">{fmt(sunset)}</span>
        </div>
      </div>
    </div>
  );
}

function QuickStatsCard({ weather }: { weather: WeatherData }) {
  const stats = [
    { label: "Pressure", value: `${weather.pressure} hPa`, color: "#34d399" },
    {
      label: "Visibility",
      value: `${weather.visibility} km`,
      color: "#38bdf8",
    },
    { label: "Cloud Cover", value: `${weather.cloudCover}%`, color: "#a78bfa" },
    { label: "Feels Like", value: `${weather.feelsLike}°C`, color: "#fb923c" },
  ];

  return (
    <div className="glass-card p-5 animate-fade-in-up delay-400">
      <div className="section-badge mb-3">📈 Quick Stats</div>
      <div className="space-y-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <span className="text-xs text-white">{s.label}</span>
            <div className="flex items-center gap-2">
              {/* Mini bar */}
              <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: "60%",
                    background: s.color,
                    opacity: 0.7,
                  }}
                />
              </div>
              <span className="text-sm font-bold text-white w-16 text-right">
                {s.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
