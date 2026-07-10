"use client";

import { useState } from "react";
import { Loader2, Save, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdatePreferenceMutation } from "../hooks/communication.hooks";

export default function PreferencesForm() {
  const { mutate: savePreferences, isPending } = useUpdatePreferenceMutation();

  // Local state initialized to true (default upsert)
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [inAppEnabled, setInAppEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  const [assignments, setAssignments] = useState(true);
  const [exams, setExams] = useState(true);
  const [results, setResults] = useState(true);
  const [announcements, setAnnouncements] = useState(true);
  const [attendance, setAttendance] = useState(true);
  const [system, setSystem] = useState(true);

  const handleSave = () => {
    savePreferences({
      emailEnabled,
      inAppEnabled,
      pushEnabled,
      assignmentNotifications: assignments,
      examinationNotifications: exams,
      resultNotifications: results,
      announcementNotifications: announcements,
      attendanceNotifications: attendance,
      systemNotifications: system,
    });
  };

  return (
    <div className="p-5 border border-slate-900 bg-slate-950/40 rounded-xl backdrop-blur-xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
        <Settings className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Notification Preferences
        </h3>
      </div>

      <div className="space-y-4">
        {/* Core Channels */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Alert Delivery Channels
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-900 bg-slate-950/20 text-xs text-slate-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20 bg-background/50 h-4.5 w-4.5"
                disabled={isPending}
              />
              <span>Email Messages</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-900 bg-slate-950/20 text-xs text-slate-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={inAppEnabled}
                onChange={(e) => setInAppEnabled(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20 bg-background/50 h-4.5 w-4.5"
                disabled={isPending}
              />
              <span>In-App Alerts</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-900 bg-slate-950/20 text-xs text-slate-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={pushEnabled}
                onChange={(e) => setPushEnabled(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20 bg-background/50 h-4.5 w-4.5"
                disabled={isPending}
              />
              <span>Web Push</span>
            </label>
          </div>
        </div>

        {/* Feature Triggers */}
        <div className="space-y-3 pt-3 border-t border-slate-900/60">
          <h4 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Topic Notifications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-900 bg-slate-950/20 text-xs text-slate-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={assignments}
                onChange={(e) => setAssignments(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20 bg-background/50 h-4.5 w-4.5"
                disabled={isPending}
              />
              <span>Assignments Updates</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-900 bg-slate-950/20 text-xs text-slate-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={exams}
                onChange={(e) => setExams(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20 bg-background/50 h-4.5 w-4.5"
                disabled={isPending}
              />
              <span>Examinations Schedules</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-900 bg-slate-950/20 text-xs text-slate-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={results}
                onChange={(e) => setResults(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20 bg-background/50 h-4.5 w-4.5"
                disabled={isPending}
              />
              <span>Final Semester GPAs</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-900 bg-slate-950/20 text-xs text-slate-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={announcements}
                onChange={(e) => setAnnouncements(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20 bg-background/50 h-4.5 w-4.5"
                disabled={isPending}
              />
              <span>Broadcast Announcements</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-900 bg-slate-950/20 text-xs text-slate-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={attendance}
                onChange={(e) => setAttendance(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20 bg-background/50 h-4.5 w-4.5"
                disabled={isPending}
              />
              <span>Attendance Updates</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-900 bg-slate-950/20 text-xs text-slate-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={system}
                onChange={(e) => setSystem(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20 bg-background/50 h-4.5 w-4.5"
                disabled={isPending}
              />
              <span>System & Security Notices</span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-3 border-t border-slate-900/60">
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5 text-xs font-semibold px-5"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Configuration
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
