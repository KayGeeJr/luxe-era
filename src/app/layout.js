import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Inter_Tight } from "next/font/google";
import brand from "../../brand.config";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

export const metadata = {
  title: brand.storeName,
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
      <body className={interTight.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main id="content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
