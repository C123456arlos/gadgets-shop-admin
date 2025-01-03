import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/src/styles/globals.css";
import { ThemeProvider } from "../providers/theme-provider";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Esteban rn-shop",
  description: "React native shop - Esteban",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        ><main>{children}</main><Toaster richColors></Toaster></ThemeProvider>
      </body>
    </html>
  );
}
