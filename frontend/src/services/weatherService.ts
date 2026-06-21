// ============================================================
// WEATHERVERSE — Weather Service Layer (Production Ready)
// ============================================================

import axios from 'axios';
import type { WeatherData, ForecastDay, HourlyForecast, GraphDataPoint, WeatherCondition, TimeRange } from '../types/weather';

// const API_BASE_URL = 'http://localhost:5000/api';
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

// Create axios instance for weather (public routes - no auth)
const weatherApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// ==================== HELPER FUNCTIONS ====================

function mapWeatherCondition(icon: string): WeatherCondition {
  const mapping: Record<string, WeatherCondition> = {
    '01d': 'sunny', '01n': 'clear-night',
    '02d': 'partly-cloudy', '02n': 'partly-cloudy',
    '03d': 'cloudy', '03n': 'cloudy',
    '04d': 'cloudy', '04n': 'cloudy',
    '09d': 'rainy', '09n': 'rainy',
    '10d': 'rainy', '10n': 'rainy',
    '11d': 'stormy', '11n': 'stormy',
    '13d': 'snowy', '13n': 'snowy',
    '50d': 'foggy', '50n': 'foggy',
  };
  return mapping[icon] || 'partly-cloudy';
}

export const buildGraphData = (
  hourly: HourlyForecast[],
  daily: ForecastDay[],
  range: TimeRange
): GraphDataPoint[] => {
  if (range === 'hourly') {
    return hourly.slice(0, 12).map(h => ({
      label: h.time,
      temperature: h.temperature,
      humidity: h.humidity || 50,
      windSpeed: h.windSpeed || 10,
      precipitation: h.precipitation || 0,
    }));
  }
  
  // 7 days or extended
  const daysToShow = range === '7days' ? 7 : 14;
  return daily.slice(0, daysToShow).map((d, i) => ({
    label: d.dayName || `Day ${i+1}`,
    temperature: d.high,
    low: d.low,
    high: d.high,
    humidity: d.humidity || 50,
    windSpeed: d.windSpeed || 10,
    precipitation: 0,
  }));
};

// ==================== PUBLIC WEATHER API CALLS ====================

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const response = await weatherApi.get('/weather', { params: { city } });
    const data = response.data.data || response.data;
    return transformWeatherData(data);
  } catch (error) {
    console.error('City weather error:', error);
    throw error;
  }
};

export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await weatherApi.get('/weather/location', { 
      params: { lat, lon } 
    });
    const data = response.data.data || response.data;
    return transformWeatherData(data);
  } catch (error: any) {
    console.error('Geolocation weather error:', error.response?.data || error.message);
    throw error;
  }
};

export const getWeatherByZip = async (zip: string): Promise<WeatherData> => {
  try {
    const response = await weatherApi.get('/weather/zip', { params: { code: zip } });
    const data = response.data.data || response.data;
    return transformWeatherData(data);
  } catch (error) {
    console.error('ZIP weather error:', error);
    throw error;
  }
};

export const getForecast = async (city: string): Promise<{ daily: ForecastDay[]; hourly: HourlyForecast[] }> => {
  try {
    const response = await weatherApi.get('/weather/forecast', { params: { city } });
    const data = response.data.data || response.data;
    
    // Process forecast data (same logic as before)
    const hourlyData: HourlyForecast[] = [];
    const dailyMap = new Map();

    data.list?.forEach((item: any, index: number) => {
      const date = new Date(item.dt * 1000);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      if (index < 8) {
        hourlyData.push({
          time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temperature: Math.round(item.main.temp),
          condition: mapWeatherCondition(item.weather[0]?.icon || ''),
          precipitation: Math.round((item.pop || 0) * 100),
        });
      }

      if (!dailyMap.has(dayName)) {
        dailyMap.set(dayName, {
          temps: [],
          condition: item.weather[0]?.icon || '',
          humidity: item.main.humidity,
          windSpeed: item.wind?.speed || 0,
        });
      }

      const dailyEntry = dailyMap.get(dayName);
      dailyEntry.temps.push(item.main.temp);
      if (item.weather[0]?.icon) dailyEntry.condition = item.weather[0].icon;
    });

    const daily: ForecastDay[] = Array.from(dailyMap.entries()).map(([dayName, d]: any) => ({
      dayName,
      high: Math.round(Math.max(...d.temps)),
      low: Math.round(Math.min(...d.temps)),
      condition: mapWeatherCondition(d.condition),
      humidity: d.humidity,
      windSpeed: Math.round(d.windSpeed * 3.6),
    }));

    return { daily, hourly: hourlyData };
  } catch (error) {
    console.error('Forecast error:', error);
    throw error;
  }
};

// Helper to transform raw OpenWeather data
const transformWeatherData = (data: any): WeatherData => ({
  city: data.name,
  country: data.sys?.country || '',
  temperature: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  humidity: data.main.humidity,
  windSpeed: Math.round((data.wind?.speed || 0) * 3.6),
  windDirection: data.wind?.deg || 0,
  pressure: data.main.pressure,
  visibility: (data.visibility || 10000) / 1000,
  cloudCover: data.clouds?.all || 0,
  condition: mapWeatherCondition(data.weather[0]?.icon || ''),
  description: data.weather[0]?.description || '',
  sunrise: data.sys.sunrise,
  sunset: data.sys.sunset,
  timezone: data.timezone,
});

export const USE_MOCK = false;