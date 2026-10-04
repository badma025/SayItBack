import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Atkinson Hyperlegible was designed by the Braille Institute for low-vision
// readers, which suits an audience that is often over 70.
const ui = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ui",
  display: "swap",
});

// The discharge letter is set in a serif so it reads as the patient's own document.
const letter = Newsreader({
  subsets: ["latin"],
  variable: "--font-letter",
  display: "swap",
  adjustFontFallback: false,
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Say It Back",
  description:
    "Before leaving hospital, a patient or carer explains the discharge letter back in their own words. Anything missed or wrong is marked beside the exact line in the letter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${ui.variable} ${letter.variable} ${mono.variable}`}>
      <body>
        <a
          href="#teach-back"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-paper focus:px-4 focus:py-2"
        >
          Skip to teach-back
        </a>
        {children}
      </body>
    </html>
  );
}
