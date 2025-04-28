import { create } from 'zustand';

// ✅ Only one definition for Student
export type Student = {
  id: string;
  name: string;
  rollNumber: string;
  attendancePercentage: number;
};

// ✅ Only one definition for AttendanceSession
export type AttendanceSession = {
  id: string;
  date: string;
  takenBy: {
    id: string;
    name: string;
  };
  attendanceRecords: {
    studentId: string;
    present: boolean;
  }[];
};

// ✅ Class type used throughout the app
export type Class = {
  id: string;
  name: string;
  course: string;
  section: string;
  year: string;
  students: Student[];
  sessions: AttendanceSession[];
};

type AttendanceState = {
  classes: Class[];
  fetchClasses: () => void;
  getClassById: (id: string) => Class | undefined;
  markAttendance: (
    classId: string,
    sessionId: string,
    studentId: string,
    present: boolean
  ) => void;
  createAttendanceSession: (classId: string) => string;
  addClass: (newClass: Class) => void;
};

// 🔁 Helper to generate students
const generateStudents = (batchYear: number, count: number, prefix: string, offset: number): Student[] => {
  const names = [
    'Aditya', 'Riya', 'Aman', 'Sneha', 'Kunal', 'Pooja', 'Yash', 'Simran', 'Ravi', 'Divya',
    'Arjun', 'Neha', 'Rahul', 'Kriti', 'Mohit', 'Anjali', 'Vikram', 'Shreya', 'Karan', 'Priya',
    'Harsh', 'Megha', 'Nikhil', 'Tanya', 'Siddharth', 'Isha', 'Abhishek', 'Sakshi', 'Rajat', 'Swati',
    'Nitesh', 'Deepika', 'Varun', 'Ankita', 'Manish', 'Kavya', 'Uday', 'Aishwarya', 'Ankit', 'Radhika',
    'Gaurav', 'Palak', 'Parth', 'Lavanya', 'Sarthak', 'Tanvi', 'Rohit', 'Bhavna', 'Dev', 'Aarushi'
  ];

  return Array.from({ length: count }, (_, i) => {
    const name = names[(offset + i) % names.length];
    const roll = `${prefix}${batchYear}${(i + 1).toString().padStart(3, '0')}`;
    return {
      id: `s-${prefix}-${i + 1}`,
      name: `${name} ${batchYear}`,
      rollNumber: roll.toUpperCase(),
      attendancePercentage: 100
    };
  });
};

// ✅ Mock data
const initialClasses: Class[] = [
  {
    id: 'cs101',
    name: 'Introduction to Programming',
    course: 'CS101',
    section: 'A',
    year: 'First Year',
    students: generateStudents(2024, 46, 'iib', 0),
    sessions: []
  },
  {
    id: 'cs201',
    name: 'Data Structures',
    course: 'CS201',
    section: 'B',
    year: 'Second Year',
    students: generateStudents(2023, 45, 'iib', 10),
    sessions: []
  },
  {
    id: 'cs301',
    name: 'Database Management',
    course: 'CS301',
    section: 'C',
    year: 'Third Year',
    students: generateStudents(2022, 60, 'iib', 20),
    sessions: []
  },
  {
    id: 'cs401',
    name: 'Operating Systems',
    course: 'CS401',
    section: 'D',
    year: 'Fourth Year',
    students: generateStudents(2021, 100, 'iib', 30),
    sessions: []
  }
];

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  classes: initialClasses,

  fetchClasses: () => {
    set({ classes: initialClasses });
  },

  getClassById: (id: string) => {
    return get().classes.find((c) => c.id === id);
  },

  markAttendance: (classId, sessionId, studentId, present) => {
    set((state) => {
      const newClasses = [...state.classes];
      const classIndex = newClasses.findIndex((c) => c.id === classId);
      if (classIndex === -1) return state;

      const sessionIndex = newClasses[classIndex].sessions.findIndex((s) => s.id === sessionId);
      if (sessionIndex === -1) return state;

      const recordIndex = newClasses[classIndex].sessions[sessionIndex].attendanceRecords.findIndex(
        (r) => r.studentId === studentId
      );

      if (recordIndex === -1) {
        newClasses[classIndex].sessions[sessionIndex].attendanceRecords.push({
          studentId,
          present
        });
      } else {
        newClasses[classIndex].sessions[sessionIndex].attendanceRecords[recordIndex].present = present;
      }

      const studentIndex = newClasses[classIndex].students.findIndex((s) => s.id === studentId);
      if (studentIndex !== -1) {
        const allSessions = newClasses[classIndex].sessions;
        const studentSessions = allSessions.flatMap((session) =>
          session.attendanceRecords.filter((record) => record.studentId === studentId)
        );

        const presentCount = studentSessions.filter((record) => record.present).length;
        const totalCount = studentSessions.length;

        if (totalCount > 0) {
          const newPercentage = Math.round((presentCount / totalCount) * 100);
          newClasses[classIndex].students[studentIndex].attendancePercentage = newPercentage;
        }
      }

      return { classes: newClasses };
    });
  },

  createAttendanceSession: (classId: string) => {
    const sessionId = `sess-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    set((state) => {
      const newClasses = [...state.classes];
      const classIndex = newClasses.findIndex((c) => c.id === classId);
      if (classIndex === -1) return state;

      const studentsInClass = newClasses[classIndex].students;
      const newSession: AttendanceSession = {
        id: sessionId,
        date: today,
        takenBy: {
          id: '1',
          name: 'Dr. Rahul Sharma'
        },
        attendanceRecords: studentsInClass.map((student) => ({
          studentId: student.id,
          present: true
        }))
      };

      newClasses[classIndex].sessions.unshift(newSession);
      return { classes: newClasses };
    });

    return sessionId;
  },

  addClass: (newClass) => {
    set((state) => ({
      classes: [...state.classes, newClass]
    }));
  }
}));
