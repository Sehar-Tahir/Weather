// ============================================================
// WEATHERVERSE — Weather Routes
// ============================================================

const express = require('express');
const router  = express.Router();
const {
  getWeatherByCity,
  getWeatherByZip,
  getWeatherByLocation,
  getForecast,
  getAirQuality,
  getHistory,
} = require('../controllers/weatherController');

/**
 * GET /api/weather?city=London
 * Get current weather by city name
 */
router.get('/', getWeatherByCity);

/**
 * GET /api/weather/zip?code=75201&country=us
 * Get current weather by ZIP/postal code
 */
router.get('/zip', getWeatherByZip);

/**
 * GET /api/weather/location?lat=24.86&lon=67.01
 * Get current weather by GPS coordinates
 */
router.get('/location', getWeatherByLocation);

/**
 * GET /api/weather/forecast?city=London
 * Get 7-day forecast for a city
 */
router.get('/forecast', getForecast);

/**
 * GET /api/weather/air?lat=24.86&lon=67.01
 * Get Air Quality Index for coordinates
 */
router.get('/air', getAirQuality);

/**
 * GET /api/weather/history?city=Karachi
 * Get search history from MongoDB (optional)
 */
router.get('/history', getHistory);

module.exports = router;
