import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { BrandProvider } from "@/components/brand-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "HookForge — Viral Motion Graphics for Creators",
  description:
    "Browse, customize, and export pro motion graphics hooks in seconds. No After Effects required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <BrandProvider>
          <Header />
          <main>{children}</main>
        </BrandProvider>
      </body>
    </html>
  );
}
