import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Aside from './Aside';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';
import Users from '../pages/Users';
import Vehicles from '../pages/Vehicles';
import Shipments from '../pages/Shipments';
import '../styles/main.css';

const Main = () => {
  return (
    <div className="main-layout">
      <Aside />
      <main className="main-content">
        <Routes>
          <Route path="analytics" element={<Analytics />} />
          <Route path="shipments" element={<Shipments />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="/" element={<Navigate replace to="analytics" />} />
        </Routes>
      </main>
    </div>
  );
};

export default Main;
