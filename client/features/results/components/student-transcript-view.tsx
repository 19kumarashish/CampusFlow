"use client";

import { useRef } from "react";
import { X, GraduationCap, Printer, Award, BookOpen, Layers, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranscriptQuery } from "../hooks/result.hooks";

interface StudentTranscriptViewProps {
  isOpen: boolean;
  onClose: () => void;
  enrollmentId: string;
}

export default function StudentTranscriptView({
  isOpen,
  onClose,
  enrollmentId,
}: StudentTranscriptViewProps) {
  const { data: transcript, isLoading, isError } = useTranscriptQuery(enrollmentId, isOpen);

  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printAreaRef.current?.innerHTML;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=800");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Student Official Academic Transcript</title>
            <style>
              body {
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                color: #0f172a;
                padding: 40px;
                background: #ffffff;
                line-height: 1.5;
              }
              .header {
                text-align: center;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 24px;
                font-weight: 800;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                margin-bottom: 5px;
              }
              .title {
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                color: #64748b;
              }
              .grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
                font-size: 13px;
              }
              .info-row {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px dashed #f1f5f9;
                padding: 4px 0;
              }
              .info-label {
                color: #64748b;
                font-weight: 500;
              }
              .info-val {
                font-weight: 700;
              }
              .semester-block {
                margin-bottom: 30px;
                page-break-inside: avoid;
              }
              .semester-title {
                font-size: 14px;
                font-weight: 800;
                border-bottom: 1px solid #0f172a;
                padding-bottom: 4px;
                margin-bottom: 10px;
                text-transform: uppercase;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
                margin-bottom: 10px;
              }
              th {
                text-transform: uppercase;
                font-size: 10px;
                color: #64748b;
                border-bottom: 1px solid #e2e8f0;
                padding: 6px 4px;
                text-align: left;
              }
              td {
                padding: 8px 4px;
                border-bottom: 1px solid #f1f5f9;
              }
              .summary-row {
                display: flex;
                justify-content: flex-end;
                gap: 20px;
                font-weight: 700;
                font-size: 12px;
                margin-top: 10px;
              }
              .grand-summary {
                margin-top: 40px;
                border: 1px solid #e2e8f0;
                padding: 15px;
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                font-weight: 800;
                page-break-inside: avoid;
              }
              .signature-block {
                margin-top: 80px;
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                page-break-inside: avoid;
              }
              .sig-line {
                width: 200px;
                border-top: 1px solid #64748b;
                text-align: center;
                padding-top: 6px;
                color: #64748b;
              }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="relative w-full max-w-3xl border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-md max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Controls */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Student Academic Transcript</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Official cumulative grade point average summary
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handlePrint}
            disabled={isLoading || isError}
            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5 mr-8 text-xs font-semibold"
          >
            <Printer className="h-4 w-4" /> Print Transcript
          </Button>
        </div>

        {/* Main Loading / Error states */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground mt-3 font-semibold">Compiling transcript records...</p>
          </div>
        ) : isError || !transcript ? (
          <div className="text-center py-16 text-destructive text-xs font-bold">
            Failed to compile student academic transcript. Please verify all subject results are published.
          </div>
        ) : (
          /* Render Area */
          <div ref={printAreaRef} className="bg-slate-950/20 p-6 border border-slate-900 rounded-xl max-h-[60vh] overflow-y-auto custom-scrollbar text-white">
            {/* Header info */}
            <div className="header text-center pb-4 mb-6 border-b border-slate-900">
              <h1 className="logo text-xl font-extrabold tracking-wider bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                CAMPUSFLOW UNIVERSITY
              </h1>
              <p className="title text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">
                Official Academic Transcript Record
              </p>
            </div>

            {/* Student metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs mb-6 pb-4 border-b border-slate-900">
              <div className="info-row flex justify-between border-b border-slate-900/30 py-1">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-white">{transcript.student?.name}</span>
              </div>
              <div className="info-row flex justify-between border-b border-slate-900/30 py-1">
                <span className="text-slate-500">Student Roll Number:</span>
                <span className="font-mono text-slate-350">{transcript.student?.rollNumber}</span>
              </div>
              <div className="info-row flex justify-between border-b border-slate-900/30 py-1">
                <span className="text-slate-500">Registration Number:</span>
                <span className="font-mono text-slate-350">{transcript.student?.registrationNumber}</span>
              </div>
              <div className="info-row flex justify-between border-b border-slate-900/30 py-1">
                <span className="text-slate-500">Student ID:</span>
                <span className="font-mono text-slate-350">{transcript.student?.studentId}</span>
              </div>
              <div className="info-row flex justify-between border-b border-slate-900/30 py-1">
                <span className="text-slate-500">Degree Course:</span>
                <span className="font-semibold text-slate-200">{transcript.student?.course}</span>
              </div>
              <div className="info-row flex justify-between border-b border-slate-900/30 py-1">
                <span className="text-slate-500">Department:</span>
                <span className="font-semibold text-slate-200">{transcript.student?.department}</span>
              </div>
            </div>

            {/* Semester details list */}
            {transcript.semesters?.map((sem) => (
              <div key={sem.semesterNumber} className="semester-block mb-6 last:mb-0">
                <h3 className="semester-title text-xs font-extrabold uppercase border-b border-slate-900 pb-1.5 mb-2 text-indigo-400">
                  {sem.semesterName} (Semester {sem.semesterNumber})
                </h3>
                <table className="w-full text-[11px] mb-3 text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-900/60 text-slate-500 text-[9px] uppercase">
                      <th className="pb-1.5 text-left">Code</th>
                      <th className="pb-1.5 text-left">Subject Title</th>
                      <th className="pb-1.5 text-center">Credits</th>
                      <th className="pb-1.5 text-center">Grade Point</th>
                      <th className="pb-1.5 text-center">Letter Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/30">
                    {sem.subjects?.map((sub) => (
                      <tr key={sub.code} className="hover:bg-slate-900/10">
                        <td className="py-2 font-mono text-slate-400">{sub.code}</td>
                        <td className="py-2 font-medium text-white">{sub.name}</td>
                        <td className="py-2 text-center">{sub.credits}</td>
                        <td className="py-2 text-center">{sub.gradePoint.toFixed(1)}</td>
                        <td className="py-2 text-center">
                          <span className="px-1.5 py-0.5 rounded border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 font-bold text-[10px]">
                            {sub.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Semester Summary */}
                <div className="flex justify-end gap-6 text-[10px] text-slate-500 border-t border-slate-900/20 pt-2 font-medium">
                  <span>Semester SGPA: <strong className="text-white">{sem.sgpa.toFixed(2)}</strong></span>
                  <span>Semester CGPA: <strong className="text-white">{sem.cgpa.toFixed(2)}</strong></span>
                  <span>Credits: <strong className="text-white">{sem.creditsEarned} / {sem.creditsAttempted} Cr</strong></span>
                </div>
              </div>
            ))}

            {/* Grand Summary Block */}
            <div className="grand-summary border border-indigo-500/20 bg-indigo-500/5 p-4 rounded-xl flex justify-between items-center mt-8 text-sm font-bold">
              <span className="text-indigo-400">Cumulative Performance Index:</span>
              <div className="flex gap-6 text-white">
                <span>Total Credits: {transcript.totalCreditsEarned} / {transcript.totalCreditsAttempted} Cr</span>
                <span>Final CGPA: <strong className="text-indigo-400 text-base">{transcript.cumulativeCgpa.toFixed(2)}</strong></span>
              </div>
            </div>

            {/* Signatures */}
            <div className="signature-block flex justify-between mt-12 text-[10px] text-slate-500 pt-6">
              <div className="sig-line border-t border-slate-800 text-center w-40 pt-1">
                Registrar Office
              </div>
              <div className="sig-line border-t border-slate-800 text-center w-40 pt-1">
                Controller of Exams
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
