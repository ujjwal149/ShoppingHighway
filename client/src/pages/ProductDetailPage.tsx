import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Heart,
  ShoppingBag,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import PageContainer from "../components/layout/PageContainer";
import SizeSelector from "../components/product/SizeSelector";
import QuantityControl from "../components/cart/QuantityControl";

import {
  getProductById,
} from "../api/product.api";

import {
  useCartStore,
} from "../stores/cart.store";

import {
  useAuthStore,
} from "../stores/auth.store";

import {
  formatCurrency,
} from "../utils/formatCurrency";

import type {
  ProductDetail,
} from "../types/product";



export default function ProductDetailsPage() {
  const { productId } = useParams();

  const navigate = useNavigate();

  

  const [product, setProduct] =
    useState<ProductDetail | null>(
      null,
    );

  const [
    selectedVariantId,
    setSelectedVariantId,
  ] = useState<number | null>(
    null,
  );

  const [quantity, setQuantity] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isAdding, setIsAdding] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
  useState<string | null>(null);

const [messageType, setMessageType] =
  useState<"success" | "error" | null>(
    null,
  );

  const customer =
    useAuthStore(
      (state) => state.customer,
    );

  const addItem =
    useCartStore(
      (state) => state.addItem,
    );

  const addGuestItem =
  useCartStore(
    (state) =>
      state.addGuestItem,
  );

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const id = Number(productId);

        if (
          !Number.isInteger(id) ||
          id <= 0
        ) {
          setError(
            "Invalid product ID.",
          );

          return;
        }

        const response =
          await getProductById(id);

        const loadedProduct =
          response.data;

        setProduct(
          loadedProduct,
        );

        
        const availableVariants =
          loadedProduct.variants.filter(
            (variant) =>
              (
                variant.inventory
                  ?.quantity ?? 0
              ) > 0,
          );

        
        if (
          availableVariants.length === 1
        ) {
          setSelectedVariantId(
            availableVariants[0]!.id,
          );
        } else {
          setSelectedVariantId(
            null,
          );
        }

        setQuantity(1);
      } catch (error) {
        console.error(
          "Failed to load product:",
          error,
        );

        setError(
          "Unable to load product details.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const selectedVariant =
    product?.variants.find(
      (variant) =>
        variant.id ===
        selectedVariantId,
    ) ?? null;

  
  const totalStock =
    product?.variants.reduce(
      (total, variant) =>
        total +
        (
          variant.inventory
            ?.quantity ?? 0
        ),
      0,
    ) ?? 0;

  
  const shouldShowLowStock =
    totalStock > 0 &&
    totalStock <= 5;

  const isOutOfStock =
    totalStock === 0;

  const handleAddToCart =
    async () => {
      if (!product) {
        return;
      }

      if (!selectedVariant) {
        setMessage(
          "Please select a size first.",
        );

        setMessageType("error");

        return;
      }

      const availableStock =
        selectedVariant.inventory
          ?.quantity ?? 0;

        if (quantity > availableStock) {
          setMessage(
            `Only ${availableStock} item(s) available.`,
          );
        
          setMessageType("error");
        
          return;
        }

      try {
        setIsAdding(true);
        setMessage(null);

        if (customer) {
          await addItem({
            variantId:
              selectedVariant.id,
            quantity,
          });
        } else {
          addGuestItem(
            product,
            selectedVariant,
            quantity,
          );
        }
        setMessage(
          "Product added to cart.",
        );

        setMessageType("success");

      } catch (error) {
        console.error(
          "Failed to add product:",
          error,
        );

        setMessage(
          "Unable to add product to cart.",
        );

        setMessageType("error");

      } finally {
        setIsAdding(false);
      }
    };

  const handleBuyNow = () => {
    if (!product) {
      return;
    }

    if (!selectedVariant) {
      setMessage(
        "Please select a size first.",
      );

      return;
    }

    navigate(
      `/checkout?productId=${product.id}&variantId=${selectedVariant.id}&quantity=${quantity}&size=${encodeURIComponent(
        selectedVariant.size,
      )}`,
    );
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="py-32 text-center text-xs uppercase tracking-widest text-neutral-500">
          Loading product...
        </div>
      </PageContainer>
    );
  }

  if (
    error ||
    !product
  ) {
    return (
      <PageContainer>
        <div className="py-32 text-center">
          <p className="text-sm">
            {error ??
              "Product not found."}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block text-xs uppercase underline"
          >
            Back to products
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <main className="py-6 sm:py-10 lg:py-14">
      <PageContainer>
        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.5}
          />

          Back
        </button>

        <section
          className="
            mx-auto
            grid
            max-w-6xl
            gap-8
            md:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]
            lg:gap-14
          "
        >
          {/* Product image */}

          <div
            className="
              grid
              gap-4
              lg:grid-cols-[80px_minmax(0,1fr)]
            "
          >
            {/* Thumbnail rail */}

            <div
              className="
                order-2
                flex
                gap-2
                overflow-x-auto
                lg:order-1
                lg:flex-col
              "
            >
              {[1, 2, 3].map(
                (thumbnail) => (
                  <button
                    key={thumbnail}
                    type="button"
                    className="
                      size-16
                      shrink-0
                      overflow-hidden
                      border
                      border-black/20
                      bg-white
                      sm:size-20
                    "
                  >
                    <img
                      src={
                        product.imageUrl
                      }
                      alt=""
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  </button>
                ),
              )}
            </div>

            {/* Main image */}

            <div className="order-1 overflow-hidden bg-neutral-200 lg:order-2">
              <img
                src={
                  product.imageUrl
                }
                alt={product.name}
                className="
                  aspect-4/5
                  h-full
                  w-full
                  object-cover
                "
              />
            </div>
          </div>

          {/* Product information */}

          <div
            className="
              border
              border-black/10
              bg-[#f4f4f1]
              p-5
              sm:p-7
              lg:self-start
              lg:p-8
            "
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                  {product.sku}
                </p>

                <h1
                  className="
                    mt-3
                    text-xl
                    font-semibold
                    uppercase
                    tracking-[-0.02em]
                    sm:text-2xl
                  "
                >
                  {product.name}
                </h1>
              </div>

              <button
                type="button"
                aria-label="Add to wishlist"
                className="
                  flex
                  size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-black/10
                  transition
                  hover:bg-black
                  hover:text-white
                "
              >
                <Heart
                  size={15}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            <p className="mt-3 text-lg font-medium">
              {formatCurrency(
                product.price,
              )}
            </p>

            <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
              <span>★</span>

              <span>
                {product.rating.toFixed(
                  1,
                )}
              </span>
            </div>

            <p className="mt-2 text-[11px] text-neutral-500">
              MRP incl. of all taxes
            </p>

            {/* Total product stock warning */}

            {isOutOfStock ? (
              <p className="mt-3 text-xs font-medium text-red-600">
                Out of stock
              </p>
            ) : shouldShowLowStock ? (
              <p className="mt-3 text-xs font-medium text-red-600">
                {totalStock}{" "}
                {totalStock === 1
                  ? "item"
                  : "items"}{" "}
                left in stock
              </p>
            ) : null}

            <div className="my-7 border-t border-black/10" />

            <p className="text-sm leading-6 text-neutral-700">
              {product.description ??
                "Boutique fashion designed for everyday comfort and style."}
            </p>

            <div className="my-7 border-t border-black/10" />

            <SizeSelector
              variants={
                product.variants
              }
              selectedVariantId={
                selectedVariantId
              }
              onSelect={(
                variantId,
              ) => {
                setSelectedVariantId(
                  variantId,
                );

                setQuantity(1);
                setMessage(null);
                setMessageType(null);
              }}
            />

            <div className="mt-6">
              <QuantityControl
                quantity={quantity}
                onChange={
                  setQuantity
                }
              />
            </div>

            <div className="mt-2 flex justify-between text-[9px] uppercase tracking-[0.06em] text-neutral-500">
              <button
                type="button"
                className="hover:text-black"
              >
                Find your size
              </button>

              <button
                type="button"
                className="hover:text-black"
              >
                Measurement guide
              </button>
            </div>

            {message && (
              <p
                className={`
                  mt-5
                  text-xs
                  font-medium
                
                  ${
                    messageType === "error"
                      ? "text-red-600"
                      : "text-green-700"
                  }
                `}
              >
                {message}
              </p>
            )}

            <div className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
              <button
                type="button"
                disabled={
                  isAdding ||
                  isOutOfStock
                }
                onClick={
                  handleAddToCart
                }
                className="
                  flex
                  min-h-12
                  items-center
                  justify-center
                  gap-2
                  border
                  border-black
                  bg-black
                  px-5
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.08em]
                  text-white
                  transition
                  hover:bg-transparent
                  hover:text-black
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <ShoppingBag
                  size={15}
                />

                {isAdding
                  ? "Adding..."
                  : isOutOfStock
                    ? "Out of Stock"
                    : "Add to Cart"}
              </button>

              <button
                type="button"
                disabled={
                  isOutOfStock
                }
                onClick={
                  handleBuyNow
                }
                className="
                  min-h-12
                  border
                  border-black
                  px-5
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.08em]
                  transition
                  hover:bg-black
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Buy Now
              </button>
            </div>
          </div>
        </section>
      </PageContainer>
    </main>
  );
}