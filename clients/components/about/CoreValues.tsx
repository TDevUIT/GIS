"use client";
import { Database, Users, Target } from "lucide-react";

const CoreValues = () => {
  const values = [
    {
      icon: <Database className="w-8 h-8 text-orange-500" />,
      title: "Nguồn dữ liệu tin cậy",
      description:
        "Tích hợp dữ liệu của Tổng cục Thống kê, Sở Quy hoạch Kiến trúc, và OpenStreetMap.",
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Nhóm liên ngành",
      description:
        "Kết hợp chuyên môn từ các lĩnh vực GIS, Kỹ thuật phần mềm và Đô thị học.",
    },
    {
      icon: <Target className="w-8 h-8 text-orange-500" />,
      title: "Tầm nhìn bền vững",
      description:
        "Hướng tới mô hình đô thị bền vững - xanh, thông minh và kết nối cộng đồng.",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 md:px-16 lg:px-24 py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-12 lg:mb-16">
          Nền tảng cốt lõi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 float-hover"
            >
              <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
