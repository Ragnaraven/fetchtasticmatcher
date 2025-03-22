import type { Metadata } from "next";
import { Quicksand, Space_Grotesk } from "next/font/google";
import { WelcomeProvider } from "@/contexts/WelcomeContext";
import "./globals.css";

const bodyFont = Quicksand({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const titleFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FetchtasticMatch - Find Your Perfect Companion",
  description: "Connect with your ideal furry friend through our intelligent dog matching platform.",
  keywords: "dog adoption, pet matching, find dogs, dog companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="retro">
      <body
        className={`${bodyFont.variable} ${titleFont.variable} font-body antialiased min-h-screen`}
      >
        <WelcomeProvider>
          {children}
        </WelcomeProvider>
      </body>
    </html>
  );
}
