import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";

const robotomono = Roboto_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Youtube Downloader",
  description: "Download youtube videos as audio or video. For Free!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={robotomono.className}>
        <NavBar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
