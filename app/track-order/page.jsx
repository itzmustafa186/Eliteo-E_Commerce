import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import TrackOrderForm from "@/components/TrackOrderForm";
import {
  Truck,
  ShieldCheck,
  Package,
} from "lucide-react";

export const metadata = {
  title: "Track Your Order",
};

export default function TrackOrderPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FCFBF8]">

        {/* HERO */}
        <section className="border-b border-[#EAE4D9] bg-[#F4EFE6]">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:py-12">
            <div className="max-w-2xl">

              <div className="flex items-center gap-2">
                <span className="h-px w-7 bg-[#C8A96B]" />

                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9B7A42]">
                  Eliteo Delivery
                </p>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl">
                Track your
                <span className="block font-normal text-[#9B7A42]">
                  Eliteo order.
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#687080]">
                Enter your order number or phone number to check your latest
                delivery status.
              </p>

            </div>
          </div>
        </section>

        {/* MAIN */}
        <section className="mx-auto max-w-6xl px-5 py-8 sm:py-10">

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">

            {/* TRACKING FORM */}
            <TrackOrderForm />

            {/* ELITEO PROMISE */}
            <div className="rounded-2xl bg-[#172033] p-5 sm:p-6">

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C8A96B]">
                Eliteo Promise
              </p>

              <h2 className="mt-2 text-xl font-semibold leading-tight text-white">
                Your order is in
                <span className="block font-normal text-white/55">
                  good hands.
                </span>
              </h2>

              <p className="mt-2 text-xs leading-5 text-white/55">
                We keep your order safe and carefully handled throughout
                delivery.
              </p>

              <div className="mt-5 grid gap-3">

                {/* DELIVERY */}
                <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#C8A96B]">
                    <Truck size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Reliable Delivery
                    </h3>

                    <p className="mt-1 text-[11px] leading-4 text-white/45">
                      Carefully handled from dispatch to your doorstep.
                    </p>
                  </div>
                </div>

                {/* SECURITY */}
                <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#C8A96B]">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Secure Shopping
                    </h3>

                    <p className="mt-1 text-[11px] leading-4 text-white/45">
                      Your order information stays protected throughout.
                    </p>
                  </div>
                </div>

                {/* PACKAGING */}
                <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#C8A96B]">
                    <Package size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Carefully Packed
                    </h3>

                    <p className="mt-1 text-[11px] leading-4 text-white/45">
                      Every order is prepared and packed with care.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}