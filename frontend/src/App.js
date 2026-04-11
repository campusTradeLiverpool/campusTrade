import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Map from './components/map/index';
import NavBar from './components/NavBar';
import Register from './pages/register';
import Login from './pages/login';
import Profile from './pages/profile';
import Sell from './pages/sell';
import Home from './pages/home';
import ListingDetail from './pages/listingDetail';

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
                <Route path="/" element={<Home />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
            </Routes>
        </Router>
    );
}

export default App;