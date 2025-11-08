import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "eCommerce Shop",
  description: "just shoping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Navbar />
          {children}
          <Toaster position="top-right" richColors />
        </ReduxProvider>
      </body>
    </html>
  );
}

