"use client";
import Image from "next/image";

const Hero = () => {
    return (
        <section
            data-hero
            className="relative min-h-[calc(100vh-5rem)] w-full overflow-hidden px-4 sm:px-6 md:px-16 lg:px-24"
        >
            <div className="flex flex-col lg:flex-row justify-between items-center w-full h-full py-12 lg:py-20 gap-12">
                <div className="lg:w-1/2 space-y-6">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                        Hệ thống quản lý <br/>
                        đô thị thông minh
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
                        Khám phá dữ liệu toàn diện về 3 quận của Thành phố Hồ Chí Minh.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600">
                            Khám phá ngay
                        </button>
                        <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400">
                            Tìm hiểu thêm
                        </button>
                    </div>
                </div>

                <div className="lg:w-1/2 relative flex items-center justify-center">
                    <div className="relative w-full max-w-[500px] aspect-square">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full opacity-60"></div>
                        <div className="absolute inset-8 bg-gradient-to-br from-blue-50 to-transparent rounded-full"></div>

                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <Image
                                src="/images/hero.svg"
                                alt="Smart City Visualization"
                                width={400}
                                height={400}
                                className="drop-shadow-2xl"
                                priority
                            />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
