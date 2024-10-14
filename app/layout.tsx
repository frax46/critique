import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

import Navbar from "./components/navbar/Navbar";
import Modal from "./components/modals/Modal";
import ToasterProvider from "@/providers/ToasterProvider";
import { ModalProvider } from "@/providers/modal-providers";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home Critique",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-white`}>
          <ModalProvider />
          <ToasterProvider />
          <Navbar />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
