import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EventSelectorProvider } from "@/providers/event-selector-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <EventSelectorProvider>{children}</EventSelectorProvider>
    </DashboardShell>
  );
}
