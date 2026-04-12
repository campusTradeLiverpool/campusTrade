import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Register from './pages/register';
import Login from './pages/login';
import Profile from './pages/profile';
import Sell from './pages/sell';
import Home from './pages/home';
import ListingDetail from './pages/listingDetail'
import Messages from './pages/messages';
import Inbox from './pages/inbox';
import Meetup from './pages/meetup';
import ConfirmTransaction from './pages/confirmTransaction';

function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/" element={<Home />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/messages/:receiverEmail/:listingId" element={<Messages />} /> 
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/meetup/:listingId" element={<Meetup />} />
                <Route path="/confirm-transaction/:transactionId" element={<ConfirmTransaction />} />
            </Routes>
        </Router>
    );
}

export default App;