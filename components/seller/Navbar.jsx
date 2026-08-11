"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusSquare,
  ShoppingCart,
  Star,
  Menu,
  X,
  Box,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/seller",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/seller/product-list",
    icon: Package,
  },
  {
    name: "Add Product",
    href: "/seller/add-product",
    icon: PlusSquare,
  },
  {
    name: "Orders",
    href: "/seller/orders",
    icon: ShoppingCart,
  },
  {
    name: "Reviews",
    href: "/seller/reviews",
    icon: Star,
  },
  {
    name: "Reviews",
    href: "/seller/carousel",
    icon: Box,
  },
];

export default function SellerNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 items-center justify-between px-4 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-2xl font-bold text-orange-600">
              Eliteo Seller
            </h1>

          </div>

          {/* Desktop Menu */}
          <nav className="hidden items-center gap-2 lg:flex">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition
                    ${pathname === item.href
                      ? "bg-orange-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}

          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 transition ${open ? "visible" : "invisible"
          }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition ${open ? "opacity-100" : "opacity-0"
            }`}
        />

        {/* Sidebar */}
        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between border-b p-5">
            <h2 className="text-xl font-bold text-orange-600">
              Eliteo Seller
            </h2>

            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="space-y-2 p-4">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition
                    ${pathname === item.href
                      ? "bg-orange-600 text-white"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}

          </nav>
        </aside>
      </div>
    </>
  );
}