import { ReactScan } from "./components/ReactScan";
import IntroReveal from "./components/IntroReveal";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Manrope, Space_Grotesk } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
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
  title: "Max Burleigh Portfolio - Official Website",
  description:
    "The official portfolio website of Max Burleigh – web developer, project manager, and solopreneur based in Medford, Oregon. Explore projects, skills, and contact information.",
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
        <Script id="intro-wash-boot" strategy="beforeInteractive">
          {`(function () {
             try {
               var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
               var played = sessionStorage.getItem('introPlayed') === '1';
               var html = document.documentElement;

               if (reduce || played) {
                 html.setAttribute('data-intro-played', '1');
                 return;
               }

               // First time this tab: mark as played and allow wash to render
               sessionStorage.setItem('introPlayed', '1');
               html.setAttribute('data-intro-played', '0');
             } catch (e) {}
           })();`}
        </Script>
        <ReactScan />
        {children}
        <IntroReveal />
      </body>
    </html>
  );
}
