import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEXUS AI — Client Acquisition OS",
  description: "Connect every conversation. Capture every lead. Automate every follow-up.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { ProspectsProvider } from "@/lib/store/prospects-store";
import { AnalysisProvider } from "@/lib/store/analysis-store";
import { LeadsProvider } from "@/lib/store/leads-store";
import { ChannelsProvider } from "@/lib/store/channels-store";
import { FollowUpProvider } from "@/lib/store/follow-up-store";
import { ToastProvider } from "@/components/ui/Toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#172033] selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
        <ToastProvider>
          <ProspectsProvider>
            <AnalysisProvider>
              <LeadsProvider>
                <ChannelsProvider>
                  <FollowUpProvider>{children}</FollowUpProvider>
                </ChannelsProvider>
              </LeadsProvider>
            </AnalysisProvider>
          </ProspectsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
