import type { Metadata } from "next";
import "./globals.css";

// 1. 移除了从 next/font/google 导入 Geist 的代码，防止网络请求

export const metadata: Metadata = {
  title: "Hack the World - AI Assistant",
  description: "基于 GLM-4-plus 的心理反思助手",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className="antialiased font-sans"
        style={{
          // 2. 直接定义常用的系统字体栈，确保在没有 Geist 字体时依然美观
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Microsoft YaHei", sans-serif'
        }}
      >
        {children}
      </body>
    </html>
  );
}