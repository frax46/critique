"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`fixed top-4 left-0 right-0 w-11/12 mx-auto z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-3"
      } bg-white bg-opacity-60 backdrop-blur-md rounded-2xl shadow-md`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/logo_homecritique.png"
              alt="Logo"
              width={40}
              height={40}
              className="mr-2"
            />
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/" active={pathname === "/"}>
              Home
            </NavLink>
            <NavLink href="/search" active={pathname === "/search"}>
              <FaSearch className="text-blue-600" />
            </NavLink>
            {user && (
              <>
                <NavLink
                  href="/my-critiques"
                  active={pathname === "/my-critiques"}
                >
                  My critiques
                </NavLink>
                <NavLink
                  href={process.env.NEXT_PUBLIC_STRIPE_CUSOMER_PORTAL_URL!}
                  active={
                    pathname ===
                    process.env.NEXT_PUBLIC_STRIPE_CUSOMER_PORTAL_URL
                  }
                >
                  Subscirtion portal
                </NavLink>
              </>
            )}
            <NavLink href="/about" active={pathname === "/about"}>
              About
            </NavLink>
            <NavLink href="/services" active={pathname === "/services"}>
              Services
            </NavLink>
            <NavLink href="/contact" active={pathname === "/contact"}>
              Contact
            </NavLink>
            <NavLink href="/subscribe" active={pathname === "/subscribe"}>
              Subscribe
            </NavLink>

            {user &&
              user.primaryEmailAddress?.emailAddress ===
                "annobilfrance@gmail.com" && (
                <NavLink href="/dashboard" active={pathname === "/dashboard"}>
                  Dashboard
                </NavLink>
              )}
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton>
                <button className="bg-blue-600 text-white px-4 py-1 rounded-full shadow-md hover:bg-blue-700 transition duration-300 text-sm font-semibold">
                  Login
                </button>
              </SignInButton>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-blue-600 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-3xl overflow-hidden mt-2">
          <NavLink href="/" active={pathname === "/"} mobile>
            Home
          </NavLink>
          <NavLink href="/about" active={pathname === "/about"} mobile>
            About
          </NavLink>
          <NavLink href="/services" active={pathname === "/services"} mobile>
            Services
          </NavLink>
          <NavLink href="/contact" active={pathname === "/contact"} mobile>
            Contact
          </NavLink>
          <NavLink href="/subscribe" active={pathname === "/subscribe"} mobile>
            Subscribe
          </NavLink>
          <NavLink href="/search" active={pathname === "/search"} mobile>
            <div className="flex items-center">
              <FaSearch className="mr-2" />
              Search
            </div>
          </NavLink>
          {user &&
            user.primaryEmailAddress?.emailAddress ===
              "annobilfrance@gmail.com" && (
              <NavLink
                href="/dashboard"
                active={pathname === "/dashboard"}
                mobile
              >
                Dashboard
              </NavLink>
            )}
          {user ? (
            <div className="px-4 py-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <SignInButton>
              <button className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 transition duration-300">
                Login
              </button>
            </SignInButton>
          )}
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active: boolean;
  mobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  active,
  mobile = false,
}) => {
  const baseClasses = "transition duration-300 font-medium text-sm";
  const desktopClasses = `text-blue-600 hover:text-blue-800 px-3 py-1 rounded-full ${
    active ? "bg-blue-100" : "hover:bg-blue-50"
  }`;
  const mobileClasses = `block px-4 py-2 ${
    active ? "bg-blue-100 text-blue-800" : "text-blue-600 hover:bg-blue-50"
  }`;

  return (
    <Link
      href={href}
      className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
