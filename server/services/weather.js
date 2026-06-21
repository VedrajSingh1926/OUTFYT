const CITY_COORDS = {
  jaipur: { lat: 26.9124, lon: 75.7873 },
  ajmer: { lat: 26.4499, lon: 74.6399 },
  delhi: { lat: 28.6139, lon: 77.209 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  'san francisco': { lat: 37.7749, lon: -122.4194 },
  london: { lat: 51.5074, lon: -0.1278 },
  paris: { lat: 48.8566, lon: 2.3522 },
};

function mapWeatherCondition(main, description) {
  const m = main.toLowerCase();
  if (m.includes('clear')) return { condition: 'Clear', emoji: '☀️', impact: 'Light layers work great' };
  if (m.includes('cloud')) return { condition: 'Cloudy', emoji: '⛅', impact: 'Versatile layering recommended' };
  if (m.includes('rain') || m.includes('drizzle')) return { condition: 'Rainy', emoji: '🌧️', impact: 'Water-resistant outerwear advised' };
  if (m.includes('thunderstorm')) return { condition: 'Stormy', emoji: '⛈️', impact: 'Stay indoors or dress weather-proof' };
  if (m.includes('snow')) return { condition: 'Snowy', emoji: '❄️', impact: 'Warm layers essential' };
  if (m.includes('mist') || m.includes('fog')) return { condition: 'Foggy', emoji: '🌫️', impact: 'Add a light jacket' };
  return { condition: main, emoji: '⛅', impact: 'Comfortable for most outfits' };
}

export async function fetchWeather(city, lat, lon) {
  let latitude = lat;
  let longitude = lon;
  let locationName = city;

  if (city && !lat) {
    const key = city.toLowerCase().trim();
    const coords = CITY_COORDS[key];
    if (coords) {
      latitude = coords.lat;
      longitude = coords.lon;
      locationName = city.charAt(0).toUpperCase() + city.slice(1);
    }
  }

  if (!latitude || !longitude) {
    return {
      location: locationName || 'Unknown',
      temp: 24,
      unit: 'C',
      condition: 'Partly Cloudy',
      emoji: '⛅',
      impact: 'Comfortable for most outfits',
      humidity: 55,
    };
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) throw new Error('Missing WEATHER_API_KEY');

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || 'Weather API Error');

    const weather = data.weather?.[0] || { main: 'Clear', description: 'clear sky' };
    const meta = mapWeatherCondition(weather.main, weather.description);
    
    return {
      location: locationName || data.name,
      temp: Math.round(data.main.temp),
      unit: 'C',
      humidity: data.main.humidity,
      ...meta,
    };
  } catch (err) {
    console.error('Weather error:', err.message);
    return {
      location: locationName || city,
      temp: 24,
      unit: 'C',
      condition: 'Partly Cloudy',
      emoji: '⛅',
      impact: 'Weather data unavailable — using smart defaults',
      humidity: 50,
    };
  }
}

export async function geocodeCity(city) {
  const key = city?.toLowerCase().trim();
  if (CITY_COORDS[key]) {
    return { ...CITY_COORDS[key], name: city };
  }
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) return null;

    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data && data.length > 0) {
      return {
        lat: data[0].lat,
        lon: data[0].lon,
        name: data[0].name,
      };
    }
  } catch (error) {
    console.error('Geocode error:', error.message);
  }
  return null;
}

export async function reverseGeocode(lat, lon) {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) return 'Your Location';

    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data && data.length > 0) {
      return data[0].name || 'Your Location';
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
  }
  return 'Your Location';
}
