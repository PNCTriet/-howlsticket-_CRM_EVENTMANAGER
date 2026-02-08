"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NOTE_QUOTE = "Món quà nhỏ tặng Đông và Hân, về bờ thôi";
const NOTE_PS = "Triết Nguyễn Phạm , Howlsticket";

const LOGO_SRC = "/images/howlstudio_logo_stransp_alt1.png";
const AVA_SRC = "/images/avatar/Howlstudio_founder_ava.png";
const LOADING_DURATION_MS = 1200;
const NOTE_DURATION_MS = 3000;
const TYPING_SPEED_MS = 50;

export default function HomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "note">("loading");
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("note"), LOADING_DURATION_MS);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    const totalMs = LOADING_DURATION_MS + NOTE_DURATION_MS + 400;
    const t = setTimeout(() => router.replace("/login"), totalMs);
    return () => clearTimeout(t);
  }, [router]);

  useEffect(() => {
    if (phase !== "note") return;
    setTypedLength(0);
    const full = NOTE_QUOTE;
    if (full.length === 0) return;
    const id = setInterval(() => {
      setTypedLength((n) => {
        if (n >= full.length) {
          clearInterval(id);
          return full.length;
        }
        return n + 1;
      });
    }, TYPING_SPEED_MS);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      {phase === "loading" ? (
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
      ) : (
        <div className="flex max-w-md flex-col items-center gap-6">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-zinc-200 bg-zinc-900 dark:border-zinc-700 dark:bg-zinc-950">
            <Image
              src={AVA_SRC}
              alt="founder"
              width={96}
              height={96}
              className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 object-cover object-center"
              priority
            />
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-6 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-center text-zinc-700 dark:text-zinc-300">
              &ldquo;{NOTE_QUOTE.slice(0, typedLength)}
              {typedLength < NOTE_QUOTE.length && (
                <span className="animate-pulse">|</span>
              )}
              &rdquo;
            </p>
            <p className="mt-3 border-t border-zinc-200 pt-3 text-right text-sm italic text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              — {NOTE_PS}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
