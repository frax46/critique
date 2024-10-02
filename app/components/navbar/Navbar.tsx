"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md z-10">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="text-pink-500 font-bold text-xl"><Image src="/logo_homecritique.png" alt="Logo" width={100} height={100} /></div>
        <div className="hidden md:flex items-center space-x-4">
        
          
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition duration-300">Home</Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition duration-300">About</Link>
          <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition duration-300">Services</Link>
          <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition duration-300">Contact</Link>
          {user && user.primaryEmailAddress?.emailAddress === 'annobilfrance@gmail.com' && (
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition duration-300">Dashboard</Link>
          )}
          {user ? (
            <UserButton />
          ) : (
            <SignInButton>
              <button className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition duration-300">Login</button>
            </SignInButton>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 dark:text-gray-300 focus:outline-none">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800">
          <Link href="/" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Home</Link>
          <Link href="/about" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">About</Link>
          <Link href="/services" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Services</Link>
          <Link href="/contact" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Contact</Link>
          {user && user.primaryEmailAddress?.emailAddress === 'annobilfrance@gmail.com' && (
            <Link href="/dashboard" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</Link>
          )}
          {user ? (
            <UserButton />
          ) : (
            <SignInButton>
              <button className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Login</button>
            </SignInButton>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
