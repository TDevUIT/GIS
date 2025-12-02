import Hero from "@/components/home/Hero";
import Districts from "@/components/home/Districts";
import Features from "@/components/home/Features";
import MapSection from "@/components/home/MapSection";

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
