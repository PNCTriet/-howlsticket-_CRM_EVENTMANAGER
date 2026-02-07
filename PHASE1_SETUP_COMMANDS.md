# Phase 1 – Shell commands (run in order)

## 1. Initialize Next.js (App Router, TypeScript, Tailwind)

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --turbopack
```

When prompted:
- **Would you like to use `src/` directory?** → No
- **Would you like to use App Router?** → Yes (default)
- **Would you like to customize the default import alias?** → No (or keep `@/*`)

If the directory is not empty, choose **Yes** to continue.

---

## 2. Install UI & styling dependencies

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
```

---

## 3. Install Shadcn/ui (run init, then add components as needed)

```bash
npx shadcn@latest init
```

Suggested answers:
- **Style:** Default
- **Base color:** Zinc
- **CSS variables:** Yes
- **Components path:** `components/ui`
- **Utils path:** `lib/utils`
- **React Server Components:** Yes
- **Import alias:** `@/*`

---

## 4. Install logic & data dependencies

```bash
npm install @tanstack/react-query axios date-fns react-hook-form zod
```

---

## 5. Install charts (Recharts per UXUI doc)

```bash
npm install recharts
```

---

## 6. (Optional) Sonner for Toaster

```bash
npx shadcn@latest add sonner
```

---

After running the commands above, the config files in this repo (`tailwind.config.ts`, `lib/utils.ts`, `lib/axios.ts`, `app/layout.tsx`, `providers/query-provider.tsx`) will plug into the project. If `create-next-app` created `tailwind.config.js`, remove it or replace with the provided `tailwind.config.ts`.
