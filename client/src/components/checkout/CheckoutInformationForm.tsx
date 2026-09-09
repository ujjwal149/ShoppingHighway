import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  checkoutInformationSchema,
} from "../../schemas/checkout.schema";

import type {
  CheckoutInformationInput,
} from "../../schemas/checkout.schema";

interface CheckoutInformationFormProps {
  onSubmit: (
    data: CheckoutInformationInput,
  ) => void;
}

export default function CheckoutInformationForm({
  onSubmit,
}: CheckoutInformationFormProps) {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CheckoutInformationInput>({
    resolver: zodResolver(
      checkoutInformationSchema,
    ),
  });

  const inputClassName = `
    min-h-11
    border
    border-black/10
    bg-transparent
    px-3
    text-xs
    outline-none
    transition
    focus:border-black
  `;

  const errorClassName =
    "mt-1 text-[10px] text-red-600";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <section>
        <h2 className="text-xs font-semibold uppercase">
          Contact Info
        </h2>

        <div className="mt-4 space-y-3">
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className={inputClassName}
            />

            {errors.email && (
              <p className={errorClassName}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("phone")}
              type="tel"
              placeholder="Phone"
              className={inputClassName}
            />

            {errors.phone && (
              <p className={errorClassName}>
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase">
          Shipping Address
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <input
              {...register("firstName")}
              placeholder="First Name"
              className={inputClassName}
            />

            {errors.firstName && (
              <p className={errorClassName}>
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("lastName")}
              placeholder="Last Name"
              className={inputClassName}
            />

            {errors.lastName && (
              <p className={errorClassName}>
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <select
              {...register("country")}
              className={inputClassName}
              defaultValue=""
            >
              <option value="" disabled>
                Country
              </option>

              <option value="India">
                India
              </option>
            </select>

            {errors.country && (
              <p className={errorClassName}>
                {errors.country.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <input
              {...register("state")}
              placeholder="State / Region"
              className={inputClassName}
            />

            {errors.state && (
              <p className={errorClassName}>
                {errors.state.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <input
              {...register("address")}
              placeholder="Address"
              className={inputClassName}
            />

            {errors.address && (
              <p className={errorClassName}>
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("city")}
              placeholder="City"
              className={inputClassName}
            />

            {errors.city && (
              <p className={errorClassName}>
                {errors.city.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register(
                "postalCode",
              )}
              placeholder="Postal Code"
              className={inputClassName}
            />

            {errors.postalCode && (
              <p className={errorClassName}>
                {
                  errors.postalCode
                    .message
                }
              </p>
            )}
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          mt-4
          flex
          min-h-11
          w-full
          items-center
          justify-between
          bg-black
          px-5
          text-xs
          uppercase
          tracking-[0.08em]
          text-white
          transition
          hover:opacity-80
          disabled:opacity-50
          sm:ml-auto
          sm:max-w-48
        "
      >
        <span>Shipping</span>
        <span>→</span>
      </button>
    </form>
  );
}