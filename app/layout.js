

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
    default: "Eliteo - Online Shopping in Pakistan",
    template: "%s | Eliteo",
  },

  description:
    "Shop quality electronics, earbuds, headphones, chargers, shoes, beauty products and more online at Eliteo Pakistan.",

  keywords: [
    "Eliteo",
    "online shopping Pakistan",
    "electronics Pakistan",
    "earbuds Pakistan",
    "headphones Pakistan",
    "chargers Pakistan",
    "Hand's Free Pakistan",
    "Powerbanks Pakistan",
    "SmartWatches Pakistan",
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
    title: "Eliteo - Online Shopping in Pakistan",
    description:
      "Shop electronics, accessories, and more at Eliteo Pakistan.",
    url: "https://eliteo.pk",
    siteName: "Eliteo",
    type: "website",
  },

  alternates: {
    canonical: "https://eliteo.pk",
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
