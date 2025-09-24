"use client";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Factory, Info, LifeBuoy, ArrowRight } from "lucide-react";
import Marquee from "react-fast-marquee";
import { useEffect, useMemo, useRef, useState } from "react";

const Hero = () => {
    const logos = useMemo(
        () => [
            { src: "https://logo.clearbit.com/mapbox.com", alt: "Mapbox" },
            { src: "https://logo.clearbit.com/tomtom.com", alt: "TomTom" },
            { src: "https://logo.clearbit.com/here.com", alt: "HERE" },
            { src: "https://logo.clearbit.com/uber.com", alt: "Uber" },
            { src: "https://logo.clearbit.com/maxar.com", alt: "Maxar" },
            { src: "https://logo.clearbit.com/carto.com", alt: "Carto" },
            { src: "https://logo.clearbit.com/urbanfootprint.com", alt: "UrbanFootprint" },
            { src: "https://logo.clearbit.com/cisco.com", alt: "Cisco" },
            { src: "https://logo.clearbit.com/foursquare.com", alt: "Foursquare" },
            { src: "https://logo.clearbit.com/placemeter.com", alt: "Placemeter" },
        ],
        []
    );

    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [marqueeSpeed, setMarqueeSpeed] = useState(36);
    const [isMobile, setIsMobile] = useState(false);
    const [inView, setInView] = useState(true);
    const [mounted, setMounted] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handleMotion = () => setPrefersReducedMotion(!!mql.matches);
        handleMotion();
        mql.addEventListener?.("change", handleMotion);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nav = (navigator as any)
            if (nav?.connection?.saveData) {
                setPrefersReducedMotion(true);
            }
        } catch {}
        const handleResize = () => {
            const w = window.innerWidth;
            setIsMobile(w < 640);
            setMarqueeSpeed(w < 640 ? 22 : w < 1024 ? 32 : 36);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        const sectionEl = document.querySelector('section[data-hero]');
        if (sectionEl && 'IntersectionObserver' in window) {
            const io = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    setInView(entry.isIntersecting);
                    const v = videoRef.current;
                    if (v) {
                        if (entry.isIntersecting && !mql.matches && window.innerWidth >= 640) {
                            v.play().catch(() => {});
                        } else {
                            v.pause();
                        }
                    }
                },
                { threshold: 0.25 }
            );
            io.observe(sectionEl);
            setMounted(true);
            return () => {
                mql.removeEventListener?.("change", handleMotion);
                window.removeEventListener("resize", handleResize);
                io.disconnect();
            };
        }
        setMounted(true);
        return () => {
            mql.removeEventListener?.("change", handleMotion);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
        <section data-hero className="relative min-h-[90vh] sm:min-h-[100vh] w-full overflow-hidden rounded-b-4xl">
            <video
                src="https://pouch.jumpshare.com/preview/hq1L3rx73ImUICe530nu2S0hSBwFCYw5hFFifWr7qOwie1CpX5fgRwGoB1P3cb-ZizSmZbMHJJ3rONM7goRsTbm245Jz3Pj8F_F5_eIoiPOlD8_hGlA3u4r6pDpBYG9wYBwBIcs-0eVyYpNWr0dr8m6yjbN-I2pg_cnoHs_AmgI.mp4"
                autoPlay={!isMobile}
                loop
                muted
                playsInline
                aria-hidden
                preload={isMobile ? "none" : "metadata"}
                className="absolute inset-0 h-full w-full object-cover -z-20"
                ref={videoRef}
            />

            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/80" />
                <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
            </div>
            <div className="absolute bottom-0 left-0 w-full">
                <div className="relative h-[40vh] sm:h-[26rem] md:h-[28rem]">
                    <div className="hidden sm:block absolute inset-0">
                        <Image
                            src="/images/Subtract.webp"
                            alt=""
                            fill
                            className="object-fill pointer-events-none"
                            priority
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-start mb-4">
                        <div className="px-4 sm:px-6 md:px-10 text-start w-full">
                            <div className="hidden sm:block max-w-full sm:max-w-3xl lg:max-w-4xl bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                                <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
                                    Website phát triển quản lý đô thị cho <span className="bg-gradient-to-r from-atlantis-500 to-atlantis-700 bg-clip-text text-transparent">TP. Hồ Chí Minh</span>
                                </h1>
                                <p className="mt-3 text-base sm:text-lg leading-relaxed text-neutral-700 max-w-prose md:max-w-3xl">
                                    Ứng dụng công nghệ GIS phục vụ quy hoạch, quản lý dân số, phân tích dữ liệu không gian và trực quan hóa bản đồ. Hệ thống chuẩn hóa dữ liệu, chuyển đổi tài liệu sang JSON và cung cấp API mạnh mẽ cho khách hàng web.
                                </p>

                                <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                                    <Link href="/about" className="float-hover group inline-flex items-center justify-center rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 h-11 px-4 sm:px-5 font-medium shadow-lg shadow-black/10">
                                        <Info className="mr-2 h-5 w-5" />
                                        <span>Khám phá nền tảng</span>
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </Link>
                                    <Link href="/resources" className="float-hover group inline-flex items-center justify-center rounded-lg bg-white/85 hover:bg-white text-neutral-900 border border-neutral-200 h-11 px-4 sm:px-5 font-medium">
                                        <BookOpen className="mr-2 h-5 w-5" />
                                        <span>Tài liệu</span>
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </Link>
                                    <Link href="/industries" className="float-hover group inline-flex items-center justify-center rounded-lg bg-white/85 hover:bg-white text-neutral-900 border border-neutral-200 h-11 px-4 sm:px-5 font-medium">
                                        <Factory className="mr-2 h-5 w-5" />
                                        <span>Ứng dụng</span>
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </Link>
                                    <Link href="/support" className="float-hover group inline-flex items-center justify-center rounded-lg bg-white/85 hover:bg-white text-neutral-900 border border-neutral-200 h-11 px-4 sm:px-5 font-medium">
                                        <LifeBuoy className="mr-2 h-5 w-5" />
                                        <span>Hỗ trợ</span>
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pointer-events-none absolute left-0 right-0 sm:right-16 bottom-2 sm:bottom-4 hidden sm:block" role="region" aria-label="Partner logos">
                        <div className="px-4 sm:px-6">
                            {!mounted || isMobile || prefersReducedMotion ? (
                                <div className="pointer-events-auto relative">
                                    <div
                                        className="flex items-center gap-8 overflow-x-auto pb-2 snap-x snap-mandatory"
                                        aria-label="Partner logos (static)"
                                    >
                                        {logos.map((logo) => (
                                            <div key={logo.alt} className="shrink-0 snap-start mx-2">
                                                <Image
                                                    src={logo.src}
                                                    alt={logo.alt}
                                                    width={220}
                                                    height={64}
                                                    className="h-14 sm:h-16 w-auto opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Marquee
                                    gradient={false}
                                    speed={marqueeSpeed}
                                    pauseOnHover
                                    pauseOnClick
                                    play={inView}
                                    aria-label="Partner logos (marquee)"
                                    className="pointer-events-auto"
                                >
                                    {logos.concat(logos).map((logo, idx) => (
                                        <div key={logo.alt + idx} className="mx-3">
                                            <Image
                                                src={logo.src}
                                                alt={logo.alt}
                                                width={200}
                                                height={58}
                                                className="h-12 sm:h-14 w-auto opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition"
                                            />
                                        </div>
                                    ))}
                                </Marquee>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div className="sm:hidden px-4 -mt-2 pb-4" role="region" aria-label="Partner logos (mobile)">
            <div className="relative">
                {!mounted || prefersReducedMotion ? (
                    <div
                        className="flex items-center gap-6 overflow-x-auto pb-2 snap-x snap-mandatory"
                        aria-label="Partner logos (static)"
                    >
                        {logos.slice(0, 8).map((logo) => (
                            <div key={logo.alt} className="shrink-0 snap-start mx-2">
                                <Image
                                    src={logo.src}
                                    alt={logo.alt}
                                    width={180}
                                    height={52}
                                    className="h-10 w-auto opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <Marquee
                        gradient={false}
                        speed={Math.max(16, Math.floor(marqueeSpeed * 0.8))}
                        pauseOnHover={false}
                        pauseOnClick={false}
                        play={inView}
                        aria-label="Partner logos (marquee)"
                    >
                        {logos.concat(logos).slice(0, 16).map((logo, idx) => (
                            <div key={logo.alt + idx} className="mx-3">
                                <Image
                                    src={logo.src}
                                    alt={logo.alt}
                                    width={180}
                                    height={52}
                                    className="h-10 w-auto opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition"
                                />
                            </div>
                        ))}
                    </Marquee>
                )}
            </div>
        </div>

        <div className="sm:hidden px-4 pt-6 pb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Website phát triển quản lý đô thị cho <span className="bg-gradient-to-r from-atlantis-500 to-atlantis-700 bg-clip-text text-transparent">TP. Hồ Chí Minh</span>
                </h1>
                <p className="mt-3 text-base leading-relaxed text-neutral-700">
                    Ứng dụng công nghệ GIS phục vụ quy hoạch, quản lý dân số, phân tích dữ liệu không gian và trực quan hóa bản đồ. Hệ thống chuẩn hóa dữ liệu, chuyển đổi tài liệu sang JSON và cung cấp API mạnh mẽ cho khách hàng web.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link href="/about" className="float-hover group inline-flex items-center justify-center rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 h-11 px-4 font-medium shadow-lg shadow-black/10">
                        <Info className="mr-2 h-5 w-5" />
                        <span>Khám phá nền tảng</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                    <Link href="/resources" className="float-hover group inline-flex items-center justify-center rounded-lg bg-white/85 hover:bg-white text-neutral-900 border border-neutral-200 h-11 px-4 font-medium">
                        <BookOpen className="mr-2 h-5 w-5" />
                        <span>Tài liệu</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                    <Link href="/industries" className="float-hover group inline-flex items-center justify-center rounded-lg bg-white/85 hover:bg-white text-neutral-900 border border-neutral-200 h-11 px-4 font-medium">
                        <Factory className="mr-2 h-5 w-5" />
                        <span>Ứng dụng</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                    <Link href="/support" className="float-hover group inline-flex items-center justify-center rounded-lg bg-white/85 hover:bg-white text-neutral-900 border border-neutral-200 h-11 px-4 font-medium">
                        <LifeBuoy className="mr-2 h-5 w-5" />
                        <span>Hỗ trợ</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
        </>
    )
}

export default Hero



