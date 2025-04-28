import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import CollegeLogo from '../ui/CollegeLogo';

const Header: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/profile') return 'Profile';
    if (path.startsWith('/attendance/')) return 'Mark Attendance';
    if (path.startsWith('/class-stats/')) return 'Class Statistics';
    
    return 'IIIT Attendance';
  };
  
  const handleBack = () => {
    if (location.pathname === '/') {
      return; // Already on home page
    }
    
    if (location.pathname.startsWith('/attendance/')) {
      navigate('/');
    } else if (location.pathname.startsWith('/class-stats/')) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const showBackButton = location.pathname !== '/';
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <button 
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {!showBackButton && (
              <div className="flex items-center">
                <CollegeLogo size={32} />
              </div>
            )}
            <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;