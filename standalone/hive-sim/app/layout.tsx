import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HIVE SIM — High-Fidelity Clinical Simulation",
  description: "Browser-based immersive clinical simulation engine."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
