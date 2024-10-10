"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'py-2' : 'py-4'
    } bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo_homecritique.png" alt="Logo" width={50} height={50} className="mr-2" />
            <span className="text-blue-600 dark:text-blue-300 font-bold text-2xl">HomeCritique</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/services">Services</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/subscribe">Subscribe</NavLink>
            <NavLink href="/search">
              <FaSearch className="text-blue-600 dark:text-blue-300" />
            </NavLink>
            {user && user.primaryEmailAddress?.emailAddress === 'annobilfrance@gmail.com' && (
              <NavLink href="/dashboard">Dashboard</NavLink>
            )}
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton>
                <button className="bg-white dark:bg-blue-600 text-blue-500 dark:text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300 font-semibold">
                  Login
                </button>
              </SignInButton>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-blue-600 dark:text-blue-300 focus:outline-none">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-blue-50 dark:bg-blue-800 shadow-lg rounded-b-3xl overflow-hidden mt-2">
          <NavLink href="/" mobile>Home</NavLink>
          <NavLink href="/about" mobile>About</NavLink>
          <NavLink href="/services" mobile>Services</NavLink>
          <NavLink href="/contact" mobile>Contact</NavLink>
          <NavLink href="/subscribe" mobile>Subscribe</NavLink>
          <NavLink href="/search" mobile>
            <div className="flex items-center">
              <FaSearch className="mr-2" />
              Search
            </div>
          </NavLink>
          {user && user.primaryEmailAddress?.emailAddress === 'annobilfrance@gmail.com' && (
            <NavLink href="/dashboard" mobile>Dashboard</NavLink>
          )}
          {user ? (
            <div className="px-4 py-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <SignInButton>
              <button className="block w-full text-left px-4 py-2 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-700 transition duration-300">
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
  mobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, mobile = false }) => {
  const baseClasses = "transition duration-300 font-medium";
  const desktopClasses = "text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 px-4 py-2 rounded-full hover:bg-white dark:hover:bg-blue-700 shadow-sm hover:shadow-md";
  const mobileClasses = "block px-4 py-2 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-700";

  return (
    <Link href={href} className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}>
      {children}
    </Link>
  );
};

export default Navbar;
