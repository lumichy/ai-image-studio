import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n-context';

export const metadata: Metadata = {
  title: 'AI Image Studio',
  description: 'AI-powered creative image generation tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
