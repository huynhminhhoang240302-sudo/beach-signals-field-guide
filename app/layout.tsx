import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beach/Signals — Read the Coast, Enjoy It Safely",
  description: "An immersive, interactive field guide to nine hidden beach hazards and the calm actions that keep a day by the water safer.",
  icons: { icon: "/mascot.webp", shortcut: "/mascot.webp" },
  openGraph: {
    title: "Beach/Signals — The Beach Is Not Always Safe",
    description: "Learn to spot nine hidden beach hazards through a cinematic interactive field guide.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Beach/Signals",
    description: "Read the coast. Enjoy it safely.",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
