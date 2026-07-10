"use client";

import { Bell, Check, CheckSquare, Calendar, Award, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMarkReadMutation, useMarkAllReadMutation } from "../hooks/communication.hooks";
import type { Notification } from "../types/communication.types";

interface NotificationsListProps {
  notifications: Notification[];
}

export default function NotificationsList({ notifications }: NotificationsListProps) {
  const { mutate: markAsRead } = useMarkReadMutation();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllReadMutation();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ASSIGNMENT":
        return <FileText className="h-4 w-4 text-indigo-400" />;
      case "EXAMINATION":
        return <Calendar className="h-4 w-4 text-amber-455" />;
      case "RESULT":
        return <Award className="h-4 w-4 text-emerald-400" />;
      case "ANNOUNCEMENT":
        return <Bell className="h-4 w-4 text-sky-400" />;
      default:
        return <Info className="h-4 w-4 text-slate-450" />;
    }
  };

  const hasUnread = notifications.some((n) => n.status === "UNREAD");

  return (
    <div className="space-y-4">
      {/* Control row */}
      <div className="flex justify-between items-center bg-slate-950/20 px-4 py-2 border border-slate-900 rounded-xl">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          In-App Alerts ({notifications.length} Logs)
        </span>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isMarkingAll}
            className="h-7 text-indigo-400 hover:text-white gap-1 text-[10px] font-bold"
            onClick={() => markAllAsRead()}
          >
            <CheckSquare className="h-3.5 w-3.5" /> Mark all read
          </Button>
        )}
      </div>

      {/* Notifications list feed */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
        {notifications.length ? (
          notifications.map((notification) => {
            const isUnread = notification.status === "UNREAD";
            return (
              <div
                key={notification._id}
                onClick={() => isUnread && markAsRead(notification._id)}
                className={`p-3.5 rounded-xl border transition-all duration-200 flex gap-3.5 items-start
                  ${
                    isUnread
                      ? "bg-indigo-500/5 border-indigo-500/20 hover:bg-indigo-500/10 cursor-pointer"
                      : "bg-slate-950/30 border-slate-900 hover:border-slate-800"
                  }
                `}
              >
                {/* Icon box */}
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border shrink-0
                  ${
                    isUnread
                      ? "bg-indigo-500/10 border-indigo-500/20"
                      : "bg-slate-900 border-slate-800"
                  }
                `}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-xs font-bold leading-tight truncate ${isUnread ? "text-white" : "text-slate-350"}`}>
                      {notification.title}
                    </p>
                    <span className="text-[9px] text-slate-500 shrink-0 font-medium">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-450 mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                </div>

                {/* Unread circle badge */}
                {isUnread && (
                  <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 self-center shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                )}
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center text-slate-500 text-xs italic border border-slate-900/60 bg-slate-950/10 rounded-xl flex flex-col items-center gap-2">
            <Bell className="h-6 w-6 text-slate-650" />
            Your notifications inbox is empty.
          </div>
        )}
      </div>
    </div>
  );
}
