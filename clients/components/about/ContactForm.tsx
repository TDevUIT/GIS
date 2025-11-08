"use client";
import { useState } from "react";
import { HelpCircle } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-16 lg:px-24 py-16 lg:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Bạn cần hỗ trợ gì từ UrbanScale?
          </h2>
          <p className="text-gray-600 text-base max-w-3xl mx-auto">
            Chúng tôi sẵn sàng tiếp nhận phản hồi, góp ý hoặc hợp tác trong các dự án ứng dụng 
            Hệ thống thông tin địa lý (GIS) và đô thị thông minh.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 lg:p-12">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-600 mb-2">
                  Tên của bạn<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="reason" className="block text-sm text-gray-600 mb-2">
                  Lý do liên lạc<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white"
                    required
                  >
                    <option value=""></option>
                    <option value="Hợp tác dự án">Hợp tác dự án</option>
                    <option value="Hỗ trợ kỹ thuật">Hỗ trợ kỹ thuật</option>
                    <option value="Góp ý/Phản hồi">Góp ý/Phản hồi</option>
                    <option value="Khác">Khác</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <HelpCircle className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm text-gray-600 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm text-gray-600 mb-2">
                Tin nhắn
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <p className="text-sm text-gray-500">
              Các trường có dấu <span className="text-red-500">*</span> là bắt buộc điền
            </p>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-32 py-4 bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
              >
                Gửi phản hồi
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
