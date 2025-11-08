"use client";
import Image from "next/image";

const Statistics = () => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-16 lg:px-24 py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto flex justify-center">
        <div className="w-full max-w-5xl">
          <Image
            src="/images/about/data.svg"
            alt="Số liệu nổi bật"
            width={1466}
            height={575}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Statistics;
