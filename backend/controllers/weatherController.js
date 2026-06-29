// ============================================================
// WEATHERVERSE — Weather Controller
// ============================================================

const weatherService = require('../services/weatherService');
const SearchHistory = require('../models/SearchHistory');
const AppError = require('../utils/AppError');

// ── Get weather by city ────────────────────────────────────
const getWeatherByCity = async (req, res, next) => {
  try {
    const { city } = req.query;
    if (!city || !city.trim()) {
      return next(new AppError('City name is required', 400));
    }

    const data = await weatherService.fetchCurrentWeather({ q: city.trim() });

    // Save to history (non-blocking)
    try {
      await SearchHistory.create({
        query: city.trim(),
        type: 'city',
        city: data.name,
        country: data.sys?.country,
        lat: data.coord?.lat,
        lon: data.coord?.lon,
      });
    } catch (err) {
      // Ignore history save errors
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ── Get weather by ZIP ─────────────────────────────────────
const getWeatherByZip = async (req, res, next) => {
  try {
    const { code, country = 'us' } = req.query;
    if (!code) {
      return next(new AppError('ZIP code is required', 400));
    }

    const data = await weatherService.fetchCurrentWeather({
      zip: `${code},${country}`,
    });

    try {
      await SearchHistory.create({
        query: code,
        type: 'zip',
        city: data.name,
        country: data.sys?.country,
      });
    } catch (err) {
      // Ignore history save errors
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ── Get weather by location (GPS) ─────────────────────────
const getWeatherByLocation = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return next(new AppError('Latitude and longitude are required', 400));
    }

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
      return next(new AppError('Invalid coordinates', 400));
    }

    const data = await weatherService.fetchCurrentWeather({ lat: latNum, lon: lonNum });

    // Reverse geocode to get city name if not available
    if (!data.name) {
      try {
        const geoData = await weatherService.reverseGeocode(latNum, lonNum);
        if (geoData && geoData.length > 0) {
          data.name = geoData[0].name;
          data.sys = { country: geoData[0].country || data.sys?.country };
        }
      } catch (err) {
        // Ignore reverse geocode errors
      }
    }

    try {
      await SearchHistory.create({
        query: `${latNum},${lonNum}`,
        type: 'location',
        city: data.name || 'Unknown',
        country: data.sys?.country || '',
        lat: latNum,
        lon: lonNum,
      });
    } catch (err) {
      // Ignore history save errors
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ── Get forecast ──────────────────────────────────────────
const getForecast = async (req, res, next) => {
  try {
    const { city, cnt = 40 } = req.query;
    if (!city) {
      return next(new AppError('City name is required', 400));
    }

    const data = await weatherService.fetchForecast(city.trim(), parseInt(cnt));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ── Get air quality ────────────────────────────────────────
const getAirQuality = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return next(new AppError('Latitude and longitude are required', 400));
    }

    const data = await weatherService.fetchAirQuality(parseFloat(lat), parseFloat(lon));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ── Get search history ─────────────────────────────────────
const getHistory = async (req, res, next) => {
  try {
    const { city, limit = 10 } = req.query;
    const filter = city ? { city: new RegExp(city, 'i') } : {};

    const history = await SearchHistory
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
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