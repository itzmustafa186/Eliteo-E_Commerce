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
  Store,
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
    name: "Carousel",
    href: "/seller/carousel",
    icon: Box,
  },
];

export default function SellerNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
        <>
      {/* ================= TOP HEADER ================= */}
      <header className="
                fixed
                top-0
                left-0
                right-0
                z-50
                h-16
                border-b
                border-gray-200
                bg-white/90
                backdrop-blur-xl
            ">

        <div className="
                    flex
                    h-full
                    items-center
                    justify-between
                    px-4
                    lg:px-6
                ">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* Mobile Menu */}
            <button
              onClick={() => setOpen(true)}
              className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-gray-200
                                hover:bg-gray-50
                                lg:hidden
                            "
            >
              <Menu size={21} />
            </button>

            {/* Logo */}
            <Link
              href="/seller"
              className="flex items-center gap-3"
            >
              <div className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-gradient-to-br
                                from-orange-500
                                to-orange-600
                                text-lg
                                font-black
                                text-white
                                shadow-md
                            ">
                E
              </div>

              <div>
                <h1 className="
                                    text-base
                                    font-bold
                                    text-gray-900
                                ">
                  Eliteo
                </h1>

                <p className="
                                    hidden
                                    text-[11px]
                                    text-gray-500
                                    sm:block
                                ">
                  Seller Center
                </p>
              </div>
            </Link>

          </div>


          {/* CENTER SEARCH */}
          <div className="
                        hidden
                        max-w-md
                        flex-1
                        px-8
                        md:block
                    ">
            <input
              type="text"
              placeholder="Search products, orders..."
              className="
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                bg-gray-50
                                px-4
                                py-2.5
                                text-sm
                                outline-none
                                transition
                                focus:border-orange-400
                                focus:bg-white
                                focus:ring-2
                                focus:ring-orange-100
                            "
            />
          </div>


          {/* RIGHT */}
          <div className="flex items-center gap-2">

            {/* Visit Store */}
            <Link
              href="/"
              className="
                                hidden
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-gray-200
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-gray-600
                                transition
                                hover:border-orange-300
                                hover:bg-orange-50
                                hover:text-orange-600
                                sm:flex
                            "
            >
              <Store size={17} />
              Store
            </Link>

            {/* Notification */}
            <button className="
                            relative
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-gray-200
                            hover:bg-gray-50
                        ">
              <span className="
                                absolute
                                right-2
                                top-2
                                h-2
                                w-2
                                rounded-full
                                bg-red-500
                                "
                            />

                            🔔
                        </button>

                    </div>

                </div>
            </header>


             {/* ================= DESKTOP SIDEBAR =================  */}

            <aside className="
                fixed
                left-0
                top-16
                z-40
                hidden
                h-[calc(100vh-4rem)]
              w-64
              border-r
              border-gray-200
              bg-white
              lg:block
            ">

              <div className="flex h-full flex-col">

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">

                  {menuItems.map((item) => {
                    const Icon = item.icon;

                    const active =
                      pathname === item.href ||
                      (
                        item.href !== "/seller" &&
                        pathname.startsWith(item.href)
                      );

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`
                                        group
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        transition-all

                                        ${active
                            ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                            : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                          }
                                    `}
                      >
                        <Icon
                          size={19}
                          className={`
                                            ${active
                              ? "text-white"
                              : "text-gray-400 group-hover:text-orange-500"
                            }
                                        `}
                        />

                        {item.name}
                      </Link>
                    );
                  })}

                </nav>


                {/* Bottom */}
                <div className="
                        border-t
                        border-gray-100
                        p-4
                    ">

                  <Link
                    href="/"
                    className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-gray-600
                                hover:bg-gray-50
                            "
                  >
                    <Store size={19} />
                    Back to Store
                  </Link>

                </div>

              </div>

            </aside>


            {/* ================= MOBILE DRAWER ================= */}
            <div
              className={`
                    fixed
                    inset-0
                    z-[60]
                    lg:hidden
                    ${open
                  ? "visible"
                  : "invisible"
                }
                `}
            >

              {/* Overlay */}
              <div
                onClick={() => setOpen(false)}
                className={`
                        absolute
                        inset-0
                        bg-black/40
                        backdrop-blur-sm
                        transition-opacity
                        ${open
                    ? "opacity-100"
                    : "opacity-0"
                  }
                    `}
              />


              {/* Drawer */}
              <aside
                className={`
                        absolute
                        left-0
                        top-0
                        h-full
                        w-72
                        bg-white
                        shadow-2xl
                        transition-transform
                        duration-300
                        ${open
                    ? "translate-x-0"
                    : "-translate-x-full"
                  }
                    `}
              >

                {/* Drawer Header */}
                <div className="
                        flex
                        h-16
                        items-center
                        justify-between
                        border-b
                        px-5
                    ">

                  <div className="flex items-center gap-3">

                    <div className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                bg-orange-500
                                font-bold
                                text-white
                            ">
                      E
                    </div>

                    <div>
                      <p className="font-bold">
                        Eliteo
                      </p>

                      <p className="text-[11px] text-gray-500">
                        Seller Center
                      </p>
                    </div>

                  </div>


                  <button
                    onClick={() => setOpen(false)}
                    className="
                                rounded-lg
                                p-2
                                hover:bg-gray-100
                            "
                  >
                    <X size={21} />
                  </button>

                </div>


                {/* Mobile Navigation */}
                <nav className="space-y-1 p-4">

                  {menuItems.map((item) => {
                    const Icon = item.icon;

                    const active =
                      pathname === item.href ||
                      (
                        item.href !== "/seller" &&
                        pathname.startsWith(item.href)
                      );

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        ${active
                            ? "bg-orange-500 text-white"
                            : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          }
                                    `}
                      >
                        <Icon size={19} />
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