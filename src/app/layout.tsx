import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyHealth",
  description: "Health data ingestion & dashboard",
};

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
