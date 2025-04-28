import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAttendanceStore, Student } from '../stores/attendanceStore';
import { Save, AlertCircle, Search, Users, Plus, X } from 'lucide-react';
import ClipLoader from 'react-spinners/ClipLoader';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { exportClassAttendance } from '../utils/exportAttendance';

const demoStudents: Student[] = [
  { id: 'IIB2024001', name: 'Student 01', rollNumber: 'IIB2024001', attendancePercentage: 100 },
  { id: 'IIB2024002', name: 'Student 02', rollNumber: 'IIB2024002', attendancePercentage: 100 },
  { id: 'IIB2024501', name: 'Student 46', rollNumber: 'IIB2024501', attendancePercentage: 100 }
];

interface TA {
  name: string;
  email: string;
  phone: string;
}

const demoTAs: TA[] = [
  { name: 'Rahul Sharma', email: 'rahul@iiita.ac.in', phone: '9876543210' },
  { name: 'Priya Verma', email: 'priya@iiita.ac.in', phone: '9876543211' },
  { name: 'Aditya Singh', email: 'aditya@iiita.ac.in', phone: '9876543212' }
];

const AttendancePage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const { getClassById, createAttendanceSession, markAttendance } = useAttendanceStore();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'attendance' | 'people'>('attendance');
  const [tas, setTAs] = useState<TA[]>(demoTAs);

  const [showAddTAModal, setShowAddTAModal] = useState(false);
  const [newTA, setNewTA] = useState<TA>({ name: '', email: '', phone: '' });
  const [taAddedSuccess, setTAAddedSuccess] = useState(false);

  const classData = getClassById(classId || '');

  useEffect(() => {
    if (classData && classData.students.length === 0) {
      classData.students.push(...demoStudents);
    }
  }, [classData]);

  useEffect(() => {
    if (classData) {
      const sessions = classData.sessions;
      if (sessions.length === 0) {
        const newSessionId = createAttendanceSession(classId || '');
        setSessionId(newSessionId);
      } else {
        setSessionId(sessions[0].id);
      }
    }
  }, [classData, classId, createAttendanceSession]);

  if (!classData || !sessionId) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const currentSession = classData.sessions.find(s => s.id === sessionId);
  if (!currentSession) {
    return (
      <div className="flex flex-col justify-center items-center h-60">
        <AlertCircle size={32} className="text-red-500 mb-2" />
        <p className="text-red-600 font-medium">Session not found</p>
      </div>
    );
  }

  const handleMarkAttendance = (student: Student, present: boolean) => {
    markAttendance(classId || '', sessionId, student.id, present);
  };

  const isStudentPresent = (student: Student): boolean => {
    const record = currentSession.attendanceRecords.find(r => r.studentId === student.id);
    return record ? record.present : true;
  };

  const handleSaveAttendance = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate('/home');
      }, 1200);
    }, 1500);
  };

  const handleExportToExcel = () => {
    const exportData = classData.students.map(student => {
      const attendanceRecord = currentSession.attendanceRecords.find(
        r => r.studentId === student.id
      );
      return {
        Name: student.name,
        RollNumber: student.rollNumber,
        Present: attendanceRecord ? (attendanceRecord.present ? 'Yes' : 'No') : 'Yes',
        AttendancePercentage: student.attendancePercentage
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, `${classData.name}_Attendance_${currentSession.date}.xlsx`);
  };

  const markAll = (present: boolean) => {
    classData.students.forEach(student => {
      handleMarkAttendance(student, present);
    });
  };

  const filteredStudents = classData.students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTA = () => {
    setShowAddTAModal(true);
  };

  const submitNewTA = () => {
    setTAs(prev => [...prev, newTA]);
    setTAAddedSuccess(true);
    setTimeout(() => {
      setShowAddTAModal(false);
      setTAAddedSuccess(false);
      setNewTA({ name: '', email: '', phone: '' });
    }, 1500);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{classData.name}</h2>
          <p className="text-sm text-gray-500">{classData.course} – Section {classData.section}</p>
        </div>
        <p className="text-sm text-gray-500">{currentSession.date}</p>
      </div>

      {activeTab === 'attendance' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => markAll(true)}
              className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700 transition"
            >
              Mark All Present
            </button>
            <button
              onClick={() => markAll(false)}
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
            >
              Mark All Absent
            </button>
          </div>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-3">
          {filteredStudents.map(student => {
            const isPresent = isStudentPresent(student);
            return (
              <div
                key={student.id}
                onClick={() => handleMarkAttendance(student, !isPresent)}
                className={`cursor-pointer p-4 rounded-xl border shadow-sm transition-all duration-200 ${
                  isPresent
                    ? 'bg-green-50 border-green-300 hover:bg-green-100'
                    : 'bg-red-50 border-red-300 hover:bg-red-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.rollNumber}</p>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {student.attendancePercentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'people' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Teachers & Assistants</h3>
            <button
              onClick={handleAddTA}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              <Plus size={16} />
              Add TA
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-2">Professor</h4>
            <div className="pl-4 text-gray-600">Professor (You)</div>
          </div>

          {tas.map((ta, index) => (
            <div key={index} className="bg-white p-4 rounded-xl border shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-1">{ta.name}</h4>
              <p className="text-sm text-gray-600">{ta.email}</p>
              <p className="text-sm text-gray-600">{ta.phone}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="pt-4 space-y-3">
          <button
            onClick={handleSaveAttendance}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex justify-center items-center transition ${
              saving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={saving}
          >
            {saving ? (
              <>
                <ClipLoader size={20} color="#ffffff" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" /> Save Attendance
              </>
            )}
          </button>

          <button
            onClick={handleExportToExcel}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition"
          >
            Export to Excel (Session)
          </button>

          <button
            onClick={() => exportClassAttendance(classData)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Export Attendance Summary (Overall)
          </button>

          {saveSuccess && (
            <p className="text-center text-sm text-green-600 mt-2">Attendance saved successfully!</p>
          )}
        </div>
      )}

      {/* Add TA Modal */}
      {showAddTAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 space-y-4 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddTAModal(false)}
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Add New TA</h3>
            <input
              type="text"
              placeholder="Name"
              className="w-full border rounded px-3 py-2 text-sm"
              value={newTA.name}
              onChange={(e) => setNewTA({ ...newTA, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded px-3 py-2 text-sm"
              value={newTA.email}
              onChange={(e) => setNewTA({ ...newTA, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              className="w-full border rounded px-3 py-2 text-sm"
              value={newTA.phone}
              onChange={(e) => setNewTA({ ...newTA, phone: e.target.value })}
            />
            <button
              onClick={submitNewTA}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Submit
            </button>

            {taAddedSuccess && (
              <p className="text-center text-green-600 mt-2 animate-bounce">
                TA added successfully!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2 z-50">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex flex-col items-center text-xs ${
            activeTab === 'attendance' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <Save size={20} />
          <span>Attendance</span>
        </button>
        <button
          onClick={() => setActiveTab('people')}
          className={`flex flex-col items-center text-xs ${
            activeTab === 'people' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <Users size={20} />
          <span>People</span>
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;
