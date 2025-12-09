import type { Metadata } from "next";
import { loadData } from "@/lib/loadData";
import "./globals.css";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await loadData();
  const title = site?.title ?? "Flare 导航";
  return {
    title,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
