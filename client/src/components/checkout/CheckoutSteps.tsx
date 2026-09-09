import type {
  CheckoutStep,
} from "../../types/checkout";

interface CheckoutStepsProps {
  activeStep: CheckoutStep;
}
const steps = [
  "information",
  "shipping",
  "payment",
] as const;

export default function CheckoutSteps({
  activeStep,
}: CheckoutStepsProps) {
  return (
    <div className="flex gap-7 border-b border-black/10">
      {steps.map((step) => {
        const isActive =
          step === activeStep;

        return (
          <div
            key={step}
            className={`
              pb-3
              text-[10px]
              uppercase
              tracking-[0.06em]

              ${
                isActive
                  ? "border-b border-black text-black"
                  : "text-neutral-400"
              }
            `}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
}