import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ParticleBackground from "@/components/layout/ParticleBackground";
import { AuthProvider } from "@/context/AuthContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-family-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-family-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dark and Darker Codex — Leaderboards, Builds & Market",
  description:
    "Dark and Darker leaderboard — track the top champions, character levels, and live server population.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-bg-primary text-text-primary bg-noise antialiased">
        <AuthProvider>
          <ParticleBackground />
          <Navbar />
          <main className="flex-1 pt-14 sm:pt-16 relative z-10">{children}</main>
          <Footer />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}
