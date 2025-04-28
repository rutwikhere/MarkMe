import React from 'react';
import { useParams } from 'react-router-dom';
import { useAttendanceStore } from '../stores/attendanceStore';
import { BarChart, AlertCircle, Calendar } from 'lucide-react';

const ClassStatsPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const { getClassById } = useAttendanceStore();
  
  const classData = getClassById(classId || '');
  
  if (!classData) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="text-center">
          <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
          <p className="text-red-500 font-medium">Class not found</p>
        </div>
      </div>
    );
  }
  
  // Sort students by attendance percentage in descending order
  const sortedStudents = [...classData.students].sort(
    (a, b) => b.attendancePercentage - a.attendancePercentage
  );
  
  // Find highest, lowest, and average attendance
  const highestAttendance = sortedStudents[0]?.attendancePercentage || 0;
  const lowestAttendance = sortedStudents[sortedStudents.length - 1]?.attendancePercentage || 0;
  
  const totalAttendance = sortedStudents.reduce(
    (sum, student) => sum + student.attendancePercentage,
    0
  );
  
  const averageAttendance = sortedStudents.length 
    ? Math.round(totalAttendance / sortedStudents.length) 
    : 0;
  
  // Calculate students at risk (below 75% attendance)
  const studentsAtRisk = sortedStudents.filter(
    student => student.attendancePercentage < 75
  );
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold">{classData.name}</h2>
          <p className="text-sm text-gray-600">{classData.course} - Section {classData.section}</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="card p-4 flex-1 flex items-center space-x-3 bg-blue-50">
          <div className="p-2 bg-blue-500 rounded-full text-white">
            <BarChart size={20} />
          </div>
          <div>
            <p className="text-sm text-blue-700">Average Attendance</p>
            <p className="text-xl font-semibold">{averageAttendance}%</p>
          </div>
        </div>
        
        <div className="card p-4 flex-1 flex items-center space-x-3 bg-green-50">
          <div className="p-2 bg-green-500 rounded-full text-white">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-sm text-green-700">Total Sessions</p>
            <p className="text-xl font-semibold">{classData.sessions.length}</p>
          </div>
        </div>
      </div>
      
      <div className="card overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold">Attendance Summary</h3>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex flex-wrap gap-4">
            <div className="card border border-gray-200 p-3 flex-1 min-w-[140px]">
              <p className="text-sm text-gray-600">Highest</p>
              <p className="text-lg font-semibold text-green-600">{highestAttendance}%</p>
            </div>
            
            <div className="card border border-gray-200 p-3 flex-1 min-w-[140px]">
              <p className="text-sm text-gray-600">Lowest</p>
              <p className="text-lg font-semibold text-red-600">{lowestAttendance}%</p>
            </div>
            
            <div className="card border border-gray-200 p-3 flex-1 min-w-[140px]">
              <p className="text-sm text-gray-600">Students at Risk</p>
              <p className="text-lg font-semibold text-amber-600">{studentsAtRisk.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold">Student Rankings</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {sortedStudents.map((student, index) => {
            // Determine color based on attendance percentage
            let statusColor = 'bg-green-100 text-green-800';
            if (student.attendancePercentage < 75) {
              statusColor = 'bg-red-100 text-red-800';
            } else if (student.attendancePercentage < 85) {
              statusColor = 'bg-amber-100 text-amber-800';
            }
            
            return (
              <div key={student.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-3">
                    <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.rollNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    <div 
                      className="w-20 bg-gray-200 rounded-full h-2.5 mr-2"
                      title={`${student.attendancePercentage}%`}
                    >
                      <div 
                        className="h-2.5 rounded-full bg-blue-600" 
                        style={{ width: `${student.attendancePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                    {student.attendancePercentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClassStatsPage;