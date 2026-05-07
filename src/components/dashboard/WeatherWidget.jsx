import { useFetch } from '../../hooks/useFetch';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import ErrorBanner from '../ui/ErrorBanner';
import './WeatherWidget.css';

export default function WeatherWidget({ city = 'London' }) {
  const { data, loading, error } = useFetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);

  if (loading) return (
    <Card className="weather-widget">
      <Skeleton height="2rem" width="60%" />
      <Skeleton height="3rem" width="40%" />
      <Skeleton height="1rem" width="80%" />
    </Card>
  );

  if (error) return (
    <Card className="weather-widget">
      <ErrorBanner message="Unable to load weather data" />
    </Card>
  );

  if (!data) return null;

  const current = data.current_condition?.[0];
  if (!current) return null;
  const description = current.weatherDesc?.[0]?.value;
  const temp = current.temp_C;

  return (
    <Card className="weather-widget">
      <div className="weather-header">
        <h3 className="weather-city">{city}</h3>
        <span className="weather-icon">🌤️</span>
      </div>
      <div className="weather-temp">{temp}°C</div>
      <p className="weather-desc">{description}</p>
    </Card>
  );
}
