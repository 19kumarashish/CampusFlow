"use client";

import { useState } from "react";
import { AuthGuard } from "@/features/auth";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Persistent Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Workspace Shell */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Navbar */}
          <Navbar onMenuClick={() => setSidebarOpen(true)} />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
