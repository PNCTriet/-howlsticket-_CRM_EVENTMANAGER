import { EventSelector } from "./components/EventSelector";
import { StatsCards } from "./components/StatsCards";
import { RevenueHeatmap } from "./components/RevenueHeatmap";
import { RevenueChart } from "./components/RevenueChart";
import { RevenueByDayTable } from "./components/RevenueByDayTable";
import { RevenueByChannelTable } from "./components/RevenueByChannelTable";
import { RecentOrdersTable } from "./components/RecentOrdersTable";
import { DashboardPageHeader } from "./components/DashboardPageHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader />
        <EventSelector />
      </div>

      <StatsCards />

      <RevenueChart />

      <RevenueHeatmap />

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueByDayTable />
        <RevenueByChannelTable />
      </div>

      <RecentOrdersTable />
    </div>
  );
}
