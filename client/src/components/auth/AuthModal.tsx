import {
  useState,
} from "react";

import {
  X,
} from "lucide-react";

import {
  useAuthStore,
} from "../../stores/auth.store";

export default function AuthModal() {
  const isOpen =
    useAuthStore(
      (state) =>
        state.isAuthModalOpen,
    );

  const mode =
    useAuthStore(
      (state) =>
        state.authMode,
    );

  const isLoading =
    useAuthStore(
      (state) =>
        state.isLoading,
    );

  const error =
    useAuthStore(
      (state) =>
        state.error,
    );

  const login =
    useAuthStore(
      (state) =>
        state.login,
    );

  const signup =
    useAuthStore(
      (state) =>
        state.signup,
    );

  const closeAuthModal =
    useAuthStore(
      (state) =>
        state.closeAuthModal,
    );

  const setAuthMode =
    useAuthStore(
      (state) =>
        state.setAuthMode,
    );

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit =
    async (
      event:
        React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (mode === "login") {
        await login({
          email,
          password,
        });

        return;
      }

      await signup({
        name,
        email,
        password,
      });
    };

  return (
    <div
      className="
        fixed
        inset-0
        z-100
        flex
        items-center
        justify-center
        bg-black/40
        px-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          relative
          w-full
          max-w-md
          border
          border-black/10
          bg-[#f4f4f1]
          p-6
          shadow-xl
          sm:p-8
        "
      >
        <button
          type="button"
          onClick={() => {
          localStorage.setItem(
            "shoppinghighway-auth-prompt-dismissed",
            "true",
          );
        
          closeAuthModal();
        }}
          aria-label="Close"
          className="
            absolute
            right-4
            top-4
            text-neutral-500
            transition
            hover:text-black
          "
        >
          <X
            size={20}
            strokeWidth={1.5}
          />
        </button>

        <h2 className="text-xl font-semibold uppercase">
          Welcome to
          ShoppingHighway
        </h2>
        
        <p className="mt-2 text-xs text-neutral-500">
          {mode === "login"
            ? "Sign in to keep your shopping experience connected."
            : "Sign up to keep your shopping experience connected."}
        </p>
        

        <div className="mt-7 grid grid-cols-2 border-b border-black/10">
          <button
            type="button"
            onClick={() =>
              setAuthMode(
                "login",
              )
            }
            className={`
              pb-3
              text-xs
              font-medium
              uppercase

              ${
                mode === "login"
                  ? "border-b border-black text-black"
                  : "text-neutral-400"
              }
            `}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() =>
              setAuthMode(
                "signup",
              )
            }
            className={`
              pb-3
              text-xs
              font-medium
              uppercase

              ${
                mode === "signup"
                  ? "border-b border-black text-black"
                  : "text-neutral-400"
              }
            `}
          >
            Sign Up
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-6 space-y-4"
        >
          {mode === "signup" && (
            <div>
              <label className="text-[10px] uppercase tracking-wider text-neutral-500">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target
                      .value,
                  )
                }
                required
                className="
                  mt-2
                  w-full
                  border
                  border-black/20
                  bg-transparent
                  px-4
                  py-3
                  text-sm
                  outline-none
                  focus:border-black
                "
              />
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase tracking-wider text-neutral-500">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              required
              className="
                mt-2
                w-full
                border
                border-black/20
                bg-transparent
                px-4
                py-3
                text-sm
                outline-none
                focus:border-black
              "
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-neutral-500">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              required
              minLength={8}
              className="
                mt-2
                w-full
                border
                border-black/20
                bg-transparent
                px-4
                py-3
                text-sm
                outline-none
                focus:border-black
              "
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={
              isLoading
            }
            className="
              min-h-12
              w-full
              bg-black
              px-5
              text-xs
              font-medium
              uppercase
              tracking-[0.08em]
              text-white
              transition
              hover:opacity-80
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isLoading
              ? "Please wait..."
              : mode ===
                  "login"
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-[10px] text-neutral-500">
          You can close this
          window and continue
          browsing as a guest.
        </p>
      </div>
    </div>
  );
}