import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode } from "lucide-react";

export default function CheckinPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Check-in</h1>
        <p className="text-sm text-zinc-500">Báo cáo check-in – Phase 4</p>
      </div>
      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-zinc-900">Lịch sử check-in</CardTitle>
          <CardDescription>Logs và trạng thái đồng bộ (sắp có)</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-zinc-500">
          <QrCode className="mb-4 size-12 stroke-[1.5]" />
          <p className="text-sm">Trang check-in đang được phát triển.</p>
        </CardContent>
      </Card>
    </div>
  );
}
