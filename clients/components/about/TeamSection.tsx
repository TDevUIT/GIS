"use client";
import Image from "next/image";

const TeamSection = () => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-16 lg:px-24 py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-16">
          <div className="w-full max-w-5xl">
            <Image
              src="/images/about/about.svg"
              alt="Đội ngũ"
              width={1000}
              height={450}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
