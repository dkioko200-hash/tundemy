import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skilara - AI Skills Training for Kenya",
  description:
    "Learn practical AI skills and build real-world ability. Kenya's premier AI training platform for professionals and students.",
  keywords: ["AI training", "Kenya", "skills", "machine learning", "prompt engineering"],
  authors: [{ name: "Skilara" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Skilara - AI Skills Training for Kenya",
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
