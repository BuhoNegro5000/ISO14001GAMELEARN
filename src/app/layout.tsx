import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://iso14001gamelearn.greenowllabs.space";
const siteName = "Green Owl Labs · ISO 14001 Learning Lab";
const siteDescription =
  "Simulador gamificado de Sistemas de Gestión Ambiental para aprender, practicar y demostrar la implementación de ISO 14001:2026.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s | Green Owl Labs",
  },
  description: siteDescription,
  applicationName: "ISO 14001 Learning Lab",
  generator: "Green Owl Labs",
  keywords: [
    "ISO 14001:2026",
    "sistema de gestión ambiental",
    "simulador ISO 14001",
    "Green Owl Labs",
    "aprendizaje ambiental",
  ],
  authors: [{ name: "Green Owl Labs", url: "https://greenowllabs.space" }],
  creator: "Green Owl Labs",
  publisher: "Green Owl Labs",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: "/brand/green-owl-logo.png",
        width: 1128,
        height: 1046,
        alt: "Green Owl Labs · ISO 14001 Learning Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/brand/green-owl-logo.png"],
  },
  icons: {
    icon: [
      { url: "/brand/green-owl-mark.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/brand/green-owl-mark.png",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
