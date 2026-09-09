import { TicketPercent } from "lucide-react";

export default function OfferSection() {
  return (
    <section className="py-10 sm:py-14 lg:py-16">
      <div
        className="
          group
          relative
          overflow-hidden
          bg-[#ff6f2c]
          text-white
          transition-all
          duration-500
          hover:-translate-y-1
          hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]
        "
      >
        {/* Moving shine */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-[45%]
            w-[35%]
            -skew-x-12
            bg-linear-to-r
            from-transparent
            via-white/20
            to-transparent
            transition-all
            duration-1000
            group-hover:left-[120%]
          "
        />

        {/* Top coupon cut */}
        <div
          className="
            absolute
            left-[66%]
            top-0
            hidden
            size-8
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#f4f4f1]
            md:block
          "
        />

        {/* Bottom coupon cut */}
        <div
          className="
            absolute
            bottom-0
            left-[66%]
            hidden
            size-8
            -translate-x-1/2
            translate-y-1/2
            rounded-full
            bg-[#f4f4f1]
            md:block
          "
        />

        <div
          className="
            relative
            grid
            min-h-45px
            md:grid-cols-[2fr_1fr]
          "
        >
          {/* Left side */}

          <div
            className="
              flex
              items-center
              px-6
              py-10
              sm:px-10
              lg:px-16
            "
          >
            <div>
              <p
                className="
                  text-4xl
                  font-bold
                  uppercase
                  leading-none
                  tracking-lighter
                  transition-transform
                  duration-500
                  group-hover:scale-[1.03]
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                Flat ₹300 Off
              </p>

              <p
                className="
                  mt-4
                  text-xs
                  uppercase
                  tracking-[0.12em]
                  text-white/80
                  transition-all
                  duration-500
                  group-hover:tracking-[0.18em]
                "
              >
                Use code WELCOME300
              </p>
            </div>
          </div>

          {/* Right side */}

          <div
            className="
              relative
              flex
              items-center
              border-t
              border-dashed
              border-white/70
              px-6
              py-8
              sm:px-10
              md:border-l
              md:border-t-0
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  size-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/60
                  transition-all
                  duration-500
                  group-hover:rotate-12
                  group-hover:scale-110
                  group-hover:bg-white
                  group-hover:text-[#ff6f2c]
                "
              >
                <TicketPercent
                  size={22}
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <p className="text-lg font-medium sm:text-xl">
                  On Your{" "}
                  <span className="font-bold">
                    1st Purchase
                  </span>
                </p>

                <p className="mt-1 text-xs leading-5 text-white/80">
                  Sign up and enjoy ₹300 off
                  your first ShoppingHighway
                  order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}