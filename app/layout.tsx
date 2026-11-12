import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: { default: "Arifi Razzaq — Worklog & Public Library", template: "%s | Arifi Razzaq" },
  description: "Arsip publik Arifi Razzaq untuk karya digital, source code, bot, aplikasi, jurnal kerja, eksperimen teknologi, dan diskusi komunitas.",
  applicationName: "Arifi Razzaq Worklog & Public Library",
  keywords: ["Arifi Razzaq", "Worklog", "Public Library", "Open Source", "source code", "bot", "software", "robotics", "AI", "tutorial", "aplikasi"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: { title: "Arifi Razzaq — Worklog & Public Library", description: "Arsip publik karya, proses kerja, eksperimen, pembelajaran, dan diskusi Arifi Razzaq.", type: "website", locale: "id_ID", siteName: "Arifi Razzaq" },
  twitter: { card: "summary_large_image", title: "Arifi Razzaq — Worklog & Public Library", description: "Karya digital, jurnal kerja, source code, dan komunitas dalam satu ruang publik." },
};

export const viewport: Viewport = { themeColor: "#f5f6f3", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="id"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
