import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";

export const metadata = {
  metadataBase: new URL("https://www.eliteo.pk"),

  title: {
    default: "Eliteo | Mobile & Tech Accessories in Pakistan",
    template: "%s | Eliteo",
  },

  description:
    "Shop mobile and tech accessories online in Pakistan at Eliteo. Discover earbuds, headphones, chargers, power banks, smartwatches, handsfree and more.",

  applicationName: "Eliteo",

  authors: [
    {
      name: "Eliteo",
      url: "https://www.eliteo.pk",
    },
  ],

  creator: "Eliteo",
  publisher: "Eliteo",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://www.eliteo.pk",
  },

  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://www.eliteo.pk",
    siteName: "Eliteo",
    title: "Eliteo | Mobile & Tech Accessories in Pakistan",
    description:
      "Shop earbuds, headphones, chargers, power banks, smartwatches and other mobile and tech accessories online in Pakistan.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Eliteo - Mobile & Tech Accessories in Pakistan",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Eliteo | Mobile & Tech Accessories in Pakistan",
    description:
      "Shop mobile and tech accessories online in Pakistan at Eliteo.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en-PK">
        <body
          className={`${poppins.className} antialiased text-gray-700`}
        >
          <Toaster />

          <AppContextProvider>
            {children}
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}