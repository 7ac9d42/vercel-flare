import type { Metadata } from "next";
import { loadData } from "@/lib/loadData";
import "./globals.css";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await loadData();
  const title = site?.title ?? "Flare 导航";
  const description =
    site?.description ?? "Flare 导航 - 简洁的起始页，快速打开常用站点和应用。";
  return {
    title,
    description,
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
