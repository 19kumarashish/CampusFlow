"use client";

import { useState, useMemo } from "react";
import { Landmark, Plus, Clipboard, Send, Loader2, Receipt, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCoursesQuery } from "@/features/courses";
import {
  useFeeStructuresQuery,
  useCreateFeeStructureMutation,
  useAssignFeesMutation,
  useLedgersQuery,
  useInvoicesQuery,
} from "@/features/finance";
import { RootState } from "@/store";

export default function FeesManagementPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role?.name || "";
  const isAdmin = role === "ADMIN";
  const isStudent = role === "STUDENT";

  const [activeTab, setActiveTab] = useState<"TEMPLATES" | "LEDGERS" | "INVOICES">("LEDGERS");

  // Form states for fee structures
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"TUITION" | "EXAM" | "HOSTEL" | "OTHER">("TUITION");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [finePerDay, setFinePerDay] = useState("");
  const [courseId, setCourseId] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-2027");

  // Query Courses list
  const { data: coursesData } = useCoursesQuery({ limit: 100, status: "ACTIVE" });
  const activeCourses = useMemo(() => coursesData?.courses || [], [coursesData?.courses]);

  // Student specific parameters
  const [studentProfileId, setStudentProfileId] = useState("");
  // In a real application, lookup student profile if student is logged in
  const studentLedgerParams = useMemo(() => {
    return {
      studentId: isStudent ? user?._id : undefined, // simulation: fetch by user ID
    };
  }, [isStudent, user?._id]);

  // Queries
  const { data: structures, isLoading: isTemplatesLoading } = useFeeStructuresQuery();
  const { data: ledgers, isLoading: isLedgerLoading } = useLedgersQuery(studentLedgerParams);
  const { data: invoices, isLoading: isInvoiceLoading } = useInvoicesQuery(studentLedgerParams);

  // Mutations
  const { mutate: createStructure, isPending: isCreating } = useCreateFeeStructureMutation();
  const { mutate: assignFees, isPending: isAssigning } = useAssignFeesMutation();

  const handleCreateStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !dueDate || !courseId) return;

    createStructure({
      name,
      category,
      amount: Number(amount),
      dueDate: new Date(dueDate).toISOString(),
      finePerDay: Number(finePerDay || 0),
      course: courseId,
      academicYear,
    }, {
      onSuccess: () => {
        setName("");
        setCategory("TUITION");
        setAmount("");
        setDueDate("");
        setFinePerDay("");
        setCourseId("");
        setAcademicYear("2026-2027");
        setActiveTab("TEMPLATES");
      }
    });
  };

  const handleAssign = (structureId: string) => {
    if (window.confirm("Assign this fee structure to all enrolled course students?")) {
      assignFees({ feeStructureId: structureId });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-500/10 text-emerald-450 border-emerald-500/20";
      case "PARTIAL":
        return "bg-amber-500/10 text-amber-450 border-amber-500/20 animate-pulse";
      default:
        return "bg-rose-500/10 text-rose-455 border-rose-500/20";
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
          <Landmark className="h-6 w-6 text-indigo-400" /> Fees & Billing Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Set up fee categories, assign billing schedules, view ledgers, and manage invoices.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-900 gap-6 text-xs uppercase tracking-wider font-extrabold pb-3">
        <button
          className={`pb-1 cursor-pointer transition-all border-b-2 ${activeTab === "LEDGERS" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          onClick={() => setActiveTab("LEDGERS")}
        >
          Outstanding Balance ledgers
        </button>
        <button
          className={`pb-1 cursor-pointer transition-all border-b-2 ${activeTab === "INVOICES" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          onClick={() => setActiveTab("INVOICES")}
        >
          Bills & Invoices Roster
        </button>
        {isAdmin && (
          <button
            className={`pb-1 cursor-pointer transition-all border-b-2 ${activeTab === "TEMPLATES" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            onClick={() => setActiveTab("TEMPLATES")}
          >
            Fee Category templates
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Templates Creation form (Admins only) */}
        {isAdmin && activeTab === "TEMPLATES" && (
          <Card className="lg:col-span-1 border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl h-fit">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
              <Plus className="h-4.5 w-4.5 text-indigo-400" /> Define Fee Template
            </h3>
            <form onSubmit={handleCreateStructure} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Fee Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Tuition Semester 3"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-350 focus:outline-none focus:ring-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                <select
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  <option value="TUITION" className="bg-slate-955">Tuition Fee</option>
                  <option value="EXAM" className="bg-slate-955">Examination Fee</option>
                  <option value="HOSTEL" className="bg-slate-955">Hostel Rental</option>
                  <option value="OTHER" className="bg-slate-955">Misc Expense</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Fee Amount ($)</label>
                <input
                  required
                  type="number"
                  min={0}
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-350 focus:outline-none focus:ring-1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Due Date</label>
                <input
                  required
                  type="date"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Overdue Fine Per Day ($)</label>
                <input
                  type="number"
                  min={0}
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-350 focus:outline-none"
                  value={finePerDay}
                  onChange={(e) => setFinePerDay(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Degree Program</label>
                <select
                  required
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="">Select Course Degree</option>
                  {activeCourses.map((c) => (
                    <option key={c._id} value={c._id} className="bg-slate-950">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Academic Year</label>
                <input
                  type="text"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={isCreating}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-9 mt-4"
              >
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Fee Template"}
              </Button>
            </form>
          </Card>
        )}

        {/* Dynamic Display cards depending on active tab */}
        <Card className={`border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl ${isAdmin && activeTab === "TEMPLATES" ? "lg:col-span-2" : "lg:col-span-3"}`}>
          {activeTab === "TEMPLATES" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-900">
                <Clipboard className="h-4.5 w-4.5 text-indigo-400" /> Active Fee Category templates
              </h3>
              {isTemplatesLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
              ) : structures?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-bold uppercase text-[10px]">
                        <th className="p-4">Template Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-center">Amount</th>
                        <th className="p-4">Target Course</th>
                        <th className="p-4">Due Date</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60 text-slate-350">
                      {structures.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-900/10">
                          <td className="p-4 font-bold text-white">{item.name}</td>
                          <td className="p-4">{item.category}</td>
                          <td className="p-4 text-center font-bold text-slate-205">${item.amount}</td>
                          <td className="p-4">{item.course?.name || "Global"}</td>
                          <td className="p-4 text-slate-400">{formatDate(item.dueDate)}</td>
                          <td className="p-4 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-indigo-500/20 bg-indigo-500/10 text-indigo-455 hover:bg-indigo-500 hover:text-white"
                              onClick={() => handleAssign(item._id)}
                              disabled={isAssigning}
                            >
                              <Send className="mr-1 h-3 w-3" /> Assign Bills
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 italic text-center p-8">No templates defined.</p>
              )}
            </div>
          )}

          {activeTab === "LEDGERS" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-900">
                <Receipt className="h-4.5 w-4.5 text-indigo-400" /> Outstanding ledgers
              </h3>
              {isLedgerLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
              ) : ledgers?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-bold uppercase text-[10px]">
                        <th className="p-4">Student</th>
                        <th className="p-4">Structure</th>
                        <th className="p-4 text-center">Paid Amount</th>
                        <th className="p-4 text-center">Waiver / Discount</th>
                        <th className="p-4 text-center">Balance Due</th>
                        <th className="p-4 text-center">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60 text-slate-350">
                      {ledgers.map((ledger) => {
                        const studentName = ledger.student?.user
                          ? `${ledger.student.user.firstName} ${ledger.student.user.lastName}`
                          : `ID: ${ledger.student?.studentId || "Student"}`;

                        return (
                          <tr key={ledger._id} className="hover:bg-slate-900/10">
                            <td className="p-4 font-bold text-white">{studentName}</td>
                            <td className="p-4">{ledger.feeStructure?.name || "General Term"}</td>
                            <td className="p-4 text-center font-bold text-slate-205">${ledger.amountPaid}</td>
                            <td className="p-4 text-center text-slate-400">${ledger.discount}</td>
                            <td className="p-4 text-center font-extrabold text-white">${ledger.balanceAmount}</td>
                            <td className="p-4 text-center">
                              <span className={`inline-flex px-2 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(ledger.status)}`}>
                                {ledger.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 italic text-center p-8">No ledger history logged.</p>
              )}
            </div>
          )}

          {activeTab === "INVOICES" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-900">
                <AlertCircle className="h-4.5 w-4.5 text-indigo-400" /> Billing Invoices
              </h3>
              {isInvoiceLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
              ) : invoices?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-bold uppercase text-[10px]">
                        <th className="p-4">Invoice #</th>
                        <th className="p-4">Student</th>
                        <th className="p-4 text-center">Amount Due</th>
                        <th className="p-4">Due Date</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60 text-slate-350">
                      {invoices.map((inv) => {
                        const studentName = inv.student?.user
                          ? `${inv.student.user.firstName} ${inv.student.user.lastName}`
                          : `ID: ${inv.student?.studentId || "Student"}`;

                        return (
                          <tr key={inv._id} className="hover:bg-slate-900/10">
                            <td className="p-4 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                            <td className="p-4">{studentName}</td>
                            <td className="p-4 text-center font-bold text-white">${inv.amount}</td>
                            <td className="p-4 text-slate-400">{formatDate(inv.dueDate)}</td>
                            <td className="p-4 text-center">
                              <span className={`inline-flex px-2 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(inv.status)}`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-slate-805 bg-slate-900/40 text-slate-400 hover:text-white"
                                onClick={() => window.print()}
                              >
                                Print Invoice
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 italic text-center p-8">No invoice history found.</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
