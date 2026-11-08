import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: { default: "Arifi Razzaq Official — Creator Library", template: "%s | Arifi Razzaq Official" },
  description: "Library resmi Arifi Razzaq Official. Temukan project, source code, aplikasi, tools, tutorial, catatan versi, dan tautan unduhan.",
  applicationName: "Arifi Razzaq Creator Library",
  keywords: ["Arifi Razzaq", "Creator Library", "source code", "project", "download", "tutorial", "aplikasi"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: { title: "Arifi Razzaq Official — Creator Library", description: "Library resmi untuk project, source code, aplikasi, tools, tutorial, dan update Arifi Razzaq.", type: "website", locale: "id_ID", siteName: "Arifi Razzaq Official" },
  twitter: { card: "summary_large_image", title: "Arifi Razzaq Official — Creator Library", description: "Project, source code, tools, dan update dalam satu library." },
};

export const viewport: Viewport = { themeColor: "#f5f6f3", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="id"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
