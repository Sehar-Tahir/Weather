// ============================================================
// WEATHERVERSE — Weather Service
// ============================================================

const axios = require('axios');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';
const API_KEY = process.env.OWM_API_KEY;

if (!API_KEY) {
  logger.warn('⚠ OWM_API_KEY not set in .env — weather API calls will fail.');
}

// ── Axios instances ────────────────────────────────────────
const owm = axios.create({
  baseURL: OWM_BASE,
  timeout: 10000,
  params: {
    appid: API_KEY,
    units: 'metric',
  },
});

const geo = axios.create({
  baseURL: GEO_BASE,
  timeout: 8000,
  params: {
    appid: API_KEY,
  },
});

// ── Error interceptor ──────────────────────────────────────
owm.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 404) {
      return Promise.reject(new AppError('City or location not found', 404));
    }
    if (err.response?.status === 401) {
      return Promise.reject(new AppError('Invalid OpenWeatherMap API key', 401));
    }
    if (err.response?.status === 429) {
      return Promise.reject(new AppError('Too many requests. Please try again later.', 429));
    }
    return Promise.reject(err);
  }
);

// ── Fetch current weather ──────────────────────────────────
const fetchCurrentWeather = async (params) => {
  try {
    const res = await owm.get('/weather', { params });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ── Fetch forecast ─────────────────────────────────────────
const fetchForecast = async (city, cnt = 40) => {
  try {
    const res = await owm.get('/forecast', {
      params: { q: city, cnt },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ── Fetch air quality ─────────────────────────────────────
const fetchAirQuality = async (lat, lon) => {
  try {
    const res = await owm.get('/air_pollution', {
      params: { lat, lon },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ── Reverse geocode ────────────────────────────────────────
const reverseGeocode = async (lat, lon) => {
  try {
    const res = await geo.get('/reverse', {
      params: { lat, lon, limit: 1 },
    });
    return res.data;
  } catch (error) {
    logger.error(`Reverse geocode failed: ${error.message}`);
    return null;
  }
};

// ── Get city by name ───────────────────────────────────────
const getCityByName = async (name) => {
  try {
    const res = await geo.get('/direct', {
      params: { q: name, limit: 1 },
    });
    return res.data;
  } catch (error) {
    logger.error(`City lookup failed: ${error.message}`);
    return null;
  }
};

module.exports = {
  fetchCurrentWeather,
  fetchForecast,
  fetchAirQuality,
  reverseGeocode,
  getCityByName,
};