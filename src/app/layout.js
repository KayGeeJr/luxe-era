import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollProgress from "../components/ScrollProgress";
import PageTransition from "../components/PageTransition";
import { Cormorant_Garamond, Inter_Tight } from "next/font/google";
import brand from "../../brand.config";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-cormorant",
});

export const metadata = {
  title: { default: "Luxe Era | Home Collections", template: "%s | Luxe Era" },
  description: brand.tagline,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} ${cormorant.variable} font-sans antialiased`}>
        <ScrollProgress />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main id="content" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
