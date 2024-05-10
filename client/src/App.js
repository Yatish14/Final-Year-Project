import React from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Analysis from './components/Analysis'
import './App.css'
// import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

const App = () => {
  return (
    <div>
      <Navbar />
      <Home />
    </div>
  )
}

export default App