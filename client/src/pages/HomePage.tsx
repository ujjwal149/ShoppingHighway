
import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import SearchBar from "../components/common/SearchBar";
import PageContainer from "../components/layout/PageContainer";

import HomeProductSection from "../components/home/HomeProductSection";
import OfferSection from "../components/home/OfferSection";
import BrandStory from "../components/home/BrandStory";

import {
  getProducts,
} from "../api/product.api";

import type {
  Product,
} from "../types/product";

export default function HomePage() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState<Product[]>([]);

  useEffect(() =>{
    const loadProducts = async () => {
      try { 
        const response = await getProducts(
         { limit: 10,}
        );

        setProducts(response.data);
      }catch (error) {
        console.error(
          "Failed to load home products:",
          error,
        );
      }
    };
    loadProducts();
  },[]);

  const newProducts =
  products.slice(0, 4);

  const featuredProducts =
  products.slice(4, 8);

  const handleSearch = (
    searchTerm: string,
  ) => {
    navigate(
      `/products?search=${encodeURIComponent(
        searchTerm,
      )}`,
    );
  };

  return (
    <main>
      <PageContainer>
        <section className="py-8 sm:py-10 lg:py-14 ">
          {/* Category shortcuts */}

          <nav className="flex flex-col items-start gap-0.5 ">
            <button className="text-[10px] uppercase tracking-[0.08em] transition hover:opacity-50 cursor-pointer">
              Women
            </button>

            <button className="text-[10px] uppercase tracking-[0.08em] transition hover:opacity-50 cursor-pointer">
              Men
            </button>

            <button className="text-[10px] uppercase tracking-[0.08em] transition hover:opacity-50 cursor-pointer">
              Accessories
            </button>
          </nav>

          {/* Search */}

          <SearchBar
            onSearch={handleSearch}
            placeholder="Search products"
            className="
              mt-4
              max-w-sm
              sm:max-w-md
            "
          />

          {/* Hero */}

          <div
            className="
              mt-16
              grid
              items-end
              gap-10
              md:grid-cols-[0.8fr_1.2fr]
              lg:mt-20
            "
          >
            <div>
              <p className="text-[11px] uppercase tracking-widest text-neutral-500">
                ShoppingHighway / 2026
              </p>

              <h1
                className="
                  mt-4
                  text-5xl
                  font-bold
                  uppercase
                  leading-[0.82]
                  tracking-[-0.06em]
                  sm:text-6xl
                  lg:text-7xl
                "
              >
                New
                <br />
                Collection
              </h1>

              <p className="mt-4 text-xs leading-5 text-neutral-600">
                Boutique Collection
                <br />
                2026
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
                className="
                  mt-10
                  flex
                  min-h-10
                  w-full
                  max-w-52.5
                  items-center
                  justify-between
                  border
                  border-black/10
                  bg-black/4
                  px-4
                  text-[10px]
                  uppercase
                  tracking-[0.08em]
                  transition
                  hover:bg-black
                  hover:text-white
                "
              >
                <span>Go To Shop</span>

                <span className="text-lg">
                  →
                </span>
              </button>
            </div>

            {/* Temporary visual area */}

            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:gap-5
              "
            >
            <div className="overflow-hidden bg-neutral-200">
              <img
                src="/products/gown-left.jpg"
                alt="Floral Midi Dress"
                className="aspect-4/5 h-full w-full object-cover"
              />
            </div>

             <div className="overflow-hidden bg-neutral-200">
              <img
                src="/products/gown-back.jpg"
                alt="Floral Midi Dress"
                className="aspect-4/5 h-full w-full object-cover"
              />
            </div>

            </div>
          </div>
        </section>

        {newProducts.length > 0 && (
        <HomeProductSection
          title="Summer Collection"
          subtitle="Fresh arrivals"
          products={newProducts}
        />
      )}

      <OfferSection />

      {featuredProducts.length > 0 && (
        <HomeProductSection
          title="Featured Collection"
          subtitle="Selected for you"
          products={featuredProducts}
        />
      )}

      <BrandStory />
      </PageContainer>
    </main>
  );
}