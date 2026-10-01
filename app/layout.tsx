import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";

export const dynamic = "force-dynamic";

const display = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});
const body = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "ShopNest",
  description: "A simple full-stack online store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} flex min-h-screen flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}