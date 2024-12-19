import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Main from './components/Main'; // Adjust the import path as necessary
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HomePage from './pages/HomePage';



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate replace to="/home" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/main/*" element={<Main />} />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;
