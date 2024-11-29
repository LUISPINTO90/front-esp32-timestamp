import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({ src: './fonts/Inter-VariableFont.ttf' });

export const metadata: Metadata = {
  title: 'Ethernet Gateway',
  description:
    'A simple dashboard to visualize the latency of data transfer between an ESP32 and an Arduino Uno connected via Ethernet.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
