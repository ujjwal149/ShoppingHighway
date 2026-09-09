import { Link } from "react-router-dom";

import type {
  Product,
} from "../../types/product";

import {
  formatCurrency,
} from "../../utils/formatCurrency";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article className="group">

      <Link
        to={`/products/${product.id}`}
        className="block"
      >
      <div className="overflow-hidden bg-neutral-200">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="
            aspect-4/5
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-[1.02]
          "
        />
      </div>

      <div className="pt-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-medium uppercase tracking-[0.02em]">
              {product.name}
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              {product.sku}
            </p>
          </div>

          <p className="shrink-0 text-sm font-medium">
            {formatCurrency(product.price)}
          </p>
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs text-neutral-600">
          <span aria-hidden="true">
            ★
          </span>

          <span>
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>

      </Link>
    </article>
  );
}