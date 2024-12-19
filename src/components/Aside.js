import React from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  TruckIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArchiveBoxIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'; // Importing Heroicons

const Aside = () => {
  return (
    <aside className="bg-gray-800 text-gray-200 w-64 min-h-screen flex flex-col shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center justify-center py-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Afyco Logistics</h1>
      </div>

      {/* Navigation Section */}
      <nav className="flex-grow mt-4">
        <ul className="space-y-4">
          {/* Dashboard */}
          <li>
            <Link
              to="/main/analytics"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              <HomeIcon className="h-6 w-6 text-gray-400" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </li>

          {/* Shipments */}
          <li>
            <Link
              to="/main/shipments"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              <ArchiveBoxIcon className="h-6 w-6 text-gray-400" />
              <span className="font-medium">Shipments</span>
            </Link>
          </li>

          {/* Vehicles */}
          <li>
            <Link
              to="/main/vehicles"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              <TruckIcon className="h-6 w-6 text-gray-400" />
              <span className="font-medium">Vehicles</span>
            </Link>
          </li>

          {/* Users */}
          <li>
            <Link
              to="/main/users"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              <UsersIcon className="h-6 w-6 text-gray-400" />
              <span className="font-medium">Users</span>
            </Link>
          </li>

          {/* Settings */}
          <li>
            <Link
              to="/main/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              <Cog6ToothIcon className="h-6 w-6 text-gray-400" />
              <span className="font-medium">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      <button
        className="logout-button bg-red-500 text-white flex items-center justify-center py-2 px-4 rounded mt-4 hover:bg-red-600"
      >
        <ArrowLeftOnRectangleIcon className="h-6 w-6 text-white mr-2" /> Logout
      </button>


      {/* Footer */}
      <div className="py-4 border-t border-gray-700 text-center">
        <p className="text-sm text-gray-500">&copy; 2024 Afyco Logistics</p>
      </div>
    </aside>
  );
};

export default Aside;
