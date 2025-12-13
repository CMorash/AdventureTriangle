import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import DarkModeToggle from "./components/ui/DarkModeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adventure Triangle - Pre-Launch | Discover Global Adventures",
  description: "Adventure Triangle is a global adventure activity marketplace helping travelers discover and book verified experiences across water, air, and land. Launching January 26, 2026.",
  keywords: ["adventure", "travel", "water activities", "air activities", "land activities", "adventure booking"],
  openGraph: {
    title: "Adventure Triangle - Pre-Launch",
    description: "Discover and book verified adventure experiences worldwide. Launching January 26, 2026.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adventure Triangle - Pre-Launch",
    description: "Discover and book verified adventure experiences worldwide.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <DarkModeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
