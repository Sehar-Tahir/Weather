// ============================================================
// WEATHERVERSE — Weather Service Layer
// Communicates with OpenWeatherMap API
// ============================================================

const axios = require('axios');

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';
const API_KEY  = process.env.OWM_API_KEY;

if (!API_KEY) {
  console.warn('⚠  OWM_API_KEY not set in .env — weather API calls will fail.');
}

// ── Axios instance with defaults ───────────────────────────
const owm = axios.create({
  baseURL: OWM_BASE,
  timeout: 8000,
  params: {
    appid: API_KEY,
    units: 'metric', // Celsius
  },
});

// ── Intercept 404 / 401 for better error messages ─────────
owm.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 404) {
      const error = new Error('City or location not found');
      error.status = 404;
      return Promise.reject(error);
    }
    if (err.response?.status === 401) {
      const error = new Error('Invalid OpenWeatherMap API key');
      error.status = 401;
      return Promise.reject(error);
    }
    return Promise.reject(err);
  }
);

/**
 * Fetch current weather.
 * @param {Object} params - { q, lat, lon, zip }
 */
const fetchCurrentWeather = async (params) => {
  const res = await owm.get('/weather', { params });
  return res.data;
};

/**
 * Fetch 5-day / 3-hour forecast.
 * @param {string} city
 * @param {number} cnt - number of 3-hour steps (max 40)
 */
const fetchForecast = async (city, cnt = 40) => {
  const res = await owm.get('/forecast', {
    params: { q: city, cnt },
  });
  return res.data;
};

/**
 * Fetch Air Quality Index.
 * @param {number} lat
 * @param {number} lon
 */
const fetchAirQuality = async (lat, lon) => {
  const res = await owm.get('/air_pollution', {
    params: { lat, lon },
  });
  return res.data;
};

/**
 * Fetch one-call API (UV index, hourly, daily — requires paid plan or specific version).
 * Using basic free endpoints as fallback.
 * @param {number} lat
 * @param {number} lon
 */
const fetchOneCall = async (lat, lon) => {
  try {
    const res = await owm.get('/onecall', {
      params: { lat, lon, exclude: 'minutely,alerts' },
    });
    return res.data;
  } catch {
    // Fallback for free tier
    return null;
  }
};

module.exports = {
  fetchCurrentWeather,
  fetchForecast,
  fetchAirQuality,
  fetchOneCall,
};





