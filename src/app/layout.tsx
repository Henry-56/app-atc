import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/data-store";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ChatAssistant from "@/components/dashboard/ChatAssistant";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StorePulse AI | Dashboard Inteligente",
  description: "Sistema de análisis de tráfico y ventas en tiempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className={`${inter.className} min-h-full`}>
        <DataProvider>
          <DashboardLayout>
            {children}
            <ChatAssistant />
          </DashboardLayout>
        </DataProvider>
      </body>
    </html>
  );
}
