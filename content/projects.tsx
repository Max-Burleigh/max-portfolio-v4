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
  SiSquarespace,
  SiVercel,
} from "react-icons/si";
import { ModernWindowsIcon } from "@components/Icons";
import type { ProjectCardProps } from "@components/projects/ProjectCard";

export type ProjectEntry = ProjectCardProps & { id: string; hidden?: boolean };

const iconStyle = { width: "32px", height: "32px" } as const;
export const projects: ProjectEntry[] = [
  {
    id: "vinscribe",
    title: "VINSCRIBE",
    description: "AI vehicle reports and automotive tools.",
    websiteUrl: "https://www.vinscribe.com",
    className: "vinscribe-card",
    techStack: [
      {
        icon: (
          <Image src="/next.svg" alt="Next.js" width={32} height={32} className="tech-icon nextjs" />
        ),
        label: "Next.js",
      },
      { icon: <SiVercel className="tech-icon vercel" style={iconStyle} color="#fff" />, label: "Vercel" },
      { icon: <SiFirebase className="tech-icon firebase" style={iconStyle} color="#fff" />, label: "Firebase" },
      { icon: <SiTypescript className="tech-icon typescript" style={iconStyle} color="#fff" />, label: "TypeScript" },
      { icon: <SiTailwindcss className="tech-icon tailwind" style={iconStyle} color="#fff" />, label: "TailwindCSS" },
    ],
    imageUrl: "/project-images/vinscribe-standard-phone.png",
    imageAlt: "Screenshot of VINSCRIBE website",
    imageTitle: "VINSCRIBE Website Screenshot",
    imageBlurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkyIiBoZWlnaHQ9IjEyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzIwMjAyMCIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMDEwMTAiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==",
    disablePhoneMockup: true,
    overlay: { href: "https://www.vinscribe.com", emoji: "🚗", className: "vinscribe-message" },
  },
  {
    id: "fullleaf-tea",
    title: "Full Leaf Tea Company",
    description: "Premium loose-leaf tea ecommerce at scale.",
    websiteUrl: "https://fullleafteacompany.com",
    className: "fullleaf-card full-leaf-tea-card",
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
    imageUrl: "/project-images/full-leaf-tea-standard-phone.png",
    imageAlt: "Screenshot of Full Leaf Tea Company website",
    imageTitle: "Full Leaf Tea Company Website Screenshot",
    imageClassName: "fullleaf-tea",
    imageBlurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzIwNWUzYiIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMDMwMjAiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==",
    overlay: { href: "https://fullleafteacompany.com", emoji: "🫖", className: "fullleaf-message" },
  },
  {
    id: "fullleaf-wholesale",
    title: "Full Leaf Tea Company Wholesale",
    description: "B2B tea ordering for wholesale partners.",
    websiteUrl: "https://wholesale.fullleafteacompany.com",
    className: "fullleaf-wholesale-card full-leaf-wholesale-card",
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
    imageUrl: "/project-images/full-leaf-wholesale-standard-phone.png",
    imageAlt: "Screenshot of Full Leaf Tea Company Wholesale website",
    imageTitle: "Full Leaf Tea Company Wholesale Website Screenshot",
    imageClassName: "fullleaf-wholesale",
    imageBlurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzMzNWUzYiIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxZjJmMjAiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==",
    overlay: { href: "https://wholesale.fullleafteacompany.com", emoji: "📦", className: "fullleaf-wholesale-message" },
  },
  {
    id: "fullleaf-app",
    title: "Full Leaf App",
    description: "Flutter WebView app for Full Leaf Tea Company.",
    className: "full-leaf-app-card flex flex-col items-center",
    disablePhoneMockup: true,
    techStack: [
      { icon: <SiFlutter className="tech-icon flutter" style={iconStyle} />, label: "Flutter" },
      { icon: <SiXcode className="tech-icon xcode" style={iconStyle} />, label: "Xcode" },
      { icon: <SiAndroidstudio className="tech-icon android-studio" style={iconStyle} />, label: "Android Studio" },
    ],
    imageUrl: "/project-images/full-leaf-app-standard-phone.png",
    imageAlt: "Portrait screenshot of Full Leaf App",
    imageTitle: "Full Leaf App Screenshot",
  },
  {
    id: "farm-flour",
    title: "Farm & Flour",
    description: "Bakery and cafe site for menu, story, and visits.",
    websiteUrl: "https://farmandflourjville.com",
    className: "farm-flour-card",
    disablePhoneMockup: true,
    techStack: [
      {
        icon: (
          <Image src="/next.svg" alt="Next.js" width={32} height={32} className="tech-icon nextjs" />
        ),
        label: "Next.js",
      },
      { icon: <SiVercel className="tech-icon vercel" style={iconStyle} color="#fff" />, label: "Vercel" },
      { icon: <SiTailwindcss className="tech-icon tailwind" style={iconStyle} color="#fff" />, label: "TailwindCSS" },
      { icon: <SiHtml5 className="tech-icon html5" style={iconStyle} />, label: "HTML" },
      { icon: <SiCss3 className="tech-icon css3" style={iconStyle} color="#fff" />, label: "CSS" },
    ],
    imageUrl: "/project-images/farm-flour-standard-phone.png",
    imageAlt: "Screenshot of Farm & Flour website",
    imageTitle: "Farm & Flour Website Screenshot",
    imageClassName: "farm-flour",
    imageBlurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkyIiBoZWlnaHQ9IjEyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzJhMWYxNSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxNTEwMGEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==",
    overlay: { href: "https://farmandflourjville.com", emoji: "🥖", className: "farm-flour-message" },
  },
  {
    id: "jefferson-state-outfitters",
    title: "Jefferson State Outfitters",
    description: "Rogue River rafting and fishing guide website.",
    websiteUrl: "https://jeffersonstateoutfitter.com",
    className: "jefferson-state-card",
    disablePhoneMockup: true,
    techStack: [
      {
        icon: (
          <Image src="/next.svg" alt="Next.js" width={32} height={32} className="tech-icon nextjs" />
        ),
        label: "Next.js",
      },
      { icon: <SiVercel className="tech-icon vercel" style={iconStyle} color="#fff" />, label: "Vercel" },
      { icon: <SiTailwindcss className="tech-icon tailwind" style={iconStyle} color="#fff" />, label: "TailwindCSS" },
      { icon: <SiHtml5 className="tech-icon html5" style={iconStyle} />, label: "HTML" },
      { icon: <SiCss3 className="tech-icon css3" style={iconStyle} color="#fff" />, label: "CSS" },
    ],
    imageUrl: "/project-images/jefferson-state-standard-phone.png",
    imageAlt: "Screenshot of Jefferson State Outfitters website",
    imageTitle: "Jefferson State Outfitters Website Screenshot",
    imageClassName: "jefferson-state",
    imageBlurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTk0IiBoZWlnaHQ9IjEyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzJhMmExYSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxYTFhMGEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==",
    overlay: { href: "https://jeffersonstateoutfitter.com", emoji: "🎣", className: "jefferson-state-message" },
  },
  {
    id: "erin-kiernan-photography",
    title: "Erin Kiernan Photography",
    description: "Photography portfolio with booking-focused polish.",
    websiteUrl: "https://www.erinkiernanphotography.com",
    className: "erin-kiernan-card",
    disablePhoneMockup: true,
    techStack: [
      { icon: <SiSquarespace className="tech-icon squarespace" style={iconStyle} color="#fff" />, label: "Squarespace" },
      { icon: <SiHtml5 className="tech-icon html5" style={iconStyle} />, label: "HTML" },
      { icon: <SiCss3 className="tech-icon css3" style={iconStyle} color="#fff" />, label: "CSS" },
      { icon: <SiJavascript className="tech-icon javascript" style={iconStyle} color="#fff" />, label: "JavaScript" },
    ],
    imageUrl: "/project-images/erin-kiernan-photography-standard-phone.png",
    imageAlt: "Screenshot of Erin Kiernan Photography website",
    imageTitle: "Erin Kiernan Photography Website Screenshot",
    imageClassName: "erin-kiernan",
    imageBlurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTk0IiBoZWlnaHQ9IjEyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzEwMmIzNyIgLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzY3YWJjZiIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwODE0MTgiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==",
    overlay: {
      href: "https://www.erinkiernanphotography.com",
      emoji: "📷",
      className: "erin-kiernan-message",
    },
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
    disablePhoneMockup: true,
    hidden: true,
  },
  {
    id: "shop-downtown",
    title: "Shop Downtown",
    description: "Local marketplace for downtown businesses.",
    websiteUrl: "https://shopdowntown.org/",
    className: "shopdowntown-card",
    techStack: [
      { icon: <SiHtml5 className="tech-icon html5" style={iconStyle} />, label: "HTML" },
      { icon: <SiCss3 className="tech-icon css3" style={iconStyle} color="#fff" />, label: "CSS" },
      { icon: <SiJavascript className="tech-icon javascript" style={iconStyle} color="#fff" />, label: "JavaScript" },
      { icon: <SiPhp className="tech-icon php" style={iconStyle} />, label: "PHP" },
      { icon: <SiMysql className="tech-icon mysql" style={iconStyle} />, label: "MySQL" },
    ],
    imageUrl: "/project-images/shop-downtown-standard-phone.png",
    imageAlt: "Screenshot of Shop Downtown website",
    imageTitle: "Shop Downtown Website Screenshot",
    disablePhoneMockup: true,
    overlay: { href: "https://shopdowntown.org/", emoji: "🏪", className: "shopdowntown-message" },
  },
];
