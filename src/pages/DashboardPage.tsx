import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useAttendanceStore } from '../stores/attendanceStore';
import { CalendarClock, Users, BookOpen, Clipboard, ChevronRight, X, Pencil } from 'lucide-react';
import iiitaLogo from '../assets/iiita-logo.gif';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { classes, fetchClasses, addClass } = useAttendanceStore();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    course: '',
    section: 'A',
    year: 'First Year',
  });
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDraftsModal, setShowDraftsModal] = useState(false);

  // Dummy drafts
  const dummyDrafts = [
    { id: '1', name: 'DBMS Attendance Draft' },
    { id: '2', name: 'OS Lab Draft' },
    { id: '3', name: 'Maths Quiz Attendance' },
  ];

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleClassClick = (classId: string) => {
    navigate(`/attendance/${classId}`);
  };

  const handleClassStatsClick = (classId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/class-stats/${classId}`);
  };

  const handleAddCourse = () => {
    const id = Date.now().toString();
    const newClass = {
      id,
      name: newCourse.name,
      course: newCourse.course,
      section: newCourse.section,
      year: newCourse.year,
      students: [],
      sessions: [],
    };
    addClass(newClass);
    setNewlyAddedId(id);
    setShowAddModal(false);
    setNewCourse({ name: '', course: '', section: 'A', year: 'First Year' });
  };

  return (
    <div className="space-y-6 animate-fade-in px-4 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
          <p className="text-sm text-gray-500">IIIT Allahabad Attendance Portal</p>
        </div>
        <img src={iiitaLogo} alt="IIITA Logo" className="h-12 w-12 object-contain" />
      </div>

      {/* Teaching Load */}
      <div className="p-5 rounded-lg bg-iiit-blue text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Teaching Load</h2>
            <p className="text-white text-opacity-80 text-sm">
              {classes.length} Active Course{classes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <BookOpen size={24} />
          </div>
        </div>
      </div>

      {/* Offline Mode */}
      {!isOnline && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-gray-800">
          <h3 className="text-lg font-semibold mb-1">Offline Mode Active</h3>
          <p className="text-sm text-gray-500">
            All attendance data is stored locally on your device. No internet connection is required to use this app.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-700">Your Classes</h2>
        <div className="flex items-center gap-3">
          {/* Drafts Button */}
          <div className="relative">
            <button
              onClick={() => setShowDraftsModal(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow transition relative"
            >
              Drafts
            </button>
            {dummyDrafts.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {dummyDrafts.length}
              </span>
            )}
          </div>

          {/* Add Course Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-iiit-blue text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add Course
          </button>
        </div>
      </div>

      {/* Class List */}
      <section className="space-y-5">
        {classes.length === 0 ? (
          <div className="bg-white text-center py-10 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-500">No classes assigned yet.</p>
          </div>
        ) : (
          classes.map((classItem) => (
            <div
              key={classItem.id}
              onClick={() => handleClassClick(classItem.id)}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    {classItem.name}
                    {classItem.id === newlyAddedId && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {classItem.course} • Section {classItem.section} • {classItem.year}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleClassStatsClick(classItem.id, e)}
                    className="text-iiit-blue hover:bg-gray-100 p-2 rounded-full transition"
                  >
                    <Clipboard size={18} />
                  </button>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  {classItem.students.length} Students
                </div>
                <div className="flex items-center gap-2">
                  <CalendarClock size={16} />
                  {classItem.sessions.length} Sessions
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Add New Course</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Course Name"
                className="w-full border px-4 py-2 rounded-lg"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Course Code"
                className="w-full border px-4 py-2 rounded-lg"
                value={newCourse.course}
                onChange={(e) => setNewCourse({ ...newCourse, course: e.target.value })}
              />
              <select
                className="w-full border px-4 py-2 rounded-lg"
                value={newCourse.section}
                onChange={(e) => setNewCourse({ ...newCourse, section: e.target.value })}
              >
                {['A', 'B', 'C', 'D'].map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
              <select
                className="w-full border px-4 py-2 rounded-lg"
                value={newCourse.year}
                onChange={(e) => setNewCourse({ ...newCourse, year: e.target.value })}
              >
                {['First Year', 'Second Year', 'Third Year', 'Fourth Year'].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddCourse}
                className="w-full bg-iiit-blue text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drafts Modal */}
      {showDraftsModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowDraftsModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Drafted Attendances</h2>

            <div className="space-y-3">
              {dummyDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-100 transition"
                >
                  <span className="text-gray-700">{draft.name}</span>
                  <button className="text-iiit-blue hover:text-blue-600">
                    <Pencil size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
