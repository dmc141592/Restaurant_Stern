import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Restaurant Sternen Albisrieden – Zürich",
  description:
    "Traditionelle Schweizer Küche im Herzen von Albisrieden. Gemütliches Restaurant, lauschiger Garten und Räumlichkeiten für Ihre Feiern.",
  authors: [{ name: "Restaurant Sternen Albisrieden" }],
  openGraph: {
    title: "Restaurant Sternen Albisrieden – Zürich",
    description: "Warme Gastfreundschaft, saisonale Küche, Gartenrestaurant. Jetzt Tisch reservieren.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <TooltipProvider>
          {children}
          <Toaster position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
