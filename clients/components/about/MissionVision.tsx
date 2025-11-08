"use client";
import { Lightbulb, Eye } from "lucide-react";

const MissionVision = () => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-16 lg:px-24 py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Sứ mệnh
              </h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Cung cấp nền tảng dữ liệu đô thị toàn diện, chính xác và dễ truy cập, 
              giúp các nhà hoạch định chính sách, doanh nghiệp và người dân có cái nhìn 
              rõ ràng về hiện trạng và tiềm năng phát triển của thành phố.
            </p>
            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-blue-900">Mục tiêu:</strong> Hỗ trợ ra quyết định dựa trên dữ liệu, 
                tối ưu hóa quy hoạch đô thị, và nâng cao chất lượng cuộc sống của người dân TP.HCM.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Tầm nhìn
              </h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Trở thành nền tảng dữ liệu đô thị hàng đầu Việt Nam, tiên phong trong 
              việc ứng dụng công nghệ GIS và AI để xây dựng đô thị thông minh, 
              bền vững và hướng đến con người.
            </p>
            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-green-900">Định hướng:</strong> Mở rộng quy mô phủ sóng toàn quốc, 
                tích hợp công nghệ AI và Machine Learning để dự báo xu hướng phát triển đô thị.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
