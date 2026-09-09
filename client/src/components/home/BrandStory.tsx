import { Link } from "react-router-dom";

export default function BrandStory() {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-500">
          ShoppingHighway Boutique
        </p>

        <h2
          className="
            mt-5
            text-3xl
            font-medium
            uppercase
            leading-tight
            tracking-[-0.04em]
            sm:text-4xl
            lg:text-5xl
          "
        >
          Fashion selected for
          everyday individuality
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-neutral-500">
          ShoppingHighway brings together
          contemporary boutique clothing and
          accessories with a focus on simple
          discovery, thoughtful collections,
          and an effortless shopping experience.
        </p>
      </div>

      <div
        className="
          mt-12
          grid
          gap-4
          sm:grid-cols-3
          lg:mt-16
          lg:gap-6
        "
      >
        <div className="overflow-hidden sm:translate-y-8">
          <img
            src="/products/classic-denim-jacket.jpg"
            alt="Boutique denim collection"
            loading="lazy"
            className="aspect-4/5 h-full w-full object-cover"
          />
        </div>

        <div className="overflow-hidden">
          <img
            src="/products/classic-linen-shirt.jpg"
            alt="Boutique shirt collection"
            
            loading="lazy"
            className="aspect-4/5 h-full w-full object-cover"
          />
        </div>

        <div className="overflow-hidden sm:translate-y-12">
          <img
            src="/products/floral-midi-dress.jpg"
            alt="Boutique dress collection"
            loading="lazy"
            className="aspect-4/5 h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="mt-16 flex justify-center lg:mt-20">
        <Link
          to="/products"
          className="
            border
            border-black
            px-7
            py-3
            text-[10px]
            font-medium
            uppercase
            tracking-widest
            transition
            hover:bg-black
            hover:text-white
          "
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
}