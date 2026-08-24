import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Departure — AI CV Builder",
  description: "Next.js + Claude powered CV builder for going abroad",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
