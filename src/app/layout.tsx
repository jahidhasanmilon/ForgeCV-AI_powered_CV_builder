import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV with AI",
  description: "CVForge — AI powered CV builder for going abroad",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
