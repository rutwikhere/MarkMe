import React from 'react';

interface CollegeLogoProps {
  size?: number;
  className?: string;
}

const CollegeLogo: React.FC<CollegeLogoProps> = ({ size = 40, className = '' }) => {
  return (
    <div className={`relative flex items-center ${className}`} style={{ width: size, height: size }}>
      {/* This is a simplified representation of the logo */}
      <div className="flex items-center justify-center">
        <div className="relative flex-shrink-0">
          <div className="text-blue-700 font-bold text-sm">IIIT-A</div>
        </div>
      </div>
    </div>
  );
};

export default CollegeLogo;