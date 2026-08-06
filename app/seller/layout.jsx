'use client'

import SellerNavbar from "@/components/seller/Navbar";
import SellerFooter from "@/components/seller/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Navbar */}
      <SellerNavbar />

      {/* Page Content */}
     <main className="relative z-0">
        {children}
      </main>

      {/* Footer */}
      <SellerFooter />

    </div>
  );
}