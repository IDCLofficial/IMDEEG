'use client';
import Link from "next/link";
import NavLinks from "./NavLinks"
import { FiMenu } from "react-icons/fi";
import Image from "next/image";
import OfficeHours from "./OfficeHours";
import { useState, useEffect } from "react";

export const Navbar = ({ onOpenSidebar }: { onOpenSidebar: () => void }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return(
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#232c39]/20 backdrop-blur-sm`}>
            <nav className=" px-4 md:px-[3rem] py-[1.3rem] flex items-center justify-between w-full">
                <div className="w-[50px] h-[50px]">
                    {/* <Image src="/logo.png" alt="logo" width={100} height={100} /> */}
                    <Link href="/">
                        <Image src="/logo.png" alt="logo" width={50} height={50} className="object-contain"/>
                    </Link>
                </div>
                {/* Desktop NavLinks */}
                <div className="hidden md:block">
                    <NavLinks />
                </div>
                {/* Hamburger for Mobile */}
                <button
                    className="md:hidden text-white text-3xl focus:outline-none"
                    aria-label="Open navigation menu"
                    onClick={onOpenSidebar}
                    >
                    <FiMenu />
                </button>
            </nav>
            <OfficeHours />
        </header>
    )
}