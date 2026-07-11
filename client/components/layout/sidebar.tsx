"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  UserSquare2,
  UserCog,
  FolderKanban,
  FileCheck2,
  CalendarDays,
  FileSpreadsheet,
  Clock,
  Landmark,
  CreditCard,
  BookMarked,
  Settings,
  ChevronLeft,
  Megaphone,
  Award
} from "lucide-react";

import { RootState } from "@/store";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const role = user?.role?.name || "STUDENT";

  // Core navigation items with role-restrictions
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "TEACHER", "STUDENT"]
    },
    {
      name: "Departments",
      href: "/departments",
      icon: Building2,
      roles: ["ADMIN", "TEACHER", "STUDENT"]
    },
    {
      name: "Courses",
      href: "/courses",
      icon: GraduationCap,
      roles: ["ADMIN", "TEACHER", "STUDENT"]
    },
    {
      name: "Subjects",
      href: "/subjects",
      icon: BookOpen,
      roles: ["ADMIN", "TEACHER", "STUDENT"]
    },
    {
      name: "Faculty Profiles",
      href: "/faculty",
      icon: UserCog,
      roles: ["ADMIN", "TEACHER"]
    },
    {
      name: "Student Profiles",
      href: "/students",
      icon: UserSquare2,
      roles: ["ADMIN", "TEACHER"]
    },
    {
      name: "Users",
      href: "/users",
      icon: Users,
      roles: ["ADMIN"]
    },
    {
      name: "Sections",
      href: "/sections",
      icon: FileSpreadsheet,
      roles: ["ADMIN", "TEACHER"]
    },
    {
      name: "Enrollments",
      href: "/enrollments",
      icon: FileCheck2,
      roles: ["ADMIN", "STUDENT"]
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: CalendarDays,
      roles: ["ADMIN", "TEACHER", "STUDENT"]
    },
    {
      name: "Timetable",
      href: "/timetable",
      icon: Clock,
      roles: ["ADMIN", "TEACHER", "STUDENT"]
    },
    {
      name: "Assignments",
      href: "/assignments",
      icon: FolderKanban,
      roles: ["ADMIN", "TEACHER", "STUDENT"]
    },
    {
      name: "Results Hub",
      href: "/results",
      icon: Award,
      roles: ["ADMIN", "TEACHER", "STUDENT"]
    },
    {
      name: "Communication",
      href: "/communication",
      icon: Megaphone,
      roles: ["ADMIN", "TEACHER", "STUDENT"]
    },
    {
      name: "Semesters Hub",
      href: "/semesters",
      icon: BookOpen,
      roles: ["ADMIN"]
    },
    {
      name: "Student Promotion",
      href: "/academic/promotion",
      icon: GraduationCap,
      roles: ["ADMIN"]
    },
    {
      name: "Backlogs register",
      href: "/academic/backlogs",
      icon: BookMarked,
      roles: ["ADMIN", "STUDENT"]
    },
    {
      name: "Revaluation hub",
      href: "/academic/revaluation",
      icon: Award,
      roles: ["ADMIN", "STUDENT"]
    },
    {
      name: "Academic Calendar",
      href: "/academic/calendar",
      icon: CalendarDays,
      roles: ["ADMIN", "TEACHER", "STUDENT"]
    },
    {
      name: "Fees & ledgers",
      href: "/finance/fees",
      icon: Landmark,
      roles: ["ADMIN", "STUDENT"]
    },
    {
      name: "Scholarships",
      href: "/finance/scholarships",
      icon: Award,
      roles: ["ADMIN"]
    },
    {
      name: "Simulated checkout",
      href: "/finance/payments",
      icon: CreditCard,
      roles: ["ADMIN", "STUDENT"]
    },
    {
      name: "Books Inventory",
      href: "/library/books",
      icon: BookOpen,
      roles: ["ADMIN", "TEACHER", "STUDENT"]
    },
    {
      name: "Circulation logs",
      href: "/library/borrow",
      icon: FolderKanban,
      roles: ["ADMIN", "STUDENT"]
    },
    {
      name: "Profile Settings",
      href: "/profile",
      icon: Settings,
      roles: ["ADMIN", "TEACHER", "STUDENT"]
    }
  ];

  // Filter items by current user role
  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/85 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border/80 bg-sidebar transition-all duration-300 ease-in-out lg:static
          ${isOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header Branding */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/85">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            {isOpen && (
              <span className="font-extrabold tracking-wider bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                CampusFlow
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex h-7 w-7 rounded-lg border border-border/80 bg-background text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-200 ${!isOpen ? "rotate-180" : ""}`}
            />
          </Button>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 group border
                  ${
                    isActive
                      ? "bg-linear-to-r from-primary/10 to-primary/5 text-primary border-primary/20 shadow-[0_2px_12px_rgba(99,102,241,0.08)]"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground border-transparent hover:translate-x-0.5"
                  }
                `}
                title={!isOpen ? item.name : undefined}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-primary" />
                )}
                <Icon
                  className={`h-4.5 w-4.5 transition-all duration-300 group-hover:scale-110
                    ${isActive ? "text-primary" : "text-muted-foreground/80 group-hover:text-foreground"}
                  `}
                />
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Area with logged in user status */}
        <div className="p-4 border-t border-border/80">
          <div className={`flex items-center gap-3 p-2 rounded-xl bg-muted/30 border border-border/40 ${!isOpen ? "justify-center" : ""}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold text-sm">
              {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : "?"}
            </div>
            {isOpen && (
              <div className="text-left overflow-hidden">
                <p className="text-xs font-bold text-foreground truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider truncate">
                  {role}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
