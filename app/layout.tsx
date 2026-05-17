import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: "default" },
  formatDetection: { telephone: false },
  openGraph: { title: APP_NAME, description: APP_DESCRIPTION, type: "website" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2E55E0" },
    { media: "(prefers-color-scheme: dark)",  color: "#2E55E0" }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only fixed left-3 top-3 z-50 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white"
        >
          Skip to main content
        </a>
        <Nav />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
