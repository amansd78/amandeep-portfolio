import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Amandeep Singh",
    template: "%s — Amandeep Singh",
  },
  description:
    "Research-focused portfolio: statistical science, Bayesian methods, scalable modeling systems, and applied machine learning.",
  metadataBase: new URL("https://example.com"), // replace with your domain once deployed
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        suppressHydrationWarning
        className={[
          geistSans.variable,
          geistMono.variable,
          newsreader.variable,
          "min-h-screen antialiased",
          // Elite “Ink + Ivory” base
          "bg-[#FAFAF7] text-[#0B1220]",
          // Better text rendering
          "text-[15px] leading-[1.6]",
          // Selection styling (subtle, premium)
          "selection:bg-[#1F3A8A]/15 selection:text-[#0B1220]",
        ].join(" ")}
      >
        {/* Subtle editorial wash (quiet premium feel) */}
        <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_18%_0%,rgba(31,58,138,0.10),transparent_50%),radial-gradient(900px_circle_at_82%_12%,rgba(11,18,32,0.06),transparent_45%)]">
          {children}
        </div>
      </body>
    </html>
  );
}
