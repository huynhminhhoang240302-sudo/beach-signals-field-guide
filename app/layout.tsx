import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beach/Signals — Interactive Safety Presentation",
  description:
    "An interactive beach-safety presentation with a coast-wide accident map and clear actions.",
  openGraph: {
    title: "Beach/Signals — Meet the Coast Before You Step In",
    description: "Explore beach hazards through an illustrated accident map and interactive scenes.",
    type: "website",
    images: ["https://beach-signals-field-guide.hoangfffff.chatgpt.site/og-monochrome.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beach/Signals",
    description: "Read the coast. Enjoy it safely.",
    images: ["https://beach-signals-field-guide.hoangfffff.chatgpt.site/og-monochrome.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#071019",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
