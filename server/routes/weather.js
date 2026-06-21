import { Router } from 'express';
import { fetchWeather, geocodeCity, reverseGeocode } from '../services/weather.js';

const router = Router();

router.get('/', async (req, res) => {
  const { city, lat, lon } = req.query;
  if (lat && lon) {
    const cityName = city || await reverseGeocode(parseFloat(lat), parseFloat(lon));
    const weather = await fetchWeather(cityName, parseFloat(lat), parseFloat(lon));
    return res.json({ weather, geo: { name: cityName, lat: parseFloat(lat), lon: parseFloat(lon) } });
  }
  if (!city) return res.status(400).json({ error: 'City or coordinates required' });
  const geo = await geocodeCity(city);
  if (!geo) return res.status(404).json({ error: 'City not found' });
  const weather = await fetchWeather(geo.name, geo.lat, geo.lon);
  res.json({ weather, geo });
});

export default router;
