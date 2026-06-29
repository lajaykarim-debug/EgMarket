import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "EGMarket — Compra y vende en Guinea Ecuatorial",
    template: "%s | EGMarket",
  },
  description: "El marketplace de Guinea Ecuatorial. Compra y vende productos nuevos y de segunda mano en Malabo, Bata y todo el país.",
  keywords: ["Guinea Ecuatorial", "marketplace", "comprar", "vender", "Malabo", "Bata", "anuncios"],
  authors: [{ name: "EGMarket" }],
  creator: "EGMarket",
  openGraph: {
    type: "website",
    locale: "es_GQ",
    url: defaultUrl,
    siteName: "EGMarket",
    title: "EGMarket — Compra y vende en Guinea Ecuatorial",
    description: "El marketplace de Guinea Ecuatorial. Compra y vende en Malabo, Bata y todo el país.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EGMarket — Compra y vende en Guinea Ecuatorial",
    description: "El marketplace de Guinea Ecuatorial.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#006B3C" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EGMarket" />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}