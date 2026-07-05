import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 生图工作室',
  description: '基于 Agnes AI 的图片生成工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
