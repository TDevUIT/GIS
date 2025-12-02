import Image from "next/image";

const MapSection = () => {
    return (
        <section className="w-full bg-gray-50">
            <div className="mb-10 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                    Bản đồ phân bố
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                    Khám phá vị trí các quận trên bản đồ Thành phố Hồ Chí Minh
                </p>
            </div>

            <div className="relative w-full bg-white rounded-2xl shadow-lg overflow-hidden h-[400px]">
                <div className="relative w-full h-full">
                    <Image
                        src="/images/place/map.png"
                        alt="Bản đồ Thành phố Hồ Chí Minh"
                        className="object-contain"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            </div>
        </section>
    );
};

export default MapSection;
