import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import { AuthProvider } from "@/components/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Aventa",
  description: "Events. Made Easy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />

          {children}

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}