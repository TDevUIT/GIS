import Hero from "@/components/layout/Hero";
import Districts from "@/components/layout/Districts";
import Features from "@/components/layout/Features";
import MapSection from "@/components/layout/MapSection";

export default function Home() {
  return (
    <div id="top">
      <Hero />
      <Districts />
      <Features />
      <MapSection />
    </div>
  );
}
