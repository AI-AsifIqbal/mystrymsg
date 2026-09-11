import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import './globals.css'
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toast";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mystery Message | Anonymous Feedback & Messaging",
  description: "Dive into the world of anonymous conversations with Mystery Message. Ask questions and get true feedback without revealing identity.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <AuthProvider>
        <body className="min-h-full flex flex-col font-sans">
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
