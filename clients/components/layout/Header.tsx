"use client";
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"

const Header = () => {
    const NavItems = [
        {name: "Home", href: "/"},
        {name: "About", href: "/about"},
        {name: "Industries", href: "/industries"},
        {name: "Blog", href: "/blog"},
        {name: "Resources", href: "/resources"},
        {name: "Support", href: "/support"},
    ]

    const [scrolled, setScrolled] = useState(false);

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
            className={`px-4 sm:px-6 md:px-10 lg:px-12 fixed top-0 left-0 w-full z-50 text-white/95 border-b border-transparent transition-colors duration-200 ${scrolled ? "bg-black" : "bg-transparent"}`}
        >
            <div className="header-inner h-16 sm:h-20 flex justify-between items-center transition-[height] duration-200 ">
                <div className="flex items-center ">
                    <Link href="/" className="logo-text text-2xl font-semibold italic tracking-wide hover:opacity-90 transition-opacity">
                        URBAN <span className="text-white/90">SCALE</span>
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    {NavItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="nav-link transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link href="/login">
                        <Button
                            className="login-btn rounded-full bg-transparent border border-white/60 text-white hover:bg-white/10 px-5 lg:px-6 h-10 lg:h-11 transition-colors"
                            variant="outline"
                        >
                            Login
                        </Button>
                    </Link>
                </nav>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="mobile-menu-trigger rounded-full h-10 w-10 p-0 transition-colors">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-background text-foreground">
                            <SheetHeader>
                                <SheetTitle>
                                    <Link href="/" className="text-xl font-semibold italic tracking-wide">
                                        URBAN <span className="text-primary">X</span>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="mt-2 flex flex-col gap-3">
                                {NavItems.map((item) => (
                                    <Link key={item.name} href={item.href} className="text-foreground/90 hover:text-foreground text-base">
                                        {item.name}
                                    </Link>
                                ))}
                                <Link href="/login">
                                    <Button className="mt-2 rounded-full" variant="outline">Login</Button>
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}


export default Header


