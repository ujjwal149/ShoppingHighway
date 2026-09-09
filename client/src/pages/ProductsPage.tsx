import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  SlidersHorizontal,
} from "lucide-react";

import PageContainer from "../components/layout/PageContainer";
import SearchBar from "../components/common/SearchBar";

import ProductGrid from "../components/product/ProductGrid";
import ProductFilters from "../components/product/ProductFilters";
import MobileFilterDrawer from "../components/product/MobileFilterDrawer";
import CategoryChips from "../components/product/CategoryChips";
import Pagination from "../components/product/Pagination";

import {
  getProducts,
} from "../api/product.api";

import {
  getCategories,
} from "../api/category.api";

import type {
  Product,
} from "../types/product";

import type {
  Category,
} from "../types/category";

export default function ProductsPage() {
  /*
   * URL filter state
   *
   * Example:
   * /products?categoryId=2&rating=4&page=1
   */
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  /*
   * Product data
   */
  const [products, setProducts] =
    useState<Product[]>([]);

  /*
   * Category data
   */
  const [categories, setCategories] =
    useState<Category[]>([]);

  /*
   * Request state
   */
  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Mobile drawer state
   */
  const [isFilterOpen, setIsFilterOpen] =
    useState(false);

  /*
   * Pagination information returned
   * by the backend.
   */
  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 8,
      hasNextPage: false,
    });

  /*
   * ---------------------------------
   * Read filter values from the URL
   * ---------------------------------
   */

  const search =
    searchParams.get("search") ??
    undefined;

  const categoryIdValue =
    searchParams.get("categoryId");

  const categoryId =
    categoryIdValue
      ? Number(categoryIdValue)
      : undefined;

  const minPriceValue =
    searchParams.get("minPrice");

  const minPrice =
    minPriceValue
      ? Number(minPriceValue)
      : undefined;

  const maxPriceValue =
    searchParams.get("maxPrice");

  const maxPrice =
    maxPriceValue
      ? Number(maxPriceValue)
      : undefined;

  const ratingValue =
    searchParams.get("rating");

  const rating =
    ratingValue
      ? Number(ratingValue)
      : undefined;

  const page =
    Number(
      searchParams.get("page") ?? 1,
    );

  const selectedPrice =
    searchParams.get("price") ??
    undefined;

  /*
   * ---------------------------------
   * Load categories once
   * ---------------------------------
   */

  useEffect(() => {
    const loadCategories =
      async () => {
        try {
          const response =
            await getCategories();

          setCategories(
            response.data,
          );
        } catch (error) {
          console.error(
            "Failed to load categories:",
            error,
          );
        }
      };

    loadCategories();
  }, []);

  /*
   * ---------------------------------
   * Load products
   * ---------------------------------
   *
   * This effect runs again whenever
   * one of the filters changes.
   */

  useEffect(() => {
    const loadProducts =
      async () => {
        try {
          setIsLoading(true);
          setError(null);

          const response =
            await getProducts({
              search,
              categoryId,
              minPrice,
              maxPrice,
              rating,
              page,
              limit: 8,
            });

          setProducts(
            response.data,
          );

          setPagination(
            response.pagination,
          );
        } catch (error) {
          console.error(
            "Failed to load products:",
            error,
          );

          setError(
            "Unable to load products. Please try again.",
          );
        } finally {
          setIsLoading(false);
        }
      };

    loadProducts();
  }, [
    search,
    categoryId,
    minPrice,
    maxPrice,
    rating,
    page,
  ]);

  /*
   * ---------------------------------
   * Reusable URL updater
   * ---------------------------------
   */

  const updateParams = (
    updates: Record<
      string,
      string | undefined
    >,
  ) => {
    const params =
      new URLSearchParams(
        searchParams,
      );

    Object.entries(
      updates,
    ).forEach(
      ([key, value]) => {
        if (value === undefined) {
          params.delete(key);
        } else {
          params.set(
            key,
            value,
          );
        }
      },
    );

    setSearchParams(params);
  };

  /*
   * ---------------------------------
   * Price filter
   * ---------------------------------
   *
   * Prices in our database are
   * stored in paise.
   */

  const handlePriceChange = (
    range?: string,
  ) => {
    switch (range) {
      case "under-1500":
        updateParams({
          price: range,
          minPrice: undefined,
          maxPrice: "150000",
          page: "1",
        });
        break;

      case "1500-3000":
        updateParams({
          price: range,
          minPrice: "150000",
          maxPrice: "300000",
          page: "1",
        });
        break;

      case "3000-5000":
        updateParams({
          price: range,
          minPrice: "300000",
          maxPrice: "500000",
          page: "1",
        });
        break;

      case "above-5000":
        updateParams({
          price: range,
          minPrice: "500000",
          maxPrice: undefined,
          page: "1",
        });
        break;

      default:
        updateParams({
          price: undefined,
          minPrice: undefined,
          maxPrice: undefined,
          page: "1",
        });
    }
  };

  /*
   * ---------------------------------
   * Clear all filters
   * ---------------------------------
   */

  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <main className="py-8 lg:py-12">
      <PageContainer>
        {/* Page heading */}

        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
          <div />

          <div>
            <p className="text-xs text-neutral-500">
              Home /{" "}
              <span className="font-medium text-black">
                Products
              </span>
            </p>

            <h1 className="mt-1 text-2xl font-bold uppercase tracking-[-0.03em] sm:text-3xl">
              Products
            </h1>
          </div>
        </div>

        {/* Main catalog */}

        <div
          className="
            mt-6
            grid
            items-start
            gap-8
            lg:grid-cols-[220px_minmax(0,1fr)]
          "
        >
          {/* Desktop filters */}

          <aside className="hidden self-start lg:block">
            <div
              className="
                sticky
                top-24
                max-h-[calc(100vh-7rem)]
                overflow-y-auto
                overscroll-contain
                pr-2
                scrollbar-gutter-stable
              "
            >
              <ProductFilters
                categories={
                  categories
                }
                selectedCategoryId={
                  categoryId
                }
                selectedPrice={
                  selectedPrice
                }
                selectedRating={
                  rating
                }
                onCategoryChange={(
                  id,
                ) =>
                  updateParams({
                    categoryId:
                      id?.toString(),
                    page: "1",
                  })
                }
                onPriceChange={
                  handlePriceChange
                }
                onRatingChange={(
                  value,
                ) =>
                  updateParams({
                    rating:
                      value?.toString(),
                    page: "1",
                  })
                }
                onClear={
                  handleClearFilters
                }
              />
            </div>
          </aside>

          {/* Products side */}

          <section className="min-w-0">
            {/* Search */}

            <SearchBar
              placeholder="Search products"
              className="max-w-xl"
              onSearch={(value) =>
                updateParams({
                  search:
                    value.trim() ||
                    undefined,
                  page: "1",
                })
              }
            />

            {/* Mobile filter button */}

            <div className="mt-4 flex items-center justify-between lg:hidden">
              <button
                type="button"
                onClick={() =>
                  setIsFilterOpen(
                    true,
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  text-base
                  font-semibold
                "
              >
                Filters

                <SlidersHorizontal
                  size={16}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {/* Category shortcuts */}

            <div className="mt-5">
              <CategoryChips
                categories={categories}
                selectedCategoryId={
                  categoryId
                }
                onCategoryChange={(id) =>
                  updateParams({
                    categoryId:
                      id?.toString(),
                    page: "1",
                  })
                }
              />
            </div>

            {/* Products */}

            <div className="mt-6">
              {isLoading && (
                <div className="py-20 text-center">
                  <p className="text-xs uppercase tracking-[0.08em] text-neutral-500">
                    Loading
                    collection...
                  </p>
                </div>
              )}

              {error && (
                <div className="border border-red-200 bg-red-50 p-5">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {!isLoading &&
                !error &&
                products.length ===
                  0 && (
                  <div className="py-20 text-center">
                    <p className="text-xs uppercase tracking-[0.08em] text-neutral-500">
                      No products
                      found
                    </p>
                  </div>
                )}

              {!isLoading &&
                !error &&
                products.length >
                  0 && (
                  <>
                    <ProductGrid
                      products={
                        products
                      }
                    />

                    <Pagination
                      page={
                        pagination.page
                      }
                      hasNextPage={
                        pagination.hasNextPage
                      }
                      onPageChange={(
                        newPage,
                      ) =>
                        updateParams({
                          page: newPage.toString(),
                        })
                      }
                    />
                  </>
                )}
            </div>
          </section>
        </div>
      </PageContainer>

      {/* Mobile filters */}

      <MobileFilterDrawer
        isOpen={isFilterOpen}
        onClose={() =>
          setIsFilterOpen(false)
        }
        categories={categories}
        selectedCategoryId={
          categoryId
        }
        selectedPrice={
          selectedPrice
        }
        selectedRating={rating}
        onCategoryChange={(id) =>
          updateParams({
            categoryId:
              id?.toString(),
            page: "1",
          })
        }
        onPriceChange={
          handlePriceChange
        }
        onRatingChange={(
          value,
        ) =>
          updateParams({
            rating:
              value?.toString(),
            page: "1",
          })
        }
        onClear={
          handleClearFilters
        }
      />
    </main>
  );
}