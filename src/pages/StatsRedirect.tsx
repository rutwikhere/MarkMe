// pages/StatsRedirect.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAttendanceStore } from '../stores/attendanceStore';

const StatsRedirect: React.FC = () => {
  const { classes } = useAttendanceStore();

  if (!classes || classes.length === 0) {
    return (
      <div className="flex justify-center items-center h-60 text-gray-500">
        No classes available to show stats.
      </div>
    );
  }

  return <Navigate to={`/class-stats/${classes[0].id}`} />;
};

export default StatsRedirect;
