"use client";
import Image from "next/image";
import { Plane, Building2, FileText, ChevronRight } from "lucide-react";

const Features = () => {
    const features = [
        {
            icon: <Plane className="w-6 h-6 text-blue-500" />,
            title: "Bản đồ tương tác",
            description: "Lập dữ liệu đa dạng: dân số, hạ tầng, tài ro đô thị, trạm quan trắc"
        },
        {
            icon: <Building2 className="w-6 h-6 text-blue-500" />,
            title: "Dữ liệu thời gian thực",
            description: "Cập nhật sensor IoT: mực nước, tiếng ồn, chất lượng không khí"
        },
        {
            icon: <FileText className="w-6 h-6 text-blue-500" />,
            title: "Báo cáo & API mở",
            description: "Tải báo cáo PDF, CSV, API REST..."
        }
    ];

    return (
        <section className="w-full px-4 sm:px-6 md:px-16 lg:px-24 py-16 bg-white">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                <div className="lg:w-1/2 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full -z-10 scale-110"></div>

                        <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-full">
                            <Image
                                src="/images/place/hcm.png"
                                alt="TP Hồ Chí Minh"
                                height={500}
                                width={500}
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2 space-y-6">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                            Điểm nổi bật
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                            Enjoy different experiences in every place you visit and discover new and affordable adventures of course.
                        </p>
                    </div>

                    <div className="space-y-6 pt-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4">
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 text-gray-900 font-medium hover:text-blue-600"
                        >
                            Another Product
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
