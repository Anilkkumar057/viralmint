import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viral Mint",
  description: "Emotionally intelligent creator OS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}