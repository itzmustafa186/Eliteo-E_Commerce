import Image from "next/image";
import { Package, CreditCard, CalendarDays, CheckCircle2 } from "lucide-react";

export default function OrderResult({ order, onTrackAnother }) {
  return (
    <div className="space-y-4">
      {/* ORDER FOUND */}
      <div className="rounded-2xl border border-[#E8E1D6] bg-white p-5 shadow-[0_8px_30px_rgba(23,32,51,0.04)] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={17} className="text-[#3D8B67]" />

              <span className="text-xs font-semibold text-[#3D8B67]">
                Order Found
              </span>
            </div>

            <h2 className="mt-1.5 text-xl font-semibold text-[#172033]">
              Order Details
            </h2>

            <p className="mt-0.5 text-xs text-[#7A808B]">
              #{order.orderNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={onTrackAnother}
            className="shrink-0 rounded-lg border border-[#DDD7CC] px-3 py-2 text-xs font-medium text-[#303747] transition hover:border-[#C8A96B] hover:text-[#9B7A42]"
          >
            Track Another
          </button>
        </div>

        {/* STATUS */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {/* ORDER STATUS */}
          <div className="min-w-0 rounded-xl border border-[#EAE4D9] bg-[#FCFBF8] p-3 sm:p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4EFE6] text-[#9B7A42]">
              <Package size={17} />
            </div>

            <p className="mt-2 text-[9px] font-semibold uppercase leading-3 tracking-wide text-[#9A9DA4] sm:mt-3 sm:text-[10px] sm:tracking-wider">
              Order Status
            </p>

            <h3 className="mt-1 truncate text-[11px] font-semibold capitalize text-[#172033] sm:text-sm">
              {order.orderStatus}
            </h3>
          </div>

          {/* PAYMENT */}
          <div className="rounded-xl border border-[#EAE4D9] bg-[#FCFBF8] p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4EFE6] text-[#9B7A42]">
              <CreditCard size={17} />
            </div>

            <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-[#9A9DA4]">
              Payment
            </p>

            <h3 className="mt-1 text-sm font-semibold capitalize text-[#172033]">
              {order.paymentStatus}
            </h3>
          </div>

          {/* DATE */}
          <div className="rounded-xl border border-[#EAE4D9] bg-[#FCFBF8] p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4EFE6] text-[#9B7A42]">
              <CalendarDays size={17} />
            </div>

            <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-[#9A9DA4]">
              Order Date
            </p>

            <h3 className="mt-1 text-sm font-semibold text-[#172033]">
              {new Date(order.createdAt).toLocaleDateString("en-PK", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </h3>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="rounded-2xl border border-[#E8E1D6] bg-white shadow-[0_8px_30px_rgba(23,32,51,0.04)] sm:p-6">
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9B7A42]">
            Your Selection
          </p>

          <h3 className="mt-1 text-lg font-semibold text-[#172033]">
            Products
          </h3>
        </div>

        <div className="divide-y divide-[#EEEAE2]">
          {order.items.map((item) => {
            const product = item.product;

            if (!product) {
              return null;
            }

            const itemPrice =
              Number(product.offerPrice) || Number(product.price) || 0;

            return (
              <div
                key={item._id}
                className="flex gap-3 py-4 first:pt-0 last:pb-0"
              >
                {/* IMAGE */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F7F4EE]">
                  {product.images?.[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name || "Product"}
                      fill
                      sizes="64px"
                      className="object-contain p-1.5"
                    />
                  )}
                </div>

                {/* INFO */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-[#172033]">
                    {product.name}
                  </h4>

                  <p className="mt-0.5 text-xs text-[#858A94]">
                    Quantity: {item.quantity}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#9B7A42]">
                    Rs {itemPrice.toLocaleString()}
                  </p>
                </div>

                {/* TOTAL */}
                <div className="hidden text-right sm:block">
                  <p className="text-[10px] text-[#A0A3A9]">Item Total</p>

                  <p className="mt-1 text-sm font-semibold text-[#172033]">
                    Rs {(itemPrice * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* TOTAL */}
        <div className="mt-4 border-t border-[#EEEAE2] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A808B]">
              Total Amount
            </span>

            <span className="text-xl font-semibold tracking-tight text-[#172033]">
              Rs {Number(order.totalAmount || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
