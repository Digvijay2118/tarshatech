"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { metadata } from "./metadata";
import { useEffect } from "react";



const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("bootstrap/dist/js/bootstrap.min.js");
    }
  }, []);



  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo2.png" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={inter.className}>


    
        {children}
      </body>
    </html>
  );
}
