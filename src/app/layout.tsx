import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import "@/app/globals.css";

import { AppProviders } from "@/components/providers/AppProviders";
import { createEventMock } from "@/mocks/event";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"]
});

const eventMetadata = createEventMock();

export const metadata: Metadata = {
  title: `${eventMetadata.title} Flash Sale | Flash Sale Engine`,
  description: eventMetadata.subtitle,
  openGraph: {
    title: `${eventMetadata.title} Flash Sale`,
    description: eventMetadata.subtitle,
    siteName: "Flash Sale Engine",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0B"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
