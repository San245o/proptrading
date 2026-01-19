import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Helix Prop | Sequence Trading Edge",
  description: "Modern prop firm landing page with cinematic sequence hero."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
