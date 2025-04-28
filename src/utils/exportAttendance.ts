import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Class, Student, AttendanceSession } from '../stores/attendanceStore';

/**
 * Exports overall attendance summary of a class to Excel.
 */
export function exportClassAttendance(classData: Class) {
  if (!classData || !classData.students || !Array.isArray(classData.sessions)) {
    console.error("Invalid class data passed to export function.");
    return;
  }

  const totalSessions = classData.sessions.length;

  const data = classData.students.map((student: Student) => {
    const attendedCount = classData.sessions.reduce((count: number, session: AttendanceSession) => {
      const record = session.attendanceRecords.find((r) => r.studentId === student.id);
      return record?.present ? count + 1 : count;
    }, 0);

    const attendancePercentage = totalSessions > 0
      ? Math.round((attendedCount / totalSessions) * 100)
      : 0;

    return {
      Name: student.name,
      RollNumber: student.rollNumber,
      'Classes Attended': attendedCount,
      'Total Classes': totalSessions,
      'Attendance %': totalSessions > 0 ? `${attendancePercentage}%` : 'N/A',
    };
  });

  console.log("Exporting Attendance Data:", data); // 🔍 Debug log

  if (data.length === 0) {
    alert("No students found to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `${classData.name.replace(/\s+/g, '_')}_AttendanceSummary.xlsx`);
}
