export interface TranscriptSubject {
  subjectCode: string;

  subjectName: string;

  credits: number;

  grade: string;

  gradePoint: number;

  marks: number;
}

export interface Transcript {
  studentName: string;

  enrollmentNumber: string;

  semester: string;

  sgpa: number;

  cgpa: number;

  subjects: TranscriptSubject[];
}

export function generateTranscript(
  data: Transcript,
) {
  return {
    ...data,

    generatedAt:
      new Date(),

    totalCredits:
      data.subjects.reduce(
        (
          total,
          subject,
        ) =>
          total +
          subject.credits,
        0,
      ),

    totalMarks:
      data.subjects.reduce(
        (
          total,
          subject,
        ) =>
          total +
          subject.marks,
        0,
      ),
  };
}