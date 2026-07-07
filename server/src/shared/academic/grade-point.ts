import { Grade } from "@/shared/enums/grade.enum";

export function getGradePoint(
  grade: Grade,
): number {
  switch (grade) {
    case Grade.A_PLUS:
      return 10;

    case Grade.A:
      return 9;

    case Grade.B_PLUS:
      return 8;

    case Grade.B:
      return 7;

    case Grade.C:
      return 6;

    case Grade.D:
      return 5;

    default:
      return 0;
  }
}