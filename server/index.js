import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import { sendSensorData,write_to_file,sendSensorCSV,readSensorDataFromCSV } from "./controllers/battery.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is an Electrical Vehical Battery API");
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
