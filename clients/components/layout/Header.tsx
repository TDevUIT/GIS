"use client";
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Menu, Home, Map, BarChart3, Info } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import Image from "next/image"
import { ROUTES } from "@/constants/routes"

const Header = () => {
    const NavItems = [
        {name: "Trang Chủ", href: ROUTES.HOME, icon: Home},
        {name: "Bản Đồ", href: ROUTES.MAPS.INDEX, icon: Map},
        {name: "Quận", href: ROUTES.DISTRICTS, icon: Map},
        {name: "Thống Kê", href: ROUTES.REPORTS.INDEX, icon: BarChart3},
        {name: "Về Chúng Tôi", href: "/about", icon: Info},
    ]

    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const el = document.querySelector("header[data-site-header]") as HTMLElement | null;
        if (!el) return;

        const onScroll = () => {
            const isNowScrolled = window.scrollY > 50;
            setScrolled(isNowScrolled);
            if (isNowScrolled) el.classList.add("is-scrolled");
            else el.classList.remove("is-scrolled");
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            data-site-header
            className={`px-4 sm:px-6 md:px-16 lg:px-24 sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
            }`}
        >
            <div className="h-16 sm:h-20 flex justify-between items-center">
                <div className="flex items-center ">
                    <Link href={ROUTES.HOME} className="logo-text text-2xl font-semibold italic tracking-wide hover:opacity-90 transition-opacity">
                        <Image src="/images/logo.svg" alt="Logo" width={215} height={28} />
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    {NavItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                </nav>

                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-10 w-10 p-0 hover:bg-gray-100 rounded-lg"
                                onClick={() => setIsOpen(true)}
                            >
                                <Menu className="h-6 w-6 text-gray-700" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white p-0">
                            <SheetHeader className="px-6 pt-6 pb-4 border-b">
                                <div className="flex items-center justify-between">
                                    <SheetTitle>
                                        <Link href={ROUTES.HOME} onClick={() => setIsOpen(false)}>
                                            <Image src="/images/logo.svg" alt="Logo" width={180} height={24} />
                                        </Link>
                                    </SheetTitle>
                                </div>
                            </SheetHeader>

                            <nav className="px-4 py-6">
                                <div className="space-y-2">
                                    {NavItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium group"
                                            >
                                                <Icon className="h-5 w-5 text-gray-500 group-hover:text-blue-600" />
                                                <span>{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 pt-6 border-t">
                                    <div className="px-4 space-y-3">
                                        <p className="text-sm font-semibold text-gray-900">Liên hệ</p>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <p>(+84) 900 000 000</p>
                                            <p>urbanscale@uit-se.hcmuaf</p>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

export default Header
