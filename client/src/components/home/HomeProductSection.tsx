import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import ProductCard from "../product/ProductCard";

import type { Product } from "../../types/product";

interface HomeProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export default function HomeProductSection({
  title,
  subtitle,
  products,
}: HomeProductSectionProps) {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <div className="mb-7 flex items-end justify-between gap-6">
        <div>
          {subtitle && (
            <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-500">
              {subtitle}
            </p>
          )}

          <h2
            className="
              mt-2
              text-3xl
              font-bold
              uppercase
              leading-[0.9]
              tracking-[-0.04em]
              sm:text-4xl
              lg:text-5xl
            "
          >
            {title}
          </h2>
        </div>

        <Link
          to="/products"
          className="
            hidden
            items-center
            gap-2
            text-[10px]
            uppercase
            tracking-[0.08em]
            transition
            hover:opacity-50
            sm:flex
          "
        >
          View All

          <ArrowRight
            size={14}
            strokeWidth={1.5}
          />
        </Link>
      </div>

      <div
        className="
          grid
          grid-cols-2
          gap-x-3
          gap-y-8
          sm:gap-x-5
          lg:grid-cols-4
          lg:gap-x-6
        "
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      <Link
        to="/products"
        className="
          mt-8
          flex
          items-center
          justify-between
          border
          border-black/20
          px-4
          py-3
          text-[10px]
          uppercase
          tracking-[0.08em]
          sm:hidden
        "
      >
        View All

        <ArrowRight
          size={14}
          strokeWidth={1.5}
        />
      </Link>
    </section>
  );
}