'use client';
import Link from "next/link";
import NavLinks from "./NavLinks"
import { FiMenu } from "react-icons/fi";
import Image from "next/image";
import OfficeHours from "./OfficeHours";

interface NavbarProps {
  onOpenSidebar: () => void;
}

export const Navbar = ({ onOpenSidebar }: NavbarProps) => {
    return(
        <header className=" fixed top-0 left-0 right-0 z-50 bg-[#232c39]/50 backdrop-blur-sm">
            <nav className=" px-4 md:px-[3rem] py-[1.3rem] flex items-center justify-between w-full border-b-[0.1px] border-[#FFFFFF]">
                <div>
                    {/* <Image src="/logo.png" alt="logo" width={100} height={100} /> */}
                    <Link href="/">
                        <Image src="/logo.png" alt="logo" width={40} height={40} />
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