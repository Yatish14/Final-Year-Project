import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import request from 'request';

import { sendSensorData,write_to_file,sendSensorCSV,readSensorDataFromCSV } from "./controllers/battery.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is an Electrical Vehical Battery API");
});

app.post('/nearest', (req, res) => {
  const { latitude, longitude } = req.body;

  const findNearestChargingStation = async (latitude, longitude) => {
      let radius = 2000; // Starting radius
      let chargingStations = [];
      let nearestStation = null;

      while (!nearestStation && radius <= 5000) {
          chargingStations = await getChargingStations(latitude, longitude, radius);
          nearestStation = findNearestStation(latitude, longitude, chargingStations);
          radius += 3000; // Increase radius by 3000m if no station found within current radius
      }

      return nearestStation;
  };

  const getChargingStations = (latitude, longitude, radius) => {
      return new Promise((resolve, reject) => {
          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/charging.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}&proximity=${longitude},${latitude}&radius=${radius}`;
          request(url, (error, response, body) => {
              if (!error && response.statusCode === 200) {
                  const data = JSON.parse(body);
                  const chargingStations = data.features.map(feature => ({
                      latitude: feature.geometry.coordinates[1],
                      longitude: feature.geometry.coordinates[0]
                  }));
                  resolve(chargingStations);
              } else {
                  reject(error || response.statusCode);
              }
          });
      });
  };

  const findNearestStation = (latitude, longitude, stations) => {
      let nearestDistance = Infinity;
      let nearestStation = null;
      stations.forEach(station => {
          const distance = haversineDistance(latitude, longitude, station.latitude, station.longitude);
          if (distance < nearestDistance) {
              nearestDistance = distance;
              nearestStation = station;
          }
      });
      return nearestStation;
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the Earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance; // Distance in km
  };

  findNearestChargingStation(latitude, longitude)
      .then(nearestStation => {
          res.json(nearestStation);
      })
      .catch(error => {
          console.error('Error finding nearest charging station:', error);
          res.status(500).json({ error: 'Internal server error' });
      });
});


const PORT = process.env.PORT || 5000;

const CONNECTION_URL = process.env.CONNECTION_URL;

// readSensorDataFromCSV();

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
      setInterval(sendSensorCSV, 5000);
    })
  )
  .catch((err) => console.log(err.message));
