import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PreloaderWrapper from "@/components/PreloaderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Explicit Promotions",
  description: "Campaign management and promotions analytics dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PreloaderWrapper>{children}</PreloaderWrapper>
      </body>
    </html>
  );
}
