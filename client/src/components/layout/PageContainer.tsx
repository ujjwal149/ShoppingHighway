import type { PropsWithChildren } from "react";

type PageContainerProps = PropsWithChildren<{
  className?: string;
}>;

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-10 ${className}`}
    >
      {children}
    </div>
  );
}