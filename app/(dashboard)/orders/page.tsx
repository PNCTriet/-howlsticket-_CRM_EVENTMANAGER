import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ticket } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Đơn hàng</h1>
        <p className="text-sm text-zinc-500">Quản lý đơn hàng – Phase 2</p>
      </div>
      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-zinc-900">Danh sách đơn hàng</CardTitle>
          <CardDescription>Bảng dữ liệu với phân trang, lọc (sắp có)</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-zinc-500">
          <Ticket className="mb-4 size-12 stroke-[1.5]" />
          <p className="text-sm">Trang đơn hàng đang được phát triển.</p>
        </CardContent>
      </Card>
    </div>
  );
}
