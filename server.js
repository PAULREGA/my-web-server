const express = require('express');
const axios = require('axios');
const geoip = require('geoip-lite');
const app = express();

const PORT = process.env.PORT || 3000;

// Root URL handler (optional)
app.get('/', (req, res) => {
  res.send('Welcome to the API server. Use /api/hello?visitor_name=YourName to access the API.');
});

// Define the API endpoint
app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = req.ip === '::1' ? '127.0.0.1' : req.ip;
  const geo = geoip.lookup(clientIp) || { city: 'New York' }; // Default to New York if geo lookup fails
  const location = geo.city || 'New York';

  // Use a weather API to get the temperature
  const weatherApiKey = process.env.WEATHER_API_KEY;
  const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${weatherApiKey}`;

  try {
    const weatherResponse = await axios.get(weatherApiUrl);
    const temperature = weatherResponse.data.main.temp;

    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
    });
  } catch (error) {
    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}!`
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
