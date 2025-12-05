import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Manrope, Space_Grotesk } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Max Burleigh — Web Design & Development",
  description:
    "The official portfolio website of Max Burleigh – web developer, project manager, and solopreneur based in Medford, Oregon. Explore projects, skills, and contact information.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hdrs = await headers();
  const ua = hdrs.get("user-agent") ?? "";
  const isIOS = /iPad|iPhone|iPod/i.test(ua);
  const htmlClass = `${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${spaceGrotesk.variable} ${
    isIOS ? "is-ios-device" : "not-ios-device"
  }`;
  return (
    <html lang="en" className={htmlClass} suppressHydrationWarning>
      <body className="antialiased">
        <div id="site-root">
          {children}
        </div>
      </body>
    </html>
  );
}
