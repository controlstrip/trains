const express = require('express');
const path = require('path');
const metroData = require('./data/metros.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/metros', (req, res) => {
  const cities = metroData.cities.map(city => ({
    name: city.name,
    system: city.system,
    lines: city.lines.map(line => ({
      name: line.name,
      color: line.color,
      textColor: line.textColor,
      stationCount: line.stations.length
    }))
  }));
  res.json(cities);
});

app.get('/api/metros/:cityIndex/lines/:lineIndex', (req, res) => {
  const { cityIndex, lineIndex } = req.params;
  const city = metroData.cities[cityIndex];
  if (!city) return res.status(404).json({ error: 'City not found' });

  const line = city.lines[lineIndex];
  if (!line) return res.status(404).json({ error: 'Line not found' });

  res.json({
    city: city.name,
    system: city.system,
    line: line.name,
    color: line.color,
    textColor: line.textColor,
    stations: line.stations
  });
});

app.listen(PORT, () => {
  console.log(`Metro Soundboard running at http://localhost:${PORT}`);
});
