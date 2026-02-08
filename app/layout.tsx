import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { LocaleProvider } from "@/providers/locale-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://admin.otcayxe.com";
const logoPath = "/images/howlstudio_logo_blackbr_alt1.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Howlsticket CRM",
  description: "Event Manager Dashboard – B2B Admin for Event Organizers",
  icons: {
    icon: logoPath,
    type: "image/png",
  },
  openGraph: {
    title: "Howlsticket CRM",
    description: "Event Manager Dashboard – B2B Admin for Event Organizers",
    url: siteUrl,
    siteName: "Howlsticket",
    images: [{ url: logoPath, width: 1200, height: 630, alt: "Howls Studio" }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Howlsticket CRM",
    description: "Event Manager Dashboard – B2B Admin for Event Organizers",
    images: [logoPath],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-50 font-sans antialiased dark:bg-zinc-950">
        <QueryProvider>
          <ThemeProvider>
            <LocaleProvider>
              <AuthProvider>
                {children}
                <Toaster richColors position="top-right" />
              </AuthProvider>
            </LocaleProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
