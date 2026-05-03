"use client";

import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import RecentBuilds from "@/components/home/RecentBuilds";
import ServerPopulation from "@/components/home/ServerPopulation";
import GoldDivider from "@/components/ui/GoldDivider";
import MedievalButton from "@/components/ui/MedievalButton";

export default function HomeClient() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      <section className="py-8 px-4">
        <ServerPopulation />
      </section>

      <GoldDivider />

      <RecentBuilds />

      <div className="flex justify-center py-8">
        <Link href="/builds">
          <MedievalButton>Browse All Builds</MedievalButton>
        </Link>
      </div>
    </div>
  );
}
