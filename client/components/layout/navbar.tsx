"use client";

import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  UserCheck,
  Menu,
  ChevronRight,
  GraduationCap
} from "lucide-react";

import { RootState } from "@/store";
import { useLogoutMutation } from "@/features/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  useUnreadCountQuery,
  useNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation
} from "@/features/communication";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);
  const { mutate: logOutUser, isPending: isLoggingOut } = useLogoutMutation();

  // Queries & Mutations for notifications popover
  const { data: unreadData } = useUnreadCountQuery(!!user?._id);
  const { data: notificationsData } = useNotificationsQuery({ limit: 5 });
  const { mutate: markAsRead } = useMarkReadMutation();
  const { mutate: markAllAsRead } = useMarkAllReadMutation();

  const unreadCount = unreadData?.count || 0;
  const recentAlerts = notificationsData?.notifications || [];

  const handleLogout = () => {
    logOutUser();
  };

  const getInitials = () => {
    if (!user) return "?";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  // Build breadcrumbs dynamically based on path
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    return (
      <div className="hidden md:flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        <span className="hover:text-foreground transition-colors cursor-pointer" onClick={() => router.push("/dashboard")}>
          Workspace
        </span>
        {paths.map((path, idx) => {
          const href = "/" + paths.slice(0, idx + 1).join("/");
          const isLast = idx === paths.length - 1;
          const formattedName = path.replace(/-/g, " ");

          return (
            <div key={path} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
              <span
                onClick={() => !isLast && router.push(href)}
                className={`transition-colors cursor-pointer ${isLast ? "text-foreground font-bold" : "hover:text-foreground"}`}
              >
                {formattedName}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <header className="h-16 border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      {/* Left side: Hamburger (mobile) / Breadcrumbs (desktop) */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 border border-border/45 bg-background/40 text-muted-foreground"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        {getBreadcrumbs()}
      </div>

      {/* Center Search (Linear-style) */}
      <div className="hidden sm:flex max-w-xs w-full relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80 pointer-events-none">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder="Search workspace (Ctrl + K)"
          className="w-full h-9 pl-9 pr-4 rounded-xl border border-border/50 bg-muted/15 text-xs text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
        />
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 border border-border/45 bg-background/45 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary text-[9px] text-primary-foreground font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 mt-1 border border-border/40 bg-card/75 backdrop-blur-xl shadow-xl" align="end" forceMount>
            <div className="p-3 flex justify-between items-center text-xs border-b border-border/60">
              <span className="font-extrabold text-foreground uppercase tracking-wider">Alerts</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-primary hover:underline font-semibold cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="divide-y divide-border/40 max-h-64 overflow-y-auto custom-scrollbar">
              {recentAlerts.length ? (
                recentAlerts.map((alert) => {
                  const isUnread = alert.status === "UNREAD";
                  return (
                    <div
                      key={alert._id}
                      onClick={() => isUnread && markAsRead(alert._id)}
                      className={`p-3 text-xs leading-relaxed transition-colors cursor-pointer hover:bg-muted/30
                        ${isUnread ? "font-semibold bg-primary/5 text-foreground" : "text-muted-foreground"}
                      `}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold truncate">{alert.title}</span>
                        {isUnread && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 self-center" />
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{alert.message}</p>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-muted-foreground text-[11px] italic">
                  No alerts in your inbox
                </div>
              )}
            </div>
            <DropdownMenuSeparator className="bg-border/60" />
            <DropdownMenuItem
              onClick={() => router.push("/communication")}
              className="cursor-pointer flex justify-center text-[10px] uppercase tracking-wider font-extrabold text-primary py-2.5"
            >
              Go to notice board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 border border-border/45 bg-background/45 text-muted-foreground hover:text-foreground"
        >
          <Sun className="h-4.5 w-4.5 dark:hidden" />
          <Moon className="h-4.5 w-4.5 hidden dark:block" />
        </Button>

        {/* User Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-border/45">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-1 border border-border/40 bg-card/75 backdrop-blur-xl shadow-xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold text-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/60" />
            <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>Dashboard Hub</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/60" />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
