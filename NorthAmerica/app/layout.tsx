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

const TITLE = "chaserAI — AI OCR Software for Invoices, Bills & Receipts";
const DESCRIPTION =
  "chaserAI is AI-powered optical character recognition software that finds any invoice, bill, or receipt in plain English. Private by design, on-device index, for Mac and Windows.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: withBasePath("/chaser-logo.svg"),
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
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
