import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "StudioOS — ZXY Ventures",
  description: "The Operating System for ZXY Ventures Agentic Studio",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={jetbrainsMono.variable}>
      <body className="bg-[#0A0A0F] text-[#E2E2F0] antialiased">
        <NavBar />
        <main className="pt-14 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
