import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BetaBanner from "@/components/layout/BetaBanner";
import ParticleBackground from "@/components/layout/ParticleBackground";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import { AuthProvider } from "@/context/AuthContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

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
          <BetaBanner />
          <Navbar />
          <main className="flex-1 pt-[84px] sm:pt-[92px] relative z-10">{children}</main>
          <Footer />
          <FeedbackButton />
          <SpeedInsights />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
