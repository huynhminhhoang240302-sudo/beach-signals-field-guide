import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beach/Signals — Interactive Safety Presentation",
  description:
    "A click-through, 3D-guided presentation about nine hidden beach hazards and the calm actions that make a day by the water safer.",
  openGraph: {
    title: "Beach/Signals — Meet the Coast Before You Step In",
    description: "Explore nine beach hazards with an expressive 3D safety guide.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Beach/Signals",
    description: "Read the coast. Enjoy it safely.",
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
