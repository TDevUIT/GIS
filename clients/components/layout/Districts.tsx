"use client";
import Image from "next/image";
import { MapPin } from "lucide-react";

const Districts = () => {
    const districts = [
        { id: 1, name: "Phường Quận 1", area: "7.73 km²", population: "204,899", image: "/images/citys/1.png" },
        { id: 2, name: "Phường Quận 2", area: "49.72 km²", population: "182,854", image: "/images/citys/2.png" },
        { id: 3, name: "Phường Quận 3", area: "4.90 km²", population: "206,391", image: "/images/citys/3.png" },
        { id: 4, name: "Phường Quận 4", area: "4.18 km²", population: "180,512", image: "/images/citys/4.png" },
        { id: 5, name: "Phường Quận 5", area: "4.27 km²", population: "186,683", image: "/images/citys/5.png" },
        { id: 6, name: "Phường Quận 6", area: "7.09 km²", population: "253,474", image: "/images/citys/6.png" },
        { id: 7, name: "Phường Quận 7", area: "35.85 km²", population: "261,256", image: "/images/citys/7.png" },
        { id: 8, name: "Phường Quận 8", area: "19.14 km²", population: "489,813", image: "/images/citys/8.png" },
        { id: 9, name: "Phường Quận 9", area: "114.02 km²", population: "394,203", image: "/images/citys/9.png" },
        { id: 10, name: "Phường Quận 10", area: "5.87 km²", population: "237,826", image: "/images/citys/10.png" },
        { id: 11, name: "Phường Quận 11", area: "5.13 km²", population: "242,529", image: "/images/citys/11.png" },
        { id: 12, name: "Phường Quận 12", area: "52.78 km²", population: "573,616", image: "/images/citys/12.png" },
    ];

    return (
        <section className="w-full px-4 sm:px-6 md:px-16 lg:px-24 py-16 bg-gray-50">
            <div className="mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                    Các phường phố biên
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                    Khám phá các phường phố hiện tại TP. Hồ Chí Minh
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {districts.map((district) => (
                    <div
                        key={district.id}
                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer"
                    >
                        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                            <Image
                                src={district.image}
                                alt={district.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="p-4 space-y-2">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <h3 className="font-semibold text-gray-900 text-sm">
                                    {district.name}
                                </h3>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>📍 {district.area}</span>
                                <span>👥 {district.population}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-10">
                <button className="px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-medium hover:border-blue-500 hover:text-blue-600">
                    Xem tất cả các quận
                </button>
            </div>
        </section>
    );
};

export default Districts;
