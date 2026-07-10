export interface Subject {
  _id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Section {
  _id: string;
  name: string;
  capacity?: number;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  duration?: number;
}

export interface Department {
  _id: string;
  name: string;
  code: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  subject: Subject;
  section?: Section;
  faculty?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Examination {
  _id: string;
  name: string;
  date: string;
  subject: Subject;
  section?: Section;
  faculty?: string;
  room?: string;
  totalMarks?: number;
  passingMarks?: number;
  status?: string;
  createdAt: string;
}

export interface Enrollment {
  _id: string;
  student: string;
  course: Course | string;
  semester: string;
  section: Section | string;
  rollNumber: string;
  status: string;
  enrollmentDate: string;
}

export interface Result {
  _id: string;
  enrollment: string;
  subject: Subject;
  assignmentMarks: number;
  examMarks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
}

export interface SemesterResult {
  _id: string;
  enrollment: string;
  semester: string;
  sgpa: number;
  cgpa: number;
  creditsEarned: number;
  resultStatus: string;
  publishDate?: string;
}

// ----------------------------------------------------
// Specific Dashboard Layout Responses
// ----------------------------------------------------

export interface AdminDashboardData {
  statistics: {
    students: number;
    faculty: number;
    departments: number;
    courses: number;
    subjects: number;
    sections: number;
    enrollments: number;
    assignments: number;
    examinations: number;
  };
  attendance: {
    attendanceRate: number;
  };
  results: {
    averageCGPA: number;
    passRate: number;
  };
  examinations: Examination[];
  assignments: Assignment[];
  admissions: Array<{
    _id: {
      year: number;
      month: number;
    };
    students: number;
  }>;
  departments: Array<{
    _id: string; // Will contain department ID or name depending on Mongoose aggregate grouping
    averageCGPA: number;
  }>;
}

export interface FacultyDashboardData {
  assignments: Assignment[];
  examinations: Examination[];
}

export interface StudentDashboardData {
  enrollment: Enrollment;
  assignments: Assignment[];
  examinations: Examination[];
  results: Result[];
  gpa: SemesterResult | null;
}

export type DashboardResponseData =
  | AdminDashboardData
  | FacultyDashboardData
  | StudentDashboardData;
