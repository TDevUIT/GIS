import AboutHero from "@/components/about/AboutHero";
import CoreValues from "@/components/about/CoreValues";
import ServicesSection from "@/components/about/ServicesSection";
import TeamList from "@/components/about/TeamList";
import ContactForm from "@/components/about/ContactForm";
import Statistics from "@/components/about/Statistics";
import TeamSection from "@/components/about/TeamSection";

export default function AboutPage() {
  return (
    <div className="w-full">
      <AboutHero />
      <CoreValues />
      <TeamSection />
      <ServicesSection />
      <Statistics />
      <TeamList />
      <ContactForm />
    </div>
  );
}
