export function calculatePercentage(
  marks: number,
  maximumMarks: number,
): number {
  return Number(
    (
      (marks / maximumMarks) *
      100
    ).toFixed(2),
  );
}