import React, { useState } from 'react';
import { CloudRain, Wind, Droplets, Sun, Cloud, CloudSnow, Zap, Search, Eye, Sunrise, Sunset } from 'lucide-react';
import useWeather from '../hooks/useWeather';
import './Weather.css';

const weatherIcons = {
  Clear: <Sun size={80} color="var(--color-warning)" className="glow-icon pulse-animation" />,
  Rain: <CloudRain size={80} color="var(--text-accent)" className="glow-icon" />,
  Drizzle: <CloudRain size={80} color="var(--text-accent)" className="glow-icon" />,
  Clouds: <Cloud size={80} color="var(--text-secondary)" className="glow-icon" />,
  Snow: <CloudSnow size={80} color="var(--text-primary)" className="glow-icon" />,
  Thunderstorm: <Zap size={80} color="var(--color-warning)" className="glow-icon" />,
};

const forecastIcons = {
  Clear: <Sun size={32} color="var(--color-warning)" />,
  Rain: <CloudRain size={32} color="var(--text-accent)" />,
  Clouds: <Cloud size={32} color="var(--text-secondary)" />,
  Snow: <CloudSnow size={32} color="var(--text-primary)" />,
  Thunderstorm: <Zap size={32} color="var(--color-warning)" />,
  Drizzle: <CloudRain size={32} color="var(--text-accent)" />,
};

// Helper for formatting time
const formatTime = (timestamp) => {
  if (!timestamp) return '--:--';
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

// Helper for AQI
const getAqiInfo = (aqi) => {
  if (!aqi) return { text: "Unknown", value: 0 };
  switch (aqi) {
    case 1: return { text: "Good", value: 20, display: 42 };
    case 2: return { text: "Fair", value: 40, display: 65 };
    case 3: return { text: "Moderate", value: 60, display: 110 };
    case 4: return { text: "Poor", value: 80, display: 160 };
    case 5: return { text: "Very Poor", value: 100, display: 210 };
    default: return { text: "Unknown", value: 0, display: 0 };
  }
};

export default function Weather() {
  const { weather, forecast, airQuality, uvIndex, loading, error, city, setCity, message } = useWeather();
  const [inputCity, setInputCity] = useState(city);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCity.trim()) setCity(inputCity.trim());
  };

  const getDailyForecast = () => {
    if (!forecast?.list) return [];
    const days = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
      if (!days[date]) days[date] = item;
    });
    return Object.entries(days).slice(0, 7);
  };

  const dailyForecast = getDailyForecast();
  
  const aqiInfo = getAqiInfo(airQuality?.main?.aqi);

  return (
    <div className="dashboard-container fade-in" style={{ width: '100%' }}>
      <header className="weather-header flex-between">
        <div>
          <h1>Weather</h1>
          <p className="text-muted">Current conditions and forecast</p>
        </div>
        <form onSubmit={handleSearch} style={{display:'flex',gap:'0.5rem'}}>
          <input type="text" value={inputCity} onChange={e => setInputCity(e.target.value)}
            placeholder="Search city..." className="city-input" />
          <button type="submit" className="btn-retro" style={{padding:'0.5rem 1rem'}}>
            <Search size={14} />
          </button>
        </form>
      </header>

      {loading && (
        <div className="bento-weather-grid">
          {/* Main Weather Card Skeleton */}
          <div className="card panel-main skeleton-card">
            <div className="skeleton-line" style={{ width: '40%', height: '1.5rem', marginBottom: '2rem' }}></div>
            <div className="skeleton-line" style={{ width: '100%', height: '8rem', marginBottom: '2rem' }}></div>
            <div className="skeleton-line" style={{ width: '60%', height: '2rem', marginBottom: '2rem' }}></div>
            <div className="skeleton-line" style={{ width: '100%', height: '4rem' }}></div>
          </div>
          
          {/* Side Panels Skeleton */}
          <div className="panel-side">
            <div className="card skeleton-card" style={{ flex: 1 }}>
              <div className="skeleton-line" style={{ width: '30%', height: '1rem', marginBottom: '1.5rem' }}></div>
              <div className="skeleton-line" style={{ width: '100%', height: '1.5rem', marginBottom: '1rem' }}></div>
              <div className="skeleton-line" style={{ width: '100%', height: '1.5rem', marginBottom: '1rem' }}></div>
              <div className="skeleton-line" style={{ width: '100%', height: '1.5rem' }}></div>
            </div>
            <div className="card skeleton-card" style={{ flex: 1 }}>
              <div className="skeleton-line" style={{ width: '30%', height: '1rem', marginBottom: '1.5rem' }}></div>
              <div className="skeleton-line" style={{ width: '100%', height: '1.5rem', marginBottom: '1rem' }}></div>
              <div className="skeleton-line" style={{ width: '100%', height: '1.5rem' }}></div>
            </div>
          </div>

          {/* Forecast Panel Skeleton */}
          <div className="card panel-forecast skeleton-card">
             <div className="skeleton-line" style={{ width: '20%', height: '1rem', marginBottom: '1.5rem' }}></div>
             <div className="forecast-grid">
               {[1,2,3,4,5,6,7].map(i => (
                 <div key={i} className="forecast-day skeleton-card-inner">
                   <div className="skeleton-line" style={{ width: '60%', height: '1rem', marginBottom: '1rem' }}></div>
                   <div className="skeleton-circle" style={{ width: '32px', height: '32px', marginBottom: '1rem' }}></div>
                   <div className="skeleton-line" style={{ width: '80%', height: '2rem' }}></div>
                 </div>
               ))}
             </div>
          </div>

          {/* Air Quality Skeleton */}
          <div className="card panel-air skeleton-card">
            <div className="skeleton-line" style={{ width: '30%', height: '1rem', marginBottom: '1.5rem' }}></div>
            <div className="skeleton-line" style={{ width: '100%', height: '4rem' }}></div>
          </div>
          <div className="card panel-uv skeleton-card">
            <div className="skeleton-line" style={{ width: '30%', height: '1rem', marginBottom: '1.5rem' }}></div>
            <div className="skeleton-line" style={{ width: '100%', height: '4rem' }}></div>
          </div>
        </div>
      )}
      {error && <div style={{textAlign:'center',padding:'2rem',color:'var(--color-danger)'}}>Error: {error}</div>}

      {weather && !loading && (
        <div className="bento-weather-grid">
          
          {/* Main Weather Card */}
          <div className="card panel-main">
            <div className="text-muted" style={{letterSpacing: '1px'}}>{weather.name}, {weather.sys?.country}</div>
            <div className="main-temp-wrapper flex-between">
              <div className="retro-green-huge">
                {Math.round(weather.main.temp)}°C
              </div>
              <div>
                {weather.weather && weather.weather[0] ? (weatherIcons[weather.weather[0].main] || weatherIcons.Clouds) : weatherIcons.Clouds}
              </div>
            </div>
            
            <div className="weather-condition retro-text">
              {weather.weather[0]?.description.replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            <div className="text-muted">{new Date().toLocaleDateString('en-US', { weekday: 'long', hour: '2-digit', minute:'2-digit' })}</div>
            
            <div className="ai-suggestion-box">
              {message}
            </div>
          </div>

          {/* Side Panels */}
          <div className="panel-side">
            <div className="card" style={{ flex: 1 }}>
              <h3 className="card-title-sm">DETAILS</h3>
              <div className="detail-row">
                <span className="detail-label"><Wind size={16} /> Wind</span>
                <span className="detail-value-cyan">{Math.round(weather.wind.speed * 3.6)} km/h</span>
              </div>
              <div className="detail-row">
                <span className="detail-label"><Droplets size={16} /> Humidity</span>
                <span className="detail-value-cyan">{weather.main.humidity}%</span>
              </div>
              <div className="detail-row">
                <span className="detail-label"><Eye size={16} /> Visibility</span>
                <span className="detail-value-cyan">{(weather.visibility / 1000).toFixed(1)} km</span>
              </div>
            </div>

            <div className="card" style={{ flex: 1 }}>
              <h3 className="card-title-sm">SUN</h3>
              <div className="detail-row">
                <span className="detail-label"><Sunrise size={16} /> Sunrise</span>
                <span className="detail-value-yellow">{formatTime(weather.sys.sunrise)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label"><Sunset size={16} /> Sunset</span>
                <span className="detail-value-red">{formatTime(weather.sys.sunset)}</span>
              </div>
            </div>
          </div>

          {/* Forecast Panel */}
          <div className="card panel-forecast">
            <h3 className="card-title-sm">7-DAY FORECAST</h3>
            <div className="forecast-grid">
              {dailyForecast.length > 0 ? dailyForecast.map(([day, data]) => (
                <div key={day} className="forecast-day">
                  <span className="f-day">{day}</span>
                  {data.weather && data.weather[0] ? (forecastIcons[data.weather[0].main] || forecastIcons.Clouds) : forecastIcons.Clouds}
                  <span className="f-temp">{Math.round(data.main.temp)}°</span>
                  <span className="f-cond">{data.weather[0]?.main}</span>
                </div>
              )) : <div className="text-muted" style={{textAlign:'center',width:'100%'}}>No forecast data available</div>}
            </div>
          </div>

          {/* Air Quality */}
          <div className="card panel-air">
            <h3 className="card-title-sm">AIR QUALITY</h3>
            <div className="metric-row">
              <span className="metric-value-green">{airQuality ? aqiInfo.display : '--'}</span>
              <div className="metric-text">
                <span className="metric-text-main">{aqiInfo.text}</span>
                <span className="metric-text-sub">AQI Index</span>
              </div>
            </div>
            <div className="progress-track">
              <div className="progress-fill-green" style={{ width: `${aqiInfo.value}%` }}></div>
            </div>
          </div>

          {/* Conditional UV Index or fallback */}
          {uvIndex && uvIndex.value !== undefined ? (
            <div className="card panel-uv">
              <h3 className="card-title-sm">UV INDEX</h3>
              <div className="metric-row">
                <span className="metric-value-yellow">{Math.round(uvIndex.value)}</span>
                <div className="metric-text">
                  <span className="metric-text-main">{uvIndex.value > 5 ? 'High' : uvIndex.value > 2 ? 'Moderate' : 'Low'}</span>
                  <span className="metric-text-sub">UV Level</span>
                </div>
              </div>
              <div className="progress-track">
                <div className="progress-fill-yellow" style={{ width: `${Math.min((uvIndex.value / 11) * 100, 100)}%` }}></div>
              </div>
            </div>
          ) : (
            <div className="card panel-uv">
              <h3 className="card-title-sm">FEELS LIKE</h3>
              <div className="metric-row">
                <span className="metric-value-yellow">{Math.round(weather.main.feels_like)}°</span>
                <div className="metric-text">
                  <span className="metric-text-main">Temperature</span>
                  <span className="metric-text-sub">Feels Like</span>
                </div>
              </div>
              <div className="progress-track">
                 <div className="progress-fill-yellow" style={{ width: `${Math.min(Math.max((weather.main.feels_like + 10) / 50, 0) * 100, 100)}%` }}></div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
