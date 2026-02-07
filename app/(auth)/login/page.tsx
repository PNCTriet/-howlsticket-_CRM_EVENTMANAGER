import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-zinc-200" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
