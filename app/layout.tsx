import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { withBasePath } from "@/lib/basePath";
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
  title: "chaserAI — Chase down any file. With AI.",
  description:
    "AI-powered desktop search. Find anything on your Mac in plain English — semantic, content-aware, and private by design.",
  icons: {
    icon: withBasePath("/chaser-logo.svg"),
  },
  openGraph: {
    title: "chaserAI — Chase down any file. With AI.",
    description:
      "AI-powered desktop search. Find anything on your Mac in plain English — semantic, content-aware, and private by design.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
