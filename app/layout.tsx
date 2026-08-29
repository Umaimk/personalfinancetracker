import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "FinTrack",
  description: "Personal finance tracker capstone",
};

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/budgets", label: "Budgets" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="border-b border-black/10 px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4">
            <span className="font-semibold">FinTrack</span>
            <div className="flex flex-wrap gap-4 text-sm">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">{children}</main>
      </body>
    </html>
  );
}