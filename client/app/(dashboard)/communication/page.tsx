"use client";

import { useState } from "react";
import { Megaphone, Bell, Settings, Plus, Loader2, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

import { RootState } from "@/store";
import { Button } from "@/components/ui/button";

import {
  AnnouncementsList,
  AnnouncementDialog,
  NotificationsList,
  PreferencesForm,
  useAnnouncementsQuery,
  useNotificationsQuery,
} from "@/features/communication";

export default function CommunicationPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role?.name || "";
  const isAdmin = role === "ADMIN";

  const [activeView, setActiveView] = useState<"FEED" | "ALERTS" | "SETTINGS">("FEED");
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

  // Queries
  const {
    data: announcements = [],
    isLoading: isAnnouncementsLoading,
    isError: isAnnouncementsError,
    refetch: refetchAnnouncements,
  } = useAnnouncementsQuery();

  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    isError: isNotificationsError,
    refetch: refetchNotifications,
  } = useNotificationsQuery({ limit: 100 });

  const notifications = notificationsData?.notifications || [];

  const handleCreateAnnouncement = () => {
    setIsAnnouncementOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-indigo-400" /> Communications & Notices
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Broadcast official notices, view alert logs, or configure push alert preferences.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={handleCreateAnnouncement}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/15"
          >
            <Plus className="mr-1 h-4 w-4" /> Compose Announcement
          </Button>
        )}
      </div>

      {/* Grid Layout (Sidebar tabs on left, content panel on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar Panel */}
        <div className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveView("FEED")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border text-left cursor-pointer
              ${
                activeView === "FEED"
                  ? "bg-primary/10 text-primary border-primary/20 shadow-md"
                  : "text-slate-400 hover:bg-slate-900/40 hover:text-white border-transparent"
              }
            `}
          >
            <Megaphone className="h-4.5 w-4.5" />
            <span>Campus Notice Board</span>
          </button>
          <button
            onClick={() => setActiveView("ALERTS")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border text-left cursor-pointer
              ${
                activeView === "ALERTS"
                  ? "bg-primary/10 text-primary border-primary/20 shadow-md"
                  : "text-slate-400 hover:bg-slate-900/40 hover:text-white border-transparent"
              }
            `}
          >
            <Bell className="h-4.5 w-4.5" />
            <span>Inbox Alerts</span>
          </button>
          <button
            onClick={() => setActiveView("SETTINGS")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border text-left cursor-pointer
              ${
                activeView === "SETTINGS"
                  ? "bg-primary/10 text-primary border-primary/20 shadow-md"
                  : "text-slate-400 hover:bg-slate-900/40 hover:text-white border-transparent"
              }
            `}
          >
            <Settings className="h-4.5 w-4.5" />
            <span>Preferences Settings</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-9">
          {activeView === "FEED" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">
                  Campus Announcements Timeline
                </h3>
              </div>
              {isAnnouncementsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 border border-slate-900 rounded-xl bg-slate-950/20">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-xs text-slate-400 mt-3 font-medium">Loading notice board feed...</p>
                </div>
              ) : isAnnouncementsError ? (
                <div className="text-center p-12 bg-slate-900/10 border border-slate-850 rounded-xl">
                  <p className="text-red-400 text-xs font-semibold">Failed to fetch notice board announcements.</p>
                  <Button size="sm" variant="outline" className="mt-3 border-slate-800 text-white text-xs" onClick={() => refetchAnnouncements()}>
                    Retry
                  </Button>
                </div>
              ) : (
                <AnnouncementsList announcements={announcements} />
              )}
            </div>
          )}

          {activeView === "ALERTS" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">
                  Inbox Notifications
                </h3>
              </div>
              {isNotificationsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 border border-slate-900 rounded-xl bg-slate-950/20">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-xs text-slate-400 mt-3 font-medium">Resolving your notification alerts...</p>
                </div>
              ) : isNotificationsError ? (
                <div className="text-center p-12 bg-slate-900/10 border border-slate-850 rounded-xl">
                  <p className="text-red-400 text-xs font-semibold">Failed to fetch unread notification count.</p>
                  <Button size="sm" variant="outline" className="mt-3 border-slate-800 text-white text-xs" onClick={() => refetchNotifications()}>
                    Retry
                  </Button>
                </div>
              ) : (
                <NotificationsList notifications={notifications} />
              )}
            </div>
          )}

          {activeView === "SETTINGS" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">
                  Alert Trigger Preferences
                </h3>
              </div>
              <PreferencesForm />
            </div>
          )}
        </div>
      </div>

      {/* Compose Announcement dialog (Admin Only) */}
      {isAdmin && (
        <AnnouncementDialog
          isOpen={isAnnouncementOpen}
          onClose={() => setIsAnnouncementOpen(false)}
        />
      )}
    </div>
  );
}
