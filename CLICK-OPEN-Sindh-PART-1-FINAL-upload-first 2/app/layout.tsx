import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { shareImage, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sindh Automotive Dealers | Quality Pre-Owned Vehicles",
    template: "%s | Sindh Automotive Dealers"
  },
  description: "Shop quality pre-owned vehicles with confidence at Sindh Automotive Dealers.",
  openGraph: {
    title: "Sindh Automotive Dealers",
    description: "Quality inspected pre-owned vehicles, financing, and test drives.",
    url: siteUrl,
    siteName: "Sindh Automotive Dealers",
    images: [shareImage],
    locale: "en_CA",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Sindh Automotive Dealers",
    description: "Quality pre-owned vehicles and confident dealership service.",
    images: [shareImage.url]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
