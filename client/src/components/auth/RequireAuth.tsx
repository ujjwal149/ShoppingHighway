import {
  useEffect,
  type ReactNode,
} from "react";

import {
  useAuthStore,
} from "../../stores/auth.store";

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({
  children,
}: RequireAuthProps) {
  const customer =
    useAuthStore(
      (state) => state.customer,
    );

  const isInitialized =
    useAuthStore(
      (state) =>
        state.isInitialized,
    );

  const openAuthModal =
    useAuthStore(
      (state) =>
        state.openAuthModal,
    );

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!customer) {
      
      openAuthModal("login");
    }
  }, [
    customer,
    isInitialized,
    openAuthModal,
  ]);

  
  if (!isInitialized) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Checking your session...
        </p>
      </main>
    );
  }

  
  if (!customer) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold uppercase">
            Sign in required
          </h1>

          <p className="mt-3 text-sm text-neutral-500">
            Please sign in or create
            an account to continue
            to checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              openAuthModal(
                "login",
              )
            }
            className="
              mt-6
              min-h-12
              bg-black
              px-8
              text-xs
              font-medium
              uppercase
              tracking-[0.08em]
              text-white
              transition
              hover:opacity-80
            "
          >
            Sign In / Sign Up
          </button>
        </div>
      </main>
    );
  }

  return children;
}