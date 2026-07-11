"use client";

import { useState, useMemo } from "react";
import { Calendar, Clock, Plus, Trash2, CalendarDays, Loader2, Bookmark, MapPin } from "lucide-react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useAcademicEventsQuery,
  useCreateAcademicEventMutation,
  useDeleteAcademicEventMutation,
} from "@/features/academic";
import { RootState } from "@/store";

export default function AcademicCalendarPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role?.name || "";
  const isAdmin = role === "ADMIN";

  // Form states for new event
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"EXAM" | "HOLIDAY" | "WORKSHOP" | "ACTIVITY">("ACTIVITY");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const { data: eventList, isLoading } = useAcademicEventsQuery();
  const { mutate: createEvent, isPending: isCreating } = useCreateAcademicEventMutation();
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteAcademicEventMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) return;

    createEvent({
      title,
      category,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      description,
    }, {
      onSuccess: () => {
        setTitle("");
        setCategory("ACTIVITY");
        setStartDate("");
        setEndDate("");
        setDescription("");
      }
    });
  };

  const handleDelete = (id: string, eventTitle: string) => {
    if (window.confirm(`Delete calendar event: "${eventTitle}"?`)) {
      deleteEvent(id);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "EXAM":
        return "bg-rose-500/10 text-rose-455 border-rose-500/20";
      case "HOLIDAY":
        return "bg-amber-500/10 text-amber-450 border-amber-500/20";
      case "WORKSHOP":
        return "bg-indigo-500/10 text-indigo-455 border-indigo-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-450 border-emerald-500/20";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Title Header */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-indigo-400" /> University Academic Calendar
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Stay updated on upcoming exams, workshops, events, and official holidays.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Create event form (Admins only) */}
        {isAdmin && (
          <Card className="lg:col-span-1 border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl h-fit animate-in slide-in-from-left duration-300">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
              <Plus className="h-4.5 w-4.5 text-indigo-400" /> Log Calendar Event
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Event Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Mid-Term Semester Exams"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-350 focus:outline-none focus:ring-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Category select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                <select
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  <option value="ACTIVITY" className="bg-slate-950">Campus Activity</option>
                  <option value="EXAM" className="bg-slate-950">Exams / Assessments</option>
                  <option value="HOLIDAY" className="bg-slate-950">Holiday / Break</option>
                  <option value="WORKSHOP" className="bg-slate-950">Workshop / Seminar</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Start Date & Time</label>
                <input
                  required
                  type="datetime-local"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* End Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">End Date & Time</label>
                <input
                  required
                  type="datetime-local"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Event Description</label>
                <textarea
                  placeholder="Optional details..."
                  rows={3}
                  className="w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-350 focus:outline-none focus:ring-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={isCreating}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-9 mt-4"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Post Event on Calendar"
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Schedule details panel */}
        <Card className={`border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl ${isAdmin ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="pb-3 border-b border-slate-900">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-indigo-400" /> Upcoming Schedules & Events
            </h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            </div>
          ) : eventList?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eventList.map((item: any) => (
                <Card
                  key={item._id}
                  className="bg-slate-950/20 border border-slate-900/80 p-4 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-colors animate-in zoom-in-95"
                >
                  <div className="space-y-2">
                    {/* Header: tag + delete */}
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(item._id, item.title)}
                          disabled={isDeleting}
                          className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-900 cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-white">{item.title}</h4>
                    {item.description && (
                      <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{item.description}</p>
                    )}
                  </div>

                  <div className="border-t border-slate-900/60 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" />
                      {formatDate(item.startDate)}
                    </span>
                    <span>to {formatDate(item.endDate)}</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 italic">
              No events scheduled on academic calendar.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
