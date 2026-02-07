"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const MOBILE_BREAKPOINT_PX = 768;

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => {
    const isDesktop = () => typeof window !== "undefined" && window.innerWidth > MOBILE_BREAKPOINT_PX;
    if (isDesktop()) setSidebarCollapsed(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
