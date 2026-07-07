export interface SemesterSGPA {
  sgpa: number;

  credits: number;
}

export function calculateCGPA(
  semesters: SemesterSGPA[],
): number {
  if (semesters.length === 0) {
    return 0;
  }

  const {
    weightedSGPA,
    totalCredits,
  } = semesters.reduce(
    (acc, semester) => ({
      weightedSGPA:
        acc.weightedSGPA +
        semester.sgpa *
          semester.credits,

      totalCredits:
        acc.totalCredits +
        semester.credits,
    }),
    {
      weightedSGPA: 0,
      totalCredits: 0,
    },
  );

  if (totalCredits === 0) {
    return 0;
  }

  return Number(
    (
      weightedSGPA /
      totalCredits
    ).toFixed(2),
  );
}