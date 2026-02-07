# PROJECT RULES & DESIGN SYSTEM
## 1. Project Overview
- **Name:** OCX Partner Portal (Event Manager Dashboard)
- **Role:** B2B Admin Dashboard for Event Organizers.
- **Goal:** High-performance, clean, and real-time tracking of ticket sales and revenue.

## 2. Tech Stack (Strict)
- **Framework:** Next.js 14+ (App Router).
- **Language:** TypeScript (Strict mode).
- **Styling:** Tailwind CSS.
- **UI Components:** Shadcn/ui (Radix Primitives).
- **Icons:** Lucide React ONLY. (Stroke width: 1.5px or 2px consistent).
- **State Management:** TanStack Query (React Query) v5.
- **Charts:** Recharts (preferred) or Tremor.
- **Forms:** React Hook Form + Zod validation.

## 3. UI/UX Guidelines (The "Apple-esque" Style)
- **Layout:**
  - Sidebar Navigation (Left, Collapsible).
  - Header (Top, User Profile, Global Search).
  - Content Area: Bento Grid Layout (Grid-based, card containers).
- **Styling:**
  - **Background:** `bg-zinc-50` (light gray) for main background to make cards pop.
  - **Cards:** `bg-white`, `rounded-xl`, `border-zinc-200`, `shadow-sm`.
  - **Typography:** Inter or Geist Sans. Use `tabular-nums` for all financial data/tables.
  - **Colors:** Primary (Black/Dark Zinc), Success (Emerald-500), Warning (Amber-500), Error (Rose-500).
- **Behavior:**
  - **No Spinners:** Use `Skeleton` loaders for initial data fetching.
  - **Empty States:** Always show an illustration (Lucide icon) + CTA button when data is empty.
  - **Feedback:** Use `Toaster` (Sonner) for success/error notifications.

## 4. Coding Standards
- **File Structure:** Feature-based organization (e.g., `app/(dashboard)/events/components/...`).
- **Data Fetching:**
  - Create custom hooks for all API calls (e.g., `useEventStats`, `useOrders`).
  - Use `axios` interceptors to inject `Authorization: Bearer <token>` automatically.
- **Naming:** PascalCase for components, camelCase for functions/vars.

## 5. API Integration Rules
- Base URL: `https://api.yourdomain.com`
- Handle 401 Unauthorized: Auto-redirect to `/login` and clear session.
- Real-time: Use React Query `refetchInterval` (30s) for Dashboard stats.