import Link from "next/link";
import { Facebook, Twitter, Instagram, Rss, Mail } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-500 text-white">
      <div className="px-4 sm:px-6 md:px-16 lg:px-24 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          <div className="space-y-4">
            <Link href={ROUTES.HOME} className="inline-block">
              <h2 className="text-2xl font-bold">
                Urban<span className="font-normal">Scale</span>
              </h2>
            </Link>
            <p className="text-sm text-white/90 leading-relaxed">
              Xin chào chúng mình là UrbanScale, phòng tổ thuộc lớp Hệ thống thông tin địa lý 3 chiều - IE402
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-white/90">(+84) 900 000 000</p>
              <p className="text-white/90">urbanscale@uit-se.hcmuaf</p>
            </div>

            <div className="flex gap-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <Instagram className="w-5 h-5" />
              </a>
              <Link href="/rss" className="hover:opacity-80">
                <Rss className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white">
                  Github
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white">
                  LinkedIn
                </a>
              </li>
              <li>
                <Link href={ROUTES.HOME} className="text-white/90 hover:text-white">
                  Website
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">THỦ SỐ CHÍNH</h3>
            <p className="text-sm text-white/90 leading-relaxed">
              Trường Đại học Công nghệ Thông tin, ĐHQG TP.HCMHàn Thuyên, khu phố 6 P. Thủ Đức, Thành phố Hồ Chí Minh
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cần hỗ trợ</h3>
            <form className="flex items-center gap-2 bg-white/20 rounded-lg p-1 backdrop-blur-sm">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-white placeholder:text-white/70"
              />
              <button
                type="submit"
                className="bg-white/30 hover:bg-white/40 p-2 rounded-lg"
                aria-label="Subscribe"
              >
                <Mail className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <p className="text-sm text-white/80">
            {year} UrbanScale. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
