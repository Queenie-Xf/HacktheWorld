import type { Metadata } from "next";
import "./globals.css";

// 我们删除了原本的 Geist 导入和初始化函数，因为它们需要连接 Google

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
        className="antialiased"
        style={{
          // 直接使用系统内置字体，不产生任何网络请求，所有人都能秒开网页
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Microsoft YaHei", sans-serif'
        }}
      >
        {children}
      </body>
    </html>
  );
}