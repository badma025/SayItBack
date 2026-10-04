import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Say It Back — Voice Discharge Teach-Back (ForgeHacks 2026)",
  description:
    "At hospital discharge, a carer or patient explains the discharge letter back by voice. Anything missed turns red beside the exact line in the letter. The AI listens; deterministic code decides.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen bg-[#F0F4F5] text-[#212B32] antialiased selection:bg-[#005EB8] selection:text-white">
        {children}
      </body>
    </html>
  );
}
