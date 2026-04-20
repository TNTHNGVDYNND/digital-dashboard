import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PreloaderWrapper from "@/components/PreloaderWrapper";

if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (args[0]?.toString?.().includes?.("THREE.Clock")) return;
    originalWarn.apply(console, args);
  };
}

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
