"use client";

import { Megaphone, Calendar, User, ShieldAlert } from "lucide-react";
import type { Announcement } from "../types/communication.types";

interface AnnouncementsListProps {
  announcements: Announcement[];
}

export default function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  const getInitials = (user: any) => {
    if (!user) return "?";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-4">
      {announcements.length ? (
        announcements.map((announcement) => (
          <div
            key={announcement._id}
            className="p-5 border border-slate-900 bg-slate-950/40 rounded-xl backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-200"
          >
            {/* Ambient hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex items-start gap-4">
              {/* Publisher avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 shrink-0">
                {getInitials(announcement.createdBy)}
              </div>

              {/* Detail block */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                      {announcement.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                      <User className="h-3 w-3 shrink-0" />
                      Published by: {announcement.createdBy ? `${announcement.createdBy.firstName} ${announcement.createdBy.lastName}` : "System Admin"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{new Date(announcement.publishAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Message body */}
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {announcement.message}
                </p>

                {/* Target roles tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                    Target:
                  </span>
                  {announcement.targetRoles.map((role) => (
                    <span
                      key={role}
                      className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900 text-[9px] text-slate-400 font-bold"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-12 text-center border border-slate-900/60 bg-slate-950/10 rounded-xl text-slate-500 text-xs italic flex flex-col items-center gap-2">
          <Megaphone className="h-6 w-6 text-slate-650" />
          No announcements published recently. Check back later for campus notices.
        </div>
      )}
    </div>
  );
}
