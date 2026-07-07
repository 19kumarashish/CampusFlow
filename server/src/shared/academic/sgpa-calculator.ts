export interface SubjectResult {
  credits: number;

  gradePoint: number;
}
export function calculateSGPA(
  subjects: SubjectResult[],
): number {
  if (subjects.length === 0) {
    return 0;
  }

  const {
    totalCredits,
    weightedPoints,
  } = subjects.reduce(
    (acc, subject) => ({
      totalCredits:
        acc.totalCredits +
        subject.credits,

      weightedPoints:
        acc.weightedPoints +
        subject.credits *
          subject.gradePoint,
    }),
    {
      totalCredits: 0,
      weightedPoints: 0,
    },
  );

  if (totalCredits === 0) {
    return 0;
  }

  return Number(
    (
      weightedPoints /
      totalCredits
    ).toFixed(2),
  );
}