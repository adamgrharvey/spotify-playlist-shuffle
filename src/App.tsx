import { useState, createContext, useContext, useEffect } from "react";
import Authentication from "./components/Authentication";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import './App.css';
import Home from "./components/Home";



function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
