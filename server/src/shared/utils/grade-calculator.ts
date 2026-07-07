import { Grade } from "@/shared/enums/grade.enum";

export function calculateGrade(
  marks: number,
  maximumMarks: number,
): Grade {
  const percentage =
    (marks / maximumMarks) * 100;

  if (percentage >= 90) return Grade.A_PLUS;

  if (percentage >= 80) return Grade.A;

  if (percentage >= 70) return Grade.B_PLUS;

  if (percentage >= 60) return Grade.B;

  if (percentage >= 50) return Grade.C;

  if (percentage >= 40) return Grade.D;

  return Grade.F;
}