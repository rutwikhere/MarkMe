import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, BarChart } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner z-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 flex-1 py-2 transition duration-200 ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-blue-500'
              }`
            }
          >
            <Home size={24} />
            <span className="text-xs font-medium">Home</span>
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 flex-1 py-2 transition duration-200 ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-blue-500'
              }`
            }
          >
            <BarChart size={24} />
            <span className="text-xs font-medium">Stats</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 flex-1 py-2 transition duration-200 ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-blue-500'
              }`
            }
          >
            <User size={24} />
            <span className="text-xs font-medium">Profile</span>
          </NavLink>

        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
