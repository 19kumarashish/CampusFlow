"use client";

import { useState, useMemo } from "react";
import { CreditCard, Landmark, Clipboard, ArrowRight, Loader2, RefreshCcw, DollarSign } from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStudents } from "@/features/students";
import {
  useLedgersQuery,
  useExecutePaymentMutation,
  usePaymentHistoryQuery,
  useRefundPaymentMutation,
} from "@/features/finance";
import { RootState } from "@/store";

export default function PaymentsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role?.name || "";
  const isAdmin = role === "ADMIN";
  const isStudent = role === "STUDENT";

  const [checkoutLedgerId, setCheckoutLedgerId] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "CASH" | "CHEQUE">("ONLINE");

  // simulated student selector for admin
  const [studentProfileId, setStudentProfileId] = useState("");

  // Query student details if logged-in user is a student
  const { data: studentData } = useQuery({
    queryKey: ["students", { limit: 1, search: user?.email || "" }],
    queryFn: () => getStudents({ limit: 1, search: user?.email || "" }),
    enabled: isStudent && !!user?.email,
  });
  const studentProfile = useMemo(() => studentData?.students[0], [studentData?.students]);
  const activeStudentId = isStudent ? studentProfile?._id : studentProfileId;

  // Query outstanding ledger items for student
  const { data: ledgers } = useLedgersQuery({ studentId: activeStudentId });
  const activeLedgers = useMemo(() => ledgers || [], [ledgers]);

  const selectedLedger = useMemo(() => {
    return activeLedgers.find((l) => l._id === checkoutLedgerId);
  }, [checkoutLedgerId, activeLedgers]);

  // Query payment history
  const historyParams = useMemo(() => {
    return {
      studentId: isStudent ? studentProfile?._id : undefined,
    };
  }, [isStudent, studentProfile?._id]);

  const { data: payHistory, isLoading: isHistoryLoading } = usePaymentHistoryQuery(historyParams);

  // Mutations
  const { mutate: chargePayment, isPending: isPaying } = useExecutePaymentMutation();
  const { mutate: refundPayment, isPending: isRefundating } = useRefundPaymentMutation();

  const handleChargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudentId || !checkoutLedgerId || !payAmount) return;

    chargePayment({
      studentId: activeStudentId,
      ledgerId: checkoutLedgerId,
      amount: Number(payAmount),
      paymentMethod,
    }, {
      onSuccess: () => {
        setCheckoutLedgerId("");
        setPayAmount("");
        setPaymentMethod("ONLINE");
      }
    });
  };

  const handleRefund = (id: string) => {
    if (window.confirm("Are you sure you want to refund this payment transaction?")) {
      refundPayment(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Title */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-indigo-400" /> Payment & Transactions Processor
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Perform direct checkout charges, simulation gateways, and check historical balance adjustments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Checkout portal (Students / Admins) */}
        {(!isAdmin || studentProfileId) && (
          <Card className="lg:col-span-1 border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl h-fit">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
              <DollarSign className="h-4.5 w-4.5 text-indigo-400" /> Direct Checkout Sheet
            </h3>
            <form onSubmit={handleChargeSubmit} className="space-y-4">
              {/* Select Ledger record */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Outstanding fee item</label>
                <select
                  required
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none"
                  value={checkoutLedgerId}
                  onChange={(e) => setCheckoutLedgerId(e.target.value)}
                >
                  <option value="">Select Fee Ledger</option>
                  {activeLedgers
                    .filter((l) => l.status !== "PAID")
                    .map((l) => (
                      <option key={l._id} value={l._id} className="bg-slate-950">
                        {l.feeStructure?.name} - Due: ${l.balanceAmount}
                      </option>
                    ))}
                </select>
              </div>

              {selectedLedger && (
                <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-3 text-slate-400 text-[11px] space-y-1.5">
                  <p>Fee template amount: <span className="font-bold text-white">${selectedLedger.feeStructure?.amount}</span></p>
                  <p>Discounts Applied: <span className="font-bold text-white">${selectedLedger.discount}</span></p>
                  <p>Balance Due: <span className="font-extrabold text-white text-xs">${selectedLedger.balanceAmount}</span></p>
                </div>
              )}

              {/* Amount to pay */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Payment Amount ($)</label>
                <input
                  required
                  type="number"
                  min={1}
                  max={selectedLedger ? selectedLedger.balanceAmount : undefined}
                  placeholder="e.g. 500"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-350 focus:outline-none"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                />
              </div>

              {/* Method */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Gateway Option</label>
                <select
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                >
                  <option value="ONLINE" className="bg-slate-950">Credit / Debit Card (Online simulation)</option>
                  <option value="CASH" className="bg-slate-950">Cash Collection (Offline)</option>
                  <option value="CHEQUE" className="bg-slate-950">Cheque / DD deposit</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={!checkoutLedgerId || !payAmount || isPaying}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-9 mt-4"
              >
                {isPaying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-1">
                    Charge Ledger <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Payment History List */}
        <Card className={`border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl ${!isAdmin ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-900">
              <Clipboard className="h-4.5 w-4.5 text-indigo-400" /> Transaction Audit trail
            </h3>

            {isHistoryLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
            ) : payHistory?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-bold uppercase text-[10px]">
                      <th className="p-4">Receipt # / Txn ID</th>
                      <th className="p-4">Student</th>
                      <th className="p-4">Fee Item</th>
                      <th className="p-4 text-center">Amount Paid</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-center">Status</th>
                      {isAdmin ? <th className="p-4 text-center">Actions</th> : null}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 text-slate-350">
                    {payHistory.map((pay) => {
                      const studentName = pay.student?.user
                        ? `${pay.student.user.firstName} ${pay.student.user.lastName}`
                        : `ID: ${pay.student?.studentId || "Student"}`;

                      return (
                        <tr key={pay._id} className="hover:bg-slate-900/10">
                          <td className="p-4">
                            <p className="font-mono font-bold text-white">{pay.receiptNumber}</p>
                            <p className="text-[9px] text-slate-500 font-mono mt-0.5">{pay.transactionId}</p>
                          </td>
                          <td className="p-4">{studentName}</td>
                          <td className="p-4">{pay.ledger?.feeStructure?.name || "Term Fee"}</td>
                          <td className="p-4 text-center font-bold text-slate-205">${pay.amount}</td>
                          <td className="p-4 text-slate-400">{new Date(pay.createdAt).toLocaleDateString()}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full font-bold border text-[9px]
                              ${pay.status === "SUCCESS"
                                ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-455 border-rose-500/20"
                              }
                            `}>
                              {pay.status}
                            </span>
                          </td>
                          {isAdmin ? (
                            <td className="p-4 text-center">
                              {pay.status === "SUCCESS" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-red-500 hover:text-white"
                                  onClick={() => handleRefund(pay._id)}
                                  disabled={isRefundating}
                                >
                                  <RefreshCcw className="mr-1 h-3 w-3" /> Refund
                                </Button>
                              ) : (
                                <span className="text-[10px] text-slate-600">-</span>
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
              <p className="text-slate-500 italic text-center p-8">No transaction history recorded.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
