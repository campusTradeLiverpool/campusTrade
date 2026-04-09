import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import NavBar from './components/NavBar';

function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;