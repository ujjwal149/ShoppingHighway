import ProductCard from "./ProductCard";

import type {
  Product,
} from "../../types/product";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({
  products,
}: ProductGridProps) {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-x-3
        gap-y-8
        sm:gap-x-5
        lg:grid-cols-3
        lg:gap-x-6
        xl:grid-cols-4
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}