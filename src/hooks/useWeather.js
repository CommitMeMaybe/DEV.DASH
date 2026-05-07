import { useState, useEffect, useCallback } from "react";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const requestCache = new Map();
const CACHE_TTL_MS = 600_000; // 10 minutes for weather

async function fetchCached(key, url) {
  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather request failed.");
  const data = await res.json();
  requestCache.set(key, { data, timestamp: Date.now() });
  return data;
}

export default function useWeather() {
  const [city, setCity] = useState(
    localStorage.getItem("weather_city") || "London",
  );
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (cityName) => {
    if (!API_KEY) {
      setError("Weather service not configured.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const weatherUrl = `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
      const wData = await fetchCached(`owm_weather_${cityName}`, weatherUrl);
      setWeather(wData);
      localStorage.setItem("weather_city", cityName);
      setCity(cityName);

      const { lat, lon } = wData.coord;

      try {
        const fUrl = `${BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
        const fData = await fetchCached(`owm_forecast_${cityName}`, fUrl);
        setForecast(fData);
      } catch {
        setForecast(null);
      }

      try {
        const aqUrl = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const aqData = await fetchCached(`owm_aq_${lat}_${lon}`, aqUrl);
        setAirQuality(aqData.list[0]);
      } catch {
        setAirQuality(null);
      }

      try {
        const uvUrl = `${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const uvData = await fetchCached(`owm_uvi_${lat}_${lon}`, uvUrl);
        setUvIndex(uvData);
      } catch {
        setUvIndex(null);
      }

    } catch {
      setError("Failed to load weather data.");
      setWeather(null);
      setForecast(null);
      setAirQuality(null);
      setUvIndex(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(city);
  }, [fetchWeather]);

  const getMessage = (data) => {
    if (!data) return "";
    const temp = data.main.temp;
    const cond = data.weather[0].main.toLowerCase();
    const messages = {
      clear:
        temp > 25
          ? "It's warm outside! Perfect weather for a break between commits."
          : temp < 10
            ? "Quite chilly! Great coding weather."
            : "Pleasant weather today.",
      rain: "Rainy day - perfect for indoor coding sprints!",
      clouds: "Overcast skies. Good focus weather for deep work.",
      snow: "Snow day! Hot beverage + coding = perfect combo.",
    };
    return messages[cond] || messages.clouds || "Weather data loaded.";
  };

  return {
    weather,
    forecast,
    airQuality,
    uvIndex,
    loading,
    error,
    city,
    setCity: fetchWeather,
    message: weather ? getMessage(weather) : "",
  };
}
