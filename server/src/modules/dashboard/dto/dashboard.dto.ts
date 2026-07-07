export interface AdminDashboardDto {
  totalStudents: number;

  totalFaculty: number;

  totalDepartments: number;

  totalCourses: number;

  totalSubjects: number;

  totalSections: number;

  totalEnrollments: number;

  totalAssignments: number;

  totalExaminations: number;

  attendanceRate: number;

  passRate: number;
}

export interface FacultyDashboardDto {
  assignedSubjects: number;

  todayClasses: number;

  pendingAssignments: number;

  upcomingExaminations: number;

  recentResults: number;
}

export interface StudentDashboardDto {
  attendancePercentage: number;

  pendingAssignments: number;

  upcomingExaminations: number;

  currentSGPA: number;

  currentCGPA: number;

  todayClasses: number;
}