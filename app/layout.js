import { Inter } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/shareMeta";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const description =
  "Student Unique Christian Fellowship, University of Nigeria Enugu Campus — reaching students and nurturing them through Bible engagement to become committed Christians of influence.";

export const metadata = {
  // Absolute base for share previews — without it, Open Graph image paths stay
  // relative and social crawlers can't resolve them.
  metadataBase: new URL(siteUrl),
  title: {
    default: "SUCF UNEC — The Unique Fellowship",
    template: "%s | SUCF UNEC",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "SUCF UNEC",
    title: "SUCF UNEC — The Unique Fellowship",
    description,
    url: siteUrl,
    images: [{ url: "/assets/logo.png", alt: "SUCF UNEC" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SUCF UNEC — The Unique Fellowship",
    description,
    images: ["/assets/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
