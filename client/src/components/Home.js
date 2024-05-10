import React from "react";
import Car from "../assets/EV.png";
import "./Home.css";
import MapImg from "../assets/map.jpg";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <div className="carDetails">
        <img src={Car} alt="car pic" />
        <div>
          <h4>TATA Nexon.ev</h4>
          <p>Vehicle Number : TN88F4045</p>
          <p>Owner : Yatish Pandiri</p>
          <p>Current Location : Kandigai (12.85°N,80.14°E)</p>
          <br />
          <a href="https://yatish14.github.io/EV-Analysis/">
            <Button variant="contained">Battery Health Analysis</Button>
          </a>
        </div>
      </div>
      <div className="socImage">
        <h2>
          Battery SOC : <span className="red">20.2 %</span>
        </h2>
        {/* <br /> */}
        <img src={MapImg} alt="map" width="100" height="100" />
        <br />
        <br />
        <a href="https://yatish14.github.io/EV-SEARCH/">
          <Button variant="contained">Find nearby Charging Stations</Button>
        </a>
      </div>
    </div>
  );
};

export default Home;
