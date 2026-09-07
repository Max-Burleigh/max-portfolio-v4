import { notFound } from "next/navigation";

export default function GetStartedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Preserve the intake flow for local development, but do not publish it.
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return children;
}
