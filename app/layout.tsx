import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EK — El Kurdi | Web & Mobile App Development",
  description:
    "EK builds fast, reliable web and mobile applications. Tell us what you need and we'll build it — from idea to launch.",
  metadataBase: new URL("https://elkurdi.co"),
  openGraph: {
    title: "EK — El Kurdi",
    description: "Web & mobile app development. From idea to launch.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
