import { Link } from "react-router-dom";

import PageContainer from "./PageContainer";

const shopLinks = [
  {
    label: "All Products",
    path: "/products",
  },
  {
    label: "Women",
    path: "/products",
  },
  {
    label: "Men",
    path: "/products",
  },
  {
    label: "Accessories",
    path: "/products",
  },
];

const customerLinks = [
  {
    label: "Shopping Bag",
    path: "/cart",
  },
  {
    label: "Checkout",
    path: "/checkout",
  },
  {
    label: "Orders",
    path: "#",
  },
  {
    label: "Account",
    path: "#",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#eeeeea]">
      <PageContainer>
        <div
          className="
            grid
            gap-12
            py-14
            sm:grid-cols-2
            lg:grid-cols-[1.4fr_0.7fr_0.7fr]
            lg:py-20
          "
        >
          {/* Brand */}

          <div>
            <Link
              to="/"
              className="
                text-2xl
                font-bold
                uppercase
                tracking-[-0.04em]
              "
            >
              Shopping
              <br />
              Highway
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-500">
              A modern boutique ecommerce
              experience for fashion,
              accessories, and curated
              collections.
            </p>
          </div>

          {/* Shop */}

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest">
              Shop
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              {shopLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-xs text-neutral-600 transition hover:text-black"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Customer */}

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest">
              Customer
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              {customerLinks.map(
                (link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="text-xs text-neutral-600 transition hover:text-black"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
          </div>
        </div>

        <div
          className="
            flex
            flex-col
            gap-3
            border-t
            border-black/10
            py-5
            text-[10px]
            uppercase
            tracking-[0.08em]
            text-neutral-500
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            © 2026 ShoppingHighway
          </p>

          <div className="flex gap-5">
            <button type="button">
              Privacy
            </button>

            <button type="button">
              Terms
            </button>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}