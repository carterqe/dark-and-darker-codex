import type { Metadata, Viewport } from "next";
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
import { SITE } from "@/lib/site";

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
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.fullName} — Leaderboards, Builds & Market`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Dark and Darker",
    "Dark and Darker leaderboard",
    "Dark and Darker builds",
    "Dark and Darker market",
    "Dark and Darker maps",
    "Dark and Darker classes",
    "Dark and Darker quests",
    "DaD",
    "DaD Codex",
    "Ironmace",
    "extraction shooter",
    "dungeon crawler",
  ],
  category: "games",
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.fullName,
    title: `${SITE.fullName} — Leaderboards, Builds & Market`,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.fullName} — Leaderboards, Builds & Market`,
    description: SITE.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: "8kYKEEviBpggtgQ7Z-Ie-iBiIvwp4jRP6JW6UVpd1U0",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: SITE.themeColor,
  colorScheme: "dark",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.fullName,
  alternateName: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE.url}/leaderboard?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.fullName,
  alternateName: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/favicon.ico`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-bg-primary text-text-primary bg-noise antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
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
