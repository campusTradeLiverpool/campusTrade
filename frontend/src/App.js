import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import Map from './components/map/index';
import NavBar from './components/NavBar';
import Login from './pages/login';
import Sell from './pages/sell';
import Profile from './pages/profile';

function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/map" element={<Map />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/sell" element={<Sell />} />
            </Routes>
        </Router>
    );
}

export default App;