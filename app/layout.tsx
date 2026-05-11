import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumeAI — AI-Powered Resume & Portfolio Analyzer",
  description:
    "Analyze your resume and GitHub portfolio with AI. Get instant feedback, match scores, and actionable recommendations for your target role.",
  keywords: [
    "resume analyzer",
    "AI resume",
    "portfolio analyzer",
    "job matching",
    "career AI",
  ],
  openGraph: {
    title: "ResumeAI — AI Resume Analyzer",
    description: "Get AI-powered insights on your resume and GitHub profile.",
    type: "website",
  },
};

import AuthProvider from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={{ background: "#050508" }}
      >
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
