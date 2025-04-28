import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import Header from './Header';

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 pb-16 pt-16">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          {children}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;