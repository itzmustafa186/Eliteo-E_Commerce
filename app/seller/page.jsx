"use client";

import Link from "next/link";
import { Bell, Menu, UserCircle2 } from "lucide-react";
import { useState } from "react";

export default function SellerNavbar() {

  const [open,setOpen]=useState(false);

  return (
    <header className="
      sticky top-0 z-50
      bg-white/80
      backdrop-blur-xl
      border-b
      border-gray-200
    ">

      <div className="
        h-20
        px-5 lg:px-8
        flex
        items-center
        justify-between
      ">


        {/* Logo */}
        <Link href="/seller" className="flex items-center gap-3">

          <div className="
            h-11
            w-11
            rounded-xl
            bg-gradient-to-br
            from-orange-500
            to-red-600
            flex
            items-center
            justify-center
            text-white
            text-xl
            font-black
            shadow-lg
          ">
            E
          </div>


          <div>
            <h1 className="font-bold text-xl">
              Eliteo
            </h1>

            <p className="text-xs text-gray-500">
              Seller Center
            </p>
          </div>

        </Link>



        {/* Search */}
        <div className="
          hidden
          md:flex
          w-[350px]
          lg:w-[450px]
        ">

          <input
            placeholder="Search products, orders..."
            className="
              w-full
              rounded-xl
              border
              bg-gray-50
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-orange-500
            "
          />

        </div>



        {/* Right */}
        <div className="
          flex
          items-center
          gap-3
        ">


          <button className="
            relative
            h-11
            w-11
            rounded-xl
            border
            bg-white
            hover:bg-orange-50
          ">

            <Bell size={20} className="mx-auto"/>

            <span className="
              absolute
              top-2
              right-2
              h-2
              w-2
              rounded-full
              bg-red-500
            "/>

          </button>



          <div className="
            hidden
            sm:flex
            items-center
            gap-3
            rounded-xl
            border
            px-3
            py-2
            bg-white
          ">


            <div className="
              h-10
              w-10
              rounded-full
              bg-orange-100
              flex
              items-center
              justify-center
            ">

              <UserCircle2
                size={25}
                className="text-orange-600"
              />

            </div>


            <div>

              <p className="text-sm font-bold">
                Seller
              </p>

              <p className="text-xs text-gray-500">
                Eliteo Store
              </p>

            </div>

          </div>



          <button
            onClick={()=>setOpen(!open)}
            className="
              lg:hidden
              h-11
              w-11
              rounded-xl
              border
            "
          >
            <Menu className="mx-auto"/>
          </button>


        </div>


      </div>

    </header>
  );
}