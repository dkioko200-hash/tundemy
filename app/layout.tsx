import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tundemy — Africa's AI Skills Platform",
  description:
    "Learn production-ready AI skills, complete real projects, and get hired through Africa's most verified AI talent pool.",
  keywords: ["AI training", "Africa", "skills", "machine learning", "prompt engineering"],
  authors: [{ name: "Tundemy" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Tundemy — Africa's AI Skills Platform",
    description: "Learn production-ready AI skills, complete real projects, and get hired through Africa's most verified AI talent pool.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
