"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LOGO_SRC = "/images/howlstudio_logo_stransp_alt1.png";
const LOADING_DURATION_MS = 1200;

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, LOADING_DURATION_MS);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-24 items-center justify-center overflow-hidden rounded-2xl bg-zinc-900 dark:bg-zinc-950">
          <Image
            src={LOGO_SRC}
            alt="Howlstudio"
            width={96}
            height={96}
            className="animate-pulse object-contain p-2"
            priority
          />
        </div>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-zinc-400 dark:bg-zinc-600" />
        </div>
      </div>
    </div>
  );
}
