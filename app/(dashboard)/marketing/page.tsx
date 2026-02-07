import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Marketing</h1>
        <p className="text-sm text-zinc-500">Coupon & khuyến mãi – Phase 4</p>
      </div>
      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-zinc-900">Coupon</CardTitle>
          <CardDescription>Danh sách coupon, tạo/sửa, analytics (sắp có)</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-zinc-500">
          <Megaphone className="mb-4 size-12 stroke-[1.5]" />
          <p className="text-sm">Trang marketing đang được phát triển.</p>
        </CardContent>
      </Card>
    </div>
  );
}
