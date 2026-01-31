import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyHealth",
  description: "Health data ingestion & dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
