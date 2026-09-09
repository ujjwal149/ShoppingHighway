import {
  useState,
} from "react";

import {
  NavLink,
} from "react-router-dom";

import {
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";

import PageContainer from "./PageContainer";
import UserDropdown from "./UserDropdown";

import {
  useAuthStore,
} from "../../stores/auth.store";

import {
  useCartStore,
} from "../../stores/cart.store";

const navigationLinks = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Collections",
    path: "/products",
  },
  {
    label: "New",
    path: "/products?sort=newest",
  },
];

export default function Header() {
  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);

  const customer =
    useAuthStore(
      (state) =>
        state.customer,
    );

  const authenticatedItems =
    useCartStore(
      (state) =>
        state.items,
    );

  const guestItems =
    useCartStore(
      (state) =>
        state.guestItems,
    );

  /*
   * Logged in:
   * show DB cart.
   *
   * Guest:
   * show localStorage cart.
   */
  const cartItems =
    customer
      ? authenticatedItems
      : guestItems;

  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total +
        item.quantity,
      0,
    );

  return (
    <header className="sticky top-0 z-50 bg-[#f4f4f1]/95 backdrop-blur">
      <PageContainer>
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Left */}

          <div className="flex items-center gap-7">
            <button
              type="button"
              onClick={() =>
                setIsMenuOpen(
                  (previous) =>
                    !previous,
                )
              }
              className="flex items-center justify-center md:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X
                  size={22}
                  strokeWidth={1.4}
                />
              ) : (
                <Menu
                  size={22}
                  strokeWidth={1.4}
                />
              )}
            </button>

            <nav className="hidden items-center gap-7 md:flex">
              {navigationLinks.map(
                (link) => (
                  <NavLink
                    key={
                      link.label
                    }
                    to={
                      link.path
                    }
                    className="
                      text-[14px]
                      font-medium
                      tracking-[0.08em]
                      transition-opacity
                      hover:opacity-50
                    "
                  >
                    {
                      link.label
                    }
                  </NavLink>
                ),
              )}
            </nav>
          </div>

          {/* Center logo */}

          <NavLink
            to="/"
            aria-label="ShoppingHighway home"
            className="
              absolute
              left-1/2
              -translate-x-1/2
            "
          />

          {/* Right */}

          <div className="flex items-center gap-3">
            <NavLink
              to="/cart"
              className="
                relative
                flex
                h-10
                items-center
                gap-2
                rounded-full
                bg-[#171717]
                px-4
                text-[14px]
                text-white
                transition
                hover:opacity-80
              "
            >
              <span className="hidden sm:inline">
                Cart
              </span>

              <ShoppingBag
                size={16}
                strokeWidth={1.5}
              />

              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  size-4
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-[10px]
                  font-semibold
                  text-black
                  ring-1
                  ring-black
                "
              >
                {cartCount}
              </span>
            </NavLink>

            <UserDropdown />
          </div>
        </div>

        {/* Mobile menu */}

        {isMenuOpen && (
          <div
            className="
              absolute
              left-0
              top-full
              w-full
              border-t
              border-black/10
              bg-[#f4f4f1]
              shadow-sm
            "
          >
            <PageContainer>
              <nav className="flex flex-col gap-5 py-6 md:hidden">
                {navigationLinks.map(
                  (link) => (
                    <NavLink
                      key={
                        link.label
                      }
                      to={
                        link.path
                      }
                      onClick={() =>
                        setIsMenuOpen(
                          false,
                        )
                      }
                      className="
                        text-sm
                        font-medium
                        uppercase
                        tracking-[0.08em]
                      "
                    >
                      {
                        link.label
                      }
                    </NavLink>
                  ),
                )}
              </nav>
            </PageContainer>
          </div>
        )}
      </PageContainer>
    </header>
  );
}