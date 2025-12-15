import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aviva Wallboards",
  description: "Contact Center Wallboards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="min-h-screen w-full flex flex-col items-center justify-start gap-3 bg-slate-50 dark:bg-slate-900" >
          <Image
            src="/aviva.svg"
            alt="Company logo"
            width={200}
            height={200}
            className="w-40 md:w-48 lg:w-56 xl:w-64 h-auto pt-2"
          />
          {children}
        </main>
      </body>
    </html>
  );
}
