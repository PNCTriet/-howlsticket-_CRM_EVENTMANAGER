import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50">
      <h1 className="text-xl font-semibold text-zinc-900">Howlsticket CRM</h1>
      <p className="text-zinc-600">Event Manager Dashboard</p>
      <Link
        href="/login"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
      >
        Go to Login
      </Link>
      <Link
        href="/dashboard"
        className="text-sm text-zinc-500 underline hover:text-zinc-700"
      >
        Dashboard
      </Link>
    </div>
  );
}
