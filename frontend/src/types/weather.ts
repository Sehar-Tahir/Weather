// ============================================================
// WEATHERVERSE — Type Definitions
// ============================================================

export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  description: string;
  icon: string;
  condition: WeatherCondition;
  sunrise: number;
  sunset: number;
  timezone: number;
  uvIndex?: number;
  dewPoint?: number;
  cloudCover: number;
  aqi?: number;
  aqiLabel?: string;
}

export type WeatherCondition =
  | 'sunny'
  | 'cloudy'
  | 'rainy'
  | 'snowy'
  | 'stormy'
  | 'foggy'
  | 'windy'
  | 'partly-cloudy'
  | 'clear-night';

export interface ForecastDay {
  date: string;
  dayName: string;
  high: number;
  low: number;
  description: string;
  icon: string;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface HourlyForecast {
  time: string;
  hour: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  condition: WeatherCondition;
  precipitation: number;
}

export interface GraphDataPoint {
  label: string;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  precipitation?: number;
  high?: number;
  low?: number;
}

export type TempUnit = 'C' | 'F';
export type GraphType = 'temperature' | 'humidity' | 'wind' | 'precipitation';
export type TimeRange = 'hourly' | '7days' | '14days';
export type SearchMode = 'city' | 'zip' | 'location';
