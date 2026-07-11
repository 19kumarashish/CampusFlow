"use client";

import { useState, useMemo } from "react";
import { Award, Plus, Clipboard, UserCheck, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStudentsQuery } from "@/features/students";
import {
  useScholarshipsQuery,
  useCreateScholarshipMutation,
  useAllocateScholarshipMutation,
  useScholarshipAllocationsQuery,
} from "@/features/finance";
import { RootState } from "@/store";

export default function ScholarshipsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role?.name || "";
  const isAdmin = role === "ADMIN";

  // Form states for creating scholarship templates
  const [name, setName] = useState("");
  const [type, setType] = useState<"MERIT" | "NEED" | "SPECIAL">("MERIT");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [criteria, setCriteria] = useState("");

  // Allocation form states
  const [studentId, setStudentId] = useState("");
  const [scholarshipId, setScholarshipId] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-2027");

  // Queries
  const { data: studentsData } = useStudentsQuery({ limit: 100, status: "ACTIVE" as any });
  const activeStudents = useMemo(() => studentsData?.students || [], [studentsData?.students]);

  const { data: scholarships, isLoading: isCatalogLoading } = useScholarshipsQuery();
  const { data: allocations, isLoading: isAllocLoading } = useScholarshipAllocationsQuery();

  // Mutations
  const { mutate: createScholarship, isPending: isCreating } = useCreateScholarshipMutation();
  const { mutate: allocateScholarship, isPending: isAllocating } = useAllocateScholarshipMutation();

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !discountPercentage || !criteria) return;

    createScholarship({
      name,
      type,
      discountPercentage: Number(discountPercentage),
      criteria,
    }, {
      onSuccess: () => {
        setName("");
        setDiscountPercentage("");
        setCriteria("");
      }
    });
  };

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !scholarshipId) return;

    allocateScholarship({
      studentId,
      scholarshipId,
      academicYear,
    }, {
      onSuccess: () => {
        setStudentId("");
        setScholarshipId("");
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Title */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Award className="h-6 w-6 text-indigo-400" /> Scholarships & Waivers Hub
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Catalog scholarship schemes, verify student allocations, and apply tuition waivers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Create template form (Admins only) */}
        {isAdmin && (
          <div className="space-y-6 lg:col-span-1">
            <Card className="border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl h-fit">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
                <Plus className="h-4.5 w-4.5 text-indigo-400" /> Define Scholarship Scheme
              </h3>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Scheme Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Merit Academic Waiver 30%"
                    className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-355 focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Waiver Type</label>
                  <select
                    className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none"
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                  >
                    <option value="MERIT" className="bg-slate-955">Merit-Based</option>
                    <option value="NEED" className="bg-slate-955">Financial Need-Based</option>
                    <option value="SPECIAL" className="bg-slate-955">Special Case Waiver</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Discount Percentage (%)</label>
                  <input
                    required
                    type="number"
                    min={0}
                    max={100}
                    placeholder="e.g. 30"
                    className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-355 focus:outline-none"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Eligibility Criteria</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. GPA score >= 3.8"
                    className="w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-355 focus:outline-none"
                    value={criteria}
                    onChange={(e) => setCriteria(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-9 mt-4"
                >
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Scheme"}
                </Button>
              </form>
            </Card>

            {/* Allocate form */}
            <Card className="border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl h-fit">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
                <UserCheck className="h-4.5 w-4.5 text-indigo-400" /> Allocate Scholarship
              </h3>
              <form onSubmit={handleAllocateSubmit} className="space-y-4">
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
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Scholarship Scheme</label>
                  <select
                    required
                    className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none"
                    value={scholarshipId}
                    onChange={(e) => setScholarshipId(e.target.value)}
                  >
                    <option value="">Select Scholarship Scheme</option>
                    {scholarships?.map((s) => (
                      <option key={s._id} value={s._id} className="bg-slate-950">
                        {s.name} ({s.discountPercentage}%)
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
                  disabled={isAllocating}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-9 mt-4"
                >
                  {isAllocating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Allocate Scholarship"}
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* Display allocations list */}
        <Card className={`border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl ${isAdmin ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-900">
              <Clipboard className="h-4.5 w-4.5 text-indigo-400" /> Active Tuition Discount Allocations
            </h3>

            {isAllocLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
            ) : allocations?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-bold uppercase text-[10px]">
                      <th className="p-4">Student</th>
                      <th className="p-4">Granted Scholarship</th>
                      <th className="p-4 text-center">Discount Percentage</th>
                      <th className="p-4 text-center">Allocated Value</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 text-slate-350">
                    {allocations.map((alloc) => {
                      const studentName = alloc.student?.user
                        ? `${alloc.student.user.firstName} ${alloc.student.user.lastName}`
                        : `ID: ${alloc.student?.studentId || "Student"}`;

                      return (
                        <tr key={alloc._id} className="hover:bg-slate-900/10">
                          <td className="p-4 font-bold text-white">{studentName}</td>
                          <td className="p-4">{alloc.scholarship?.name || "General Waiver"}</td>
                          <td className="p-4 text-center font-bold text-slate-205">{alloc.scholarship?.discountPercentage}%</td>
                          <td className="p-4 text-center font-extrabold text-white">${alloc.allocatedAmount}</td>
                          <td className="p-4 text-center">
                            <span className="inline-flex px-2 py-0.5 rounded-full font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-450 text-[10px]">
                              {alloc.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 italic text-center p-8">No scholarship allocations recorded.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
