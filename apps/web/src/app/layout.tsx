import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BrandProvider } from "@/components/brand-provider";
import { CatalogProvider } from "@/components/catalog-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Animably — Viral Motion Graphics for Creators",
  description:
    "Browse, customize, and export pro motion graphics hooks in seconds. No After Effects required.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>
          <BrandProvider>
            <CatalogProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </CatalogProvider>
          </BrandProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
