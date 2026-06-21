// ============================================================
// WEATHERVERSE — Weather Controller (MVC Pattern)
// Handles HTTP requests and delegates to service layer
// ============================================================

const weatherService = require('../services/weatherService');
const SearchHistory  = require('../models/SearchHistory');

// ── GET /api/weather?city=London ──────────────────────────
const getWeatherByCity = async (req, res, next) => {
  try {
    const { city } = req.query;
    if (!city || !city.trim()) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const data = await weatherService.fetchCurrentWeather({ q: city.trim() });

    // Save to history (non-blocking)
    SearchHistory.create({
      query: city.trim(),
      type: 'city',
      city: data.name,
      country: data.sys?.country,
    }).catch(() => {});

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/weather/zip?code=75201 ───────────────────────
const getWeatherByZip = async (req, res, next) => {
  try {
    const { code, country = 'us' } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'ZIP code is required' });
    }

    const data = await weatherService.fetchCurrentWeather({
      zip: `${code},${country}`,
    });

    SearchHistory.create({
      query: code,
      type: 'zip',
      city: data.name,
      country: data.sys?.country,
    }).catch(() => {});

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/weather/location?lat=&lon= ───────────────────
const getWeatherByLocation = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }
    if (isNaN(+lat) || isNaN(+lon)) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    const data = await weatherService.fetchCurrentWeather({ lat, lon });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/weather/forecast?city=London ─────────────────
const getForecast = async (req, res, next) => {
  try {
    const { city, cnt = 40 } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const data = await weatherService.fetchForecast(city.trim(), +cnt);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/weather/air?lat=&lon= ────────────────────────
const getAirQuality = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }

    const data = await weatherService.fetchAirQuality(+lat, +lon);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/weather/history?city= ────────────────────────
const getHistory = async (req, res, next) => {
  try {
    const { city, limit = 10 } = req.query;
    const filter = city ? { city: new RegExp(city, 'i') } : {};
    const history = await SearchHistory
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(+limit)
      .select('-__v');

    res.json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWeatherByCity,
  getWeatherByZip,
  getWeatherByLocation,
  getForecast,
  getAirQuality,
  getHistory,
};
