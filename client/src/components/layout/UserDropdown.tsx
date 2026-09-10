import {
  LogIn,
  LogOut,
  Package,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useAuthStore,
} from "../../stores/auth.store";

import {
  useNavigate,
} from "react-router-dom";

export default function UserDropdown() {

  const navigate =
  useNavigate();

  const [isOpen, setIsOpen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const customer =
    useAuthStore(
      (state) =>
        state.customer,
    );

  const openAuthModal =
    useAuthStore(
      (state) =>
        state.openAuthModal,
    );

    const handleOrders = () => {
      setIsOpen(false);
    
      navigate(
        "/orders",
      );
    };

  const logout =
    useAuthStore(
      (state) =>
        state.logout,
    );

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const handleSignIn = () => {
    setIsOpen(false);

  
    openAuthModal("login");
  };

  const handleLogout =
    async () => {
      try {
        await logout();

        setIsOpen(false);
      } catch (error) {
        console.error(
          "Logout failed:",
          error,
        );
      }
    };

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (previous) =>
              !previous,
          )
        }
        className="
          flex
          size-10
          items-center
          justify-center
          rounded-full
          bg-[#171717]
          text-white
          transition
          hover:opacity-80
        "
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <UserRound
          size={17}
          strokeWidth={1.5}
        />
      </button>

      {isOpen && (
        <div
          className="
            absolute
            right-0
            top-[calc(100%+12px)]
            z-50
            w-56
            border
            border-black/10
            bg-[#f4f4f1]
            p-2
            shadow-lg
          "
        >
          {/* User information */}
          <div className="border-b border-black/10 px-3 py-3">
            {customer ? (
              <>
                <p className="truncate text-xs font-medium uppercase tracking-[0.08em]">
                  {customer.name}
                </p>

                <p className="mt-1 truncate text-[11px] text-neutral-500">
                  {
                    customer.email
                  }
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-medium uppercase tracking-[0.08em]">
                  Guest
                </p>

                <p className="mt-1 text-[11px] text-neutral-500">
                  Sign in to view
                  your account
                </p>
              </>
            )}
          </div>

          <div className="py-2">
            {customer ? (
              <>
                <button
                  type="button"
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    text-left
                    text-xs
                    uppercase
                    tracking-[0.06em]
                    transition
                    hover:bg-black/5
                  "
                >
                  <UserRound
                    size={15}
                    strokeWidth={1.5}
                  />

                  Profile
                </button>

                <button
                  type="button"
                  onClick={
                    handleOrders
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    text-left
                    text-xs
                    uppercase
                    tracking-[0.06em]
                    transition
                    hover:bg-black/5
                  "
                >
                  <Package
                    size={15}
                    strokeWidth={1.5}
                  />
                
                  Orders
                </button>
                  

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    text-left
                    text-xs
                    uppercase
                    tracking-[0.06em]
                    transition
                    hover:bg-black/5
                  "
                >
                  <LogOut
                    size={15}
                    strokeWidth={1.5}
                  />

                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={
                  handleSignIn
                }
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  text-left
                  text-xs
                  uppercase
                  tracking-[0.06em]
                  transition
                  hover:bg-black/5
                "
              >
                <LogIn
                  size={15}
                  strokeWidth={1.5}
                />

                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}