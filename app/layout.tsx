import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skilara — Africa's AI Skills Platform",
  description:
    "Learn practical AI skills and build real-world ability. Africa's leading AI training platform for professionals and students.",
  keywords: ["AI training", "Africa", "skills", "machine learning", "prompt engineering"],
  authors: [{ name: "Skilara" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Skilara — Africa's AI Skills Platform",
    description: "Learn practical AI skills and build real-world ability.",
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
