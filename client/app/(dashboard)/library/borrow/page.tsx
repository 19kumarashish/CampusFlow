"use client";

import { useState, useMemo } from "react";
import { Landmark, Plus, Clipboard, UserCheck, Loader2, CheckCircle, RefreshCcw, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStudentsQuery } from "@/features/students";
import {
  useBooksQuery,
  useBorrowRecordsQuery,
  useBorrowBookMutation,
  useReturnBookMutation,
  useWaiveFineMutation,
} from "@/features/library";
import { RootState } from "@/store";

export default function LibraryCirculationPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role?.name || "";
  const isAdmin = role === "ADMIN";
  const isStudent = role === "STUDENT";

  const [studentFilter, setStudentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Form states for borrowing
  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Queries
  const { data: studentsData } = useStudentsQuery({ limit: 100, status: "ACTIVE" as any });
  const activeStudents = useMemo(() => studentsData?.students || [], [studentsData?.students]);

  const { data: booksData } = useBooksQuery();
  const activeBooks = useMemo(() => booksData || [], [booksData]);

  const queryParams = useMemo(() => {
    return {
      studentId: isStudent ? user?._id : (studentFilter !== "ALL" ? studentFilter : undefined),
      status: statusFilter !== "ALL" ? statusFilter : undefined,
    };
  }, [isStudent, user?._id, studentFilter, statusFilter]);

  const { data: borrowList, isLoading } = useBorrowRecordsQuery(queryParams);

  // Mutations
  const { mutate: borrowBook, isPending: isBorrowing } = useBorrowBookMutation();
  const { mutate: returnBook, isPending: isReturning } = useReturnBookMutation();
  const { mutate: waiveFine, isPending: isWaiving } = useWaiveFineMutation();

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !bookId || !dueDate) return;

    borrowBook({
      studentId,
      bookId,
      dueDate: new Date(dueDate).toISOString(),
    }, {
      onSuccess: () => {
        setStudentId("");
        setBookId("");
        setDueDate("");
      }
    });
  };

  const handleReturnAction = (recordId: string, markAsLost = false) => {
    const confirmMsg = markAsLost
      ? "Report this book copy as lost? (Simulation: $50 penalty fine will be charged)"
      : "Mark this book copy as returned?";

    if (window.confirm(confirmMsg)) {
      returnBook({
        borrowRecordId: recordId,
        conditionOnReturn: "Good",
        markAsLost,
      });
    }
  };

  const handleWaive = (id: string) => {
    if (window.confirm("Are you sure you want to waive this library fine?")) {
      waiveFine(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RETURNED":
        return "bg-emerald-500/10 text-emerald-450 border-emerald-500/20";
      case "LOST":
        return "bg-rose-500/10 text-rose-455 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-450 border-amber-500/20 animate-pulse";
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Title */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Landmark className="h-6 w-6 text-indigo-400" /> Library Circulation Hub
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Issue textbook copies to students, inspect return schedules, and adjust outstanding fines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Issue book panel (Admins only) */}
        {isAdmin && (
          <Card className="lg:col-span-1 border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl h-fit">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
              <UserCheck className="h-4.5 w-4.5 text-indigo-400" /> Issue Textbook Copy
            </h3>
            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Student Profile</label>
                <select
                  required
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                >
                  <option value="">Select Recipient Student</option>
                  {activeStudents.map((st) => (
                    <option key={st._id} value={st._id} className="bg-slate-950">
                      {st.user ? `${st.user.firstName} ${st.user.lastName}` : st.studentId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Choose Book Title</label>
                <select
                  required
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none"
                  value={bookId}
                  onChange={(e) => setBookId(e.target.value)}
                >
                  <option value="">Select Book Title</option>
                  {activeBooks
                    .filter((b) => b.availableCopies > 0)
                    .map((b) => (
                      <option key={b._id} value={b._id} className="bg-slate-950">
                        {b.title} ({b.isbn})
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Due Date</label>
                <input
                  required
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-350 focus:outline-none"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={isBorrowing}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-9 mt-4"
              >
                {isBorrowing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Issue Book Copy"}
              </Button>
            </form>
          </Card>
        )}

        {/* Circulation Logs table */}
        <Card className={`border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl ${isAdmin ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-slate-900">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clipboard className="h-4.5 w-4.5 text-indigo-400" /> Active Circulation Logs
            </h3>

            {/* Filter buttons */}
            {!isStudent && (
              <div className="flex items-center gap-2">
                <select
                  className="h-8 rounded border border-slate-850 bg-slate-900/40 px-2 text-slate-300 text-[10px]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All States</option>
                  <option value="BORROWED">Borrowed</option>
                  <option value="RETURNED">Returned</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
          ) : borrowList?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-bold uppercase text-[10px]">
                    <th className="p-4">Recipient</th>
                    <th className="p-4">Book Title</th>
                    <th className="p-4">Date Issued</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4 text-center">Fines Accrued</th>
                    <th className="p-4 text-center">Status</th>
                    {isAdmin ? <th className="p-4 text-center">Actions</th> : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-350">
                  {borrowList.map((log) => {
                    const studentName = log.student?.user
                      ? `${log.student.user.firstName} ${log.student.user.lastName}`
                      : `ID: ${log.student?.studentId || "Student"}`;

                    return (
                      <tr key={log._id} className="hover:bg-slate-900/10">
                        <td className="p-4 font-bold text-white">{studentName}</td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-300">{log.book?.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{log.book?.isbn}</p>
                        </td>
                        <td className="p-4 text-slate-400">{formatDate(log.borrowDate)}</td>
                        <td className="p-4 text-slate-400">{formatDate(log.dueDate)}</td>
                        <td className="p-4 text-center">
                          {log.fineAmount > 0 ? (
                            <span className="font-bold text-rose-455">${log.fineAmount}</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full font-bold border text-[9px] ${getStatusBadge(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        {isAdmin ? (
                          <td className="p-4 text-center">
                            {log.status === "BORROWED" ? (
                              <div className="flex justify-center gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border-emerald-500/20 bg-emerald-500/10 text-emerald-450 hover:bg-emerald-500 hover:text-white"
                                  onClick={() => handleReturnAction(log._id, false)}
                                  disabled={isReturning}
                                >
                                  Return
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-red-500 hover:text-white"
                                  onClick={() => handleReturnAction(log._id, true)}
                                  disabled={isReturning}
                                >
                                  Lost
                                </Button>
                              </div>
                            ) : log.fineAmount > 0 ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-slate-805 bg-slate-900/40 text-slate-400 hover:text-white"
                                onClick={() => handleWaive(log._id)}
                                disabled={isWaiving}
                              >
                                Waive Fine
                              </Button>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 italic text-center p-8">No borrow logs cataloged matching parameters.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
