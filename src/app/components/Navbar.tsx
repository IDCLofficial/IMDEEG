'use client';
import NavLinks from "./NavLinks"
import { FiMenu } from "react-icons/fi";

interface NavbarProps {
  onOpenSidebar: () => void;
}

export const Navbar = ({ onOpenSidebar }: NavbarProps) => {
    return(
        <header className="flex justify-between items-center px-[3rem] py-[1.5rem] fixed top-0 left-0 right-0 z-50 border-b border-b-[0.1px] border-[#FFFFFF] bg-[#232c39]/50 backdrop-blur-sm">
            <div>
                {/* <Image src="/logo.png" alt="logo" width={100} height={100} /> */}
                <h1 className="text-white text-[1.5rem] font-bold">Logo</h1>
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
        </header>
    )
}