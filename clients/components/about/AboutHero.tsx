"use client";
import Image from "next/image";

const AboutHero = () => {
  return (
    <section className="relative w-full min-h-[550px] lg:min-h-[650px] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/images/about/hero.svg"
            alt="Urban Development"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
