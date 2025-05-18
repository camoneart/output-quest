import React from "react";
import { Footer } from "@/components/layout/Footer";
import { DotGothic16 } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { baseMetadata } from "@/config/metadata";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { HeroProvider } from "@/contexts/HeroContext";
import CommonContainer from "@/components/common/container/CommonContainer";
import "../styles/globals.css";
import { ControlViewport } from "@/components/layout/ControlViewport/ControlViewport";

const dotGothic16 = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dot-gothic-16",
  display: "swap",
});

export const metadata: Metadata = {
  ...baseMetadata,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const redirectUrl = "/connection";
  const redirectUrl = process.env.NEXT_PUBLIC_CONNECTION_URL || "/connection";
  return (
    <ClerkProvider
      afterSignOutUrl={redirectUrl}
    >
      <html lang="ja" className={`${dotGothic16.variable}`}>
        <body suppressHydrationWarning>
          <HeroProvider>
            <CommonContainer>
              <ControlViewport />
              <Header />
              {children}
              <Footer />
            </CommonContainer>
          </HeroProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
