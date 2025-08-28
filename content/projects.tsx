"use client";
import React from "react";
import Image from "next/image";
import {
  SiFirebase,
  SiTypescript,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiGoogle,
  SiShopify,
  SiPhp,
  SiMysql,
  SiFlutter,
  SiXcode,
  SiAndroidstudio,
  SiNextdotjs,
  SiSupabase,
  SiVercel,
} from "react-icons/si";
import { ModernWindowsIcon } from "@components/icons";
import type { ProjectCardProps } from "@components/projects/shared/types";
import ProjectOverlay from "@components/projects/shared/ProjectOverlay";

export type ProjectEntry = ProjectCardProps & { id: string };

const iconStyle = { width: "32px", height: "32px" } as const;

export const projects: ProjectEntry[] = [
  {
    id: "vinscribe",
    title: "VINSCRIBE",
    description: "AI-driven vehicle history reports and automotive tools.",
    websiteUrl: "https://www.vinscribe.com",
    className: "vinscribe-card",
    techStack: [
      {
        icon: (
          <Image src="/next.svg" alt="Next.js" width={32} height={32} className="tech-icon nextjs" />
        ),
        label: "Next.js",
      },
      { icon: <SiFirebase className="tech-icon firebase" style={iconStyle} color="#fff" />, label: "Firebase" },
      { icon: <SiTypescript className="tech-icon typescript" style={iconStyle} color="#fff" />, label: "TypeScript" },
      { icon: <SiTailwindcss className="tech-icon tailwind" style={iconStyle} color="#fff" />, label: "TailwindCSS" },
    ],
    imageUrl: "/project-images/vinscribe-phone-mockup-corner-to-corner.png",
    imageAlt: "Screenshot of VINSCRIBE website",
    imageTitle: "VINSCRIBE Website Screenshot",
    imageBlurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkyIiBoZWlnaHQ9IjEyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzIwMjAyMCIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMDEwMTAiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==",
    disablePhoneMockup: true,
    children: (
      <ProjectOverlay href="https://www.vinscribe.com" emoji="🚗" className="vinscribe-message" />
    ),
  },
  {
    id: "fullleaf-tea",
    title: "Full Leaf Tea Company",
    description: (
      <>
        <p>Multi-million dollar ecommerce business for premium loose leaf tea.</p>
        <p>Designed/developed by yours truly.</p>
      </>
    ),
    websiteUrl: "https://fullleafteacompany.com",
    className: "fullleaf-card full-leaf-tea-card",
    reverseLayout: true,
    disablePhoneMockup: true,
    techStack: [
      { icon: <SiHtml5 className="tech-icon html5" style={iconStyle} />, label: "HTML" },
      { icon: <SiCss3 className="tech-icon css3" style={iconStyle} color="#fff" />, label: "CSS" },
      { icon: <SiJavascript className="tech-icon javascript" style={iconStyle} color="#fff" />, label: "JavaScript" },
      {
        icon: (
          <Image src="/webp/klaviyo.webp" alt="Klaviyo" width={38} height={38} className="tech-icon klaviyo" />
        ),
        label: "Klaviyo",
      },
      { icon: <SiGoogle className="tech-icon google" style={iconStyle} />, label: "Google Ads" },
      { icon: <ModernWindowsIcon className="tech-icon windows" style={iconStyle} />, label: "Microsoft Ads" },
    ],
    imageUrl: "/project-images/full-leaf-tea-phone-mockup-corner-to-corner.png",
    imageAlt: "Screenshot of Full Leaf Tea Company website",
    imageTitle: "Full Leaf Tea Company Website Screenshot",
    imageClassName: "fullleaf-tea",
    imageBlurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzIwNWUzYiIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMDMwMjAiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==",
    children: (
      <ProjectOverlay href="https://fullleafteacompany.com" emoji="🫖" className="fullleaf-message" />
    ),
  },
  {
    id: "fullleaf-wholesale",
    title: "Full Leaf Tea Company Wholesale",
    description: (
      <>
        <p>B2B wholesale platform for bulk tea orders and business partnerships.</p>
        <p>Enabling cafes, restaurants, and retailers to source premium tea.</p>
      </>
    ),
    websiteUrl: "https://wholesale.fullleafteacompany.com",
    className: "fullleaf-wholesale-card full-leaf-wholesale-card",
    reverseLayout: false,
    disablePhoneMockup: true,
    techStack: [
      { icon: <SiShopify className="tech-icon shopify" style={iconStyle} color="#fff" />, label: "Shopify" },
      { icon: <SiHtml5 className="tech-icon html5" style={iconStyle} />, label: "HTML" },
      { icon: <SiCss3 className="tech-icon css3" style={iconStyle} color="#fff" />, label: "CSS" },
      { icon: <SiJavascript className="tech-icon javascript" style={iconStyle} color="#fff" />, label: "JavaScript" },
      {
        icon: (
          <Image src="/webp/klaviyo.webp" alt="Klaviyo" width={38} height={38} className="tech-icon klaviyo" />
        ),
        label: "Klaviyo",
      },
    ],
    imageUrl: "/project-images/wholesale-full-leaf-phone-mockup-corner-to-corner.png",
    imageAlt: "Screenshot of Full Leaf Tea Company Wholesale website",
    imageTitle: "Full Leaf Tea Company Wholesale Website Screenshot",
    imageClassName: "fullleaf-wholesale",
    imageBlurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzMzNWUzYiIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxZjJmMjAiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==",
    children: (
      <ProjectOverlay href="https://wholesale.fullleafteacompany.com" emoji="📦" className="fullleaf-wholesale-message" />
    ),
  },
  {
    id: "fullleaf-app",
    title: "Full Leaf App",
    description: (
      <>
        A Flutter-based, WebView app for Full Leaf Tea Company.
        <div className="flex justify-center md:justify-start items-center my-4 px-2">
          <div
            className="flex flex-row justify-center md:justify-start items-center text-base font-bold uppercase tracking-wider"
            style={{
              fontFamily:
                "'Brush Script MT', 'Brush Script Std', 'Lucida Calligraphy', 'Lucida Handwriting', cursive",
            }}
          >
            <a
              href="https://apps.apple.com/us/app/full-leaf-tea-co/id6451437741"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1.5 text-cyan-400 hover:text-cyan-300 hover:brightness-150 transition-all duration-200 underline"
              style={{
                textShadow:
                  "0 0 5px #fff, 0 0 10px #67e8f9, 0 0 15px #22d3ee, 0 0 20px #22d3ee, 0 0 25px #06b6d4, 0 0 30px #06b6d4",
              }}
            >
              App&nbsp;Store
            </a>
            <span
              className="mx-2 text-xl md:text-2xl text-neutral-400 select-none"
              style={{
                fontFamily:
                  "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Liberation Sans', sans-serif",
                fontWeight: 700,
                lineHeight: 1,
                display: "inline-block",
                verticalAlign: "middle",
                letterSpacing: "0",
              }}
              aria-hidden="true"
            >
              ·
            </span>
            <a
              href="https://play.google.com/store/apps/details?id=fullleafteacompany.android.app&hl=en_US&pli=1"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1.5 text-cyan-400 hover:text-cyan-300 hover:brightness-150 transition-all duration-200 underline"
              style={{
                textShadow:
                  "0 0 5px #fff, 0 0 10px #67e8f9, 0 0 15px #22d3ee, 0 0 20px #22d3ee, 0 0 25px #06b6d4, 0 0 30px #06b6d4",
              }}
            >
              Play&nbsp;Store
            </a>
          </div>
        </div>
      </>
    ),
    className: "full-leaf-app-card flex flex-col items-center",
    disablePhoneMockup: true,
    techStack: [
      { icon: <SiFlutter className="tech-icon flutter" style={iconStyle} />, label: "Flutter" },
      { icon: <SiXcode className="tech-icon xcode" style={iconStyle} />, label: "Xcode" },
      { icon: <SiAndroidstudio className="tech-icon android-studio" style={iconStyle} />, label: "Android Studio" },
    ],
    imageUrl: "/webp/app.webp",
    imageAlt: "Portrait screenshot of Full Leaf App",
    imageTitle: "Full Leaf App Screenshot",
  },
  {
    id: "quailmail",
    title: "Quailmail",
    description: (
      <>
        An autonomous AI email agent.
        <br />
        <span className="italic text-sm text-[#00ffd5]">
          (Under construction, preview link coming soon)
        </span>
      </>
    ),
    className: "quailmail-card text-center md:text-left",
    imageUrl: "/webp/quailmail.webp",
    imageAlt: "Quailmail application screenshot",
    imageBlurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzIwMjAzMCIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMDEwMjAiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==",
    techStack: [
      { icon: <SiNextdotjs className="tech-icon nextjs" style={iconStyle} />, label: "NextJS" },
      { icon: <SiTailwindcss className="tech-icon tailwindcss" style={iconStyle} />, label: "TailwindCSS" },
      { icon: <SiSupabase className="tech-icon supabase" style={iconStyle} />, label: "Supabase" },
      { icon: <SiVercel className="tech-icon vercel" style={iconStyle} />, label: "Vercel" },
    ],
    reverseLayout: true,
    disablePhoneMockup: true,
  },
  {
    id: "shop-downtown",
    title: "Shop Downtown",
    description: "Community-driven online marketplace for local businesses.",
    websiteUrl: "https://shopdowntown.org/",
    className: "shopdowntown-card",
    reverseLayout: false,
    techStack: [
      { icon: <SiHtml5 className="tech-icon html5" style={iconStyle} />, label: "HTML" },
      { icon: <SiCss3 className="tech-icon css3" style={iconStyle} color="#fff" />, label: "CSS" },
      { icon: <SiJavascript className="tech-icon javascript" style={iconStyle} color="#fff" />, label: "JavaScript" },
      { icon: <SiPhp className="tech-icon php" style={iconStyle} />, label: "PHP" },
      { icon: <SiMysql className="tech-icon mysql" style={iconStyle} />, label: "MySQL" },
    ],
    imageUrl: "/project-images/shop-downtown-mockup-corner-to-corner.png",
    imageAlt: "Screenshot of Shop Downtown website",
    imageTitle: "Shop Downtown Website Screenshot",
    disablePhoneMockup: true,
    children: (
      <ProjectOverlay href="https://shopdowntown.org/" emoji="🏪" className="shopdowntown-message" />
    ),
  },
  {
    id: "carly",
    title: "Carly Pearl-Sacks Photography",
    description: "Portfolio site for a professional photographer. Built with Next.js and TailwindCSS.",
    websiteUrl: "https://carlypsphoto.com",
    className: "carlypsphoto-card",
    reverseLayout: true,
    techStack: [
      {
        icon: <Image src="/next.svg" alt="Next.js" width={32} height={32} className="tech-icon nextjs" />,
        label: "Next.js",
      },
      { icon: <SiTailwindcss className="tech-icon tailwind" style={iconStyle} color="#fff" />, label: "TailwindCSS" },
    ],
    imageUrl: "/project-images/carly-phone-mockup-corner-to-corner.png",
    imageAlt: "Screenshot of Carly Pearl-Sacks Photography website",
    imageTitle: "Carly Pearl-Sacks Photography Website Screenshot",
    imageBlurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkyIiBoZWlnaHQ9IjEyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzIwMjAyMCIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMDEwMTAiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==",
    disablePhoneMockup: true,
    children: (
      <ProjectOverlay href="https://carlypsphoto.com" emoji="📸" className="carly-message" />
    ),
  },
];
