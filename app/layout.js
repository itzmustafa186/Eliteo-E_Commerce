

import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";

// const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  metadataBase: new URL("https://eliteo.pk"),

  title: {
    default: "Eliteo - Mobile & Tech Accessories in Pakistan",
    template: "%s | Eliteo",
  },

  description:
    "Shop premium mobile and tech accessories in Pakistan at Eliteo. Explore earbuds, headphones, chargers, power banks, smartwatches, hands-free and more.",

  keywords: [
    "Eliteo",
    "Eliteo Pakistan",
    "mobile accessories Pakistan",
    "tech accessories Pakistan",
    "earbuds Pakistan",
    "wireless earbuds Pakistan",
    "headphones Pakistan",
    "handsfree Pakistan",
    "chargers Pakistan",
    "power banks Pakistan",
    "smart watches Pakistan",
    "mobile accessories online Pakistan",
    "buy accessories online Pakistan",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    title: "Eliteo - Mobile & Tech Accessories in Pakistan",
    description:
      "Shop earbuds, headphones, chargers, power banks, smartwatches and other quality tech accessories at Eliteo Pakistan.",
    url: "https://www.eliteo.pk",
    siteName: "Eliteo",
    type: "website",
  },

  alternates: {
    canonical: "https://www.eliteo.pk",
  },
};
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
export default function RootLayout({ children }) {
  return (
     <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.className} antialiased text-gray-700`} >
          <Toaster />
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </body>
      </html>
      </ClerkProvider>
  );
}
