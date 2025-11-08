"use client";
import Image from "next/image";

const ServicesSection = () => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-16 lg:px-24 py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto flex justify-center">
        <div className="w-full max-w-6xl">
          <Image
            src="/images/about/service.svg"
            alt="Dịch vụ"
            width={1910}
            height={608}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
