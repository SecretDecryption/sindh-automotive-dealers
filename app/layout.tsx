import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { dealer } from "@/lib/dealer";

export const metadata: Metadata = {
  metadataBase: new URL(dealer.website),
  title: {
    default: "Sindh Automotive Dealers | Quality Pre-Owned Vehicles",
    template: "%s | Sindh Automotive Dealers"
  },
  description: "Shop quality pre-owned luxury vehicles with confidence at Sindh Automotive Dealers.",
  openGraph: {
    title: "Sindh Automotive Dealers",
    description: "Premium inspected pre-owned vehicles, financing, and test drives.",
    url: dealer.website,
    siteName: "Sindh Automotive Dealers",
    images: [
      {
        url: "/sindh-logo.png",
        width: 1033,
        height: 421,
        alt: "Sindh Automotive Dealers logo"
      }
    ],
    locale: "en_CA",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Sindh Automotive Dealers",
    description: "Quality pre-owned vehicles and confident dealership service.",
    images: ["/sindh-logo.png"]
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
