"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  setAccessToken,
  setRefreshToken,
  setSessionCookie,
} from "@/lib/auth-token";
import { authService } from "@/services/auth.service";

const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const reason = searchParams.get("reason");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (reason === "restricted") {
      toast.error("Tài khoản của bạn không có quyền truy cập Portal.");
    }
  }, [reason]);

  async function onSubmit(values: LoginFormValues) {
    try {
      const data = await authService.login(values.email, values.password);
      const accessToken =
        data.accessToken ?? (data as { access_token?: string }).access_token;
      const refreshToken =
        data.refreshToken ?? (data as { refresh_token?: string }).refresh_token;
      if (!accessToken || !refreshToken) {
        toast.error("Đăng nhập thất bại: không nhận được token.");
        return;
      }
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setSessionCookie();
      toast.success("Đăng nhập thành công.");
      requestAnimationFrame(() => {
        router.push(callbackUrl);
      });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : null;
      toast.error(message ?? "Email hoặc mật khẩu không đúng.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-sm border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="flex flex-col items-center space-y-3 pt-6">
          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-zinc-200 bg-zinc-900 dark:border-zinc-700 dark:bg-zinc-950">
            <img
              src="/images/howlstudio_logo_stransp_alt1.png"
              alt="Howlstudio"
              className="size-20 object-contain"
              loading="eager"
            />
          </div>
          <div className="space-y-1 text-center">
            <CardTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Howlsticket CRM
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400">
              Đăng nhập để quản lý sự kiện và vé
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className="border-zinc-200"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-rose-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                className="border-zinc-200"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-rose-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800"
              disabled={isSubmitting}
            >
              <LogIn className="size-4 stroke-[1.5]" />
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-zinc-500">
            <Link href="/" className="underline hover:text-zinc-700">
              ← Về trang chủ
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
