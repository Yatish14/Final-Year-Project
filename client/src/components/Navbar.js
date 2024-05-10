import React from "react";
import "./Navbar.css";
import yatishPic from '../assets/Yatish.jpg'

const Navbar = () => {
  return (
    <nav className="main-nav">
      <div className="navbar">
        <a href="/" className="nav-item nav-logo pointer">
          <h3>
            EV Battery Management System with Proximity Charging Station
            Detection
          </h3>
        </a>
        <div className='nav-item nav-links logout'>
          <img src={yatishPic} backgroundColor="#009dff" color="white" width="33" height="33" alt="profile pic"/>
          <p >Log out</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
