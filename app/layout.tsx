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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
               var html = document.documentElement;
               var ss = sessionStorage;
               var played = ss.getItem('introPlayed') === '1';

               if (reduce || played) {
                 html.setAttribute('data-intro-played', '1');
                 return;
               }

               // First time this tab: mark as played and gate the UI
               ss.setItem('introPlayed', '1');
               html.setAttribute('data-intro-played', '0');

               // Flip the gate when the CSS animation should have finished.
               // Keep in sync with @keyframes duration in globals.css
               var D = 900; // ms
               setTimeout(function () {
                 html.setAttribute('data-intro-played', '1');
               }, D + 50);
             } catch (e) {}
           })();`}
        </Script>
        {/* Gate only this subtree during the intro */}
        <div id="site-root">
          <ReactScan />
          {children}
        </div>
        {/* Overlay sits outside the gate */}
        <IntroReveal />
      </body>
    </html>
  );
}
