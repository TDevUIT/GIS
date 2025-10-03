import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 md:mt-16 px-4 sm:px-6">
      <div>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-4 px-0 sm:px-2 md:px-6">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/90 uppercase">Liên hệ</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-300">
              <li>
                <a href="mailto:hello@urbanscale.vn" className="text-neutral-200 hover:text-white hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm">
                  hello@urbanscale.vn
                </a>
              </li>
              <li>
                <a href="tel:+84000000000" className="text-neutral-200 hover:text-white hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm">
                  +84 00 0000 000
                </a>
              </li>
              <li className="text-neutral-400">
                Thủ Đức, TP.HCM, Việt Nam
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/90 uppercase">Liên kết nhanh</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-300">
              <li>
                <Link href="/" className="text-neutral-200 hover:text-white hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm">Trang chủ</Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-200 hover:text-white hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm">Giới thiệu</Link>
              </li>
              <li>
                <Link href="/projects" className="text-neutral-200 hover:text-white hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm">Dự án</Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-200 hover:text-white hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm">Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-200 hover:text-white hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm">Liên hệ</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/90 uppercase">Tài nguyên</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-300">
              <li>
                <Link href="/docs" className="text-neutral-200 hover:text-white hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm">Tài liệu</Link>
              </li>
              <li>
                <Link href="/api" className="text-neutral-200 hover:text-white hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm">API</Link>
              </li>
              <li>
                <Link href="/careers" className="text-neutral-200 hover:text-white hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm">Tuyển dụng</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-200 hover:text-white hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-200 hover:text-white hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm">Điều khoản sử dụng</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/90 uppercase">Kết nối</h3>
            <ul className="mt-3 flex gap-4 text-sm text-neutral-300">
              <li>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X / Twitter"
                  className="text-neutral-200 hover:text-white transition-colors inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2H21l-6.56 7.5L22 22h-6.91l-4.53-5.89L5.2 22H2l7.03-8.04L2 2h6.91l4.11 5.36L18.244 2zm-2.41 18h2.2L8.32 4H6.12l9.714 16z"/>
                  </svg>
                  <span className="sr-only">X / Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-neutral-200 hover:text-white transition-colors inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.15 8.96 7.51 10.41.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.05-3.05.66-3.7-1.3-3.7-1.3-.5-1.28-1.22-1.62-1.22-1.62-.99-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.56 1.19 3.18.9.1-.71.38-1.19.69-1.46-2.43-.28-4.98-1.22-4.98-5.43 0-1.2.43-2.19 1.14-2.96-.11-.28-.49-1.42.11-2.96 0 0 .92-.29 3.02 1.13a10.5 10.5 0 0 1 2.75-.37c.93 0 1.87.13 2.75.37 2.1-1.42 3.02-1.13 3.02-1.13.6 1.54.22 2.68.11 2.96.71.77 1.14 1.76 1.14 2.96 0 4.22-2.56 5.15-5 5.43.39.34.73 1.01.73 2.05 0 1.48-.01 2.68-.01 3.04 0 .29.2.63.76.52A10.52 10.52 0 0 0 23 11.5C23 5.24 18.27.5 12 .5z"/>
                  </svg>
                  <span className="sr-only">GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-neutral-200 hover:text-white transition-colors inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.1c0-1.7-.03-3.9-2.38-3.9-2.39 0-2.76 1.86-2.76 3.78V24h-3.8V8z"/>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full">
          <div className="w-full">
            <Link
              href="/"
              className="block w-full"
            >
              <h1 className="
                block w-full text-start leading-none font-semibold italic tracking-tight
                text-[68px] xs:text-6xl sm:text-7xl md:text-[298px] lg:text-[298px] xl:text-[298px] 2xl:text-[298px]
                hover:opacity-90 transition-opacity break-words mt-4 md:mt-0
              ">
                <span className="relative inline-block">
                  URBAN<span className="text-white">SCALE</span>
                  <span aria-hidden="true" className="absolute bottom-14 -right-3 sm:bottom-4 sm:-right-4 md:bottom-60 md:-right-6 text-white/80 text-[16px] sm:text-[20px] md:text-[28px] lg:text-[32px]">®</span>
                </span>
              </h1>
            </Link>
          </div>
        </div>
        <div className="pt-6 text-xs md:text-sm text-neutral-400 flex flex-col md:flex-row md:justify-between gap-4 mb-10 md:px-6">
          <div className="flex flex-col gap-2">
            <p className="leading-relaxed">
                Copyright © {year} UrbanScale.
            </p>
            <p>
                An Impact-first Creative Partner
            </p>
          </div>
          <p>
            Website được xây dựng theo các nguyên tắc <br/> thiết kế web carbon thấp.
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;

