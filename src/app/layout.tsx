import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Alex_Brush } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Glama Hair & Beauty Studio | Luxury Salon & Spa",
  description:
    "Expert care for your hair & beauty. From stylish haircuts to radiant skin and flawless makeup, experience premium beauty services in a relaxing, luxurious environment.",
  keywords: [
    "Glama salon",
    "hair salon",
    "beauty studio",
    "bridal makeup",
    "balayage",
    "luxury facial",
    "nail art",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${alexBrush.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#FFF9F6] text-[#201817]">
        {children}
      </body>
    </html>
  );
}
