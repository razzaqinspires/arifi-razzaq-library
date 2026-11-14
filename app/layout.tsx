import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: { default: "Arifi Razzaq — Worklog, Portfolio & Public Library", template: "%s | Arifi Razzaq" },
  description: "Portofolio, jasa pengembangan website Razzaq Ventures, public library, rekam kerja software, bot WhatsApp, AI, dan eksperimen teknologi Arifi Razzaq.",
  applicationName: "Arifi Razzaq Worklog & Public Library",
  keywords: ["Arifi Razzaq", "Razzaq Ventures", "Website Development", "Jasa Pembuatan Website", "Portfolio", "Worklog", "Public Library", "Open Source", "source code", "bot", "software", "robotics", "AI", "tutorial", "aplikasi"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: { title: "Arifi Razzaq — Worklog, Portfolio & Public Library", description: "Portofolio Razzaq Ventures, layanan pengembangan website, rekam kerja, dan arsip digital Arifi Razzaq.", type: "website", locale: "id_ID", siteName: "Arifi Razzaq" },
  twitter: { card: "summary_large_image", title: "Arifi Razzaq — Worklog, Portfolio & Public Library", description: "Portofolio digital, layanan pembuatan website, jurnal kerja, source code, dan komunitas." },
};

export const viewport: Viewport = { themeColor: "#f5f6f3", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="id"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
