import {
  formatCurrency,
} from "../../utils/formatCurrency";

interface OrderItem {
  id: number;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
  size?: string;
}

interface OrderSummaryProps {
  items: OrderItem[];
}

export default function OrderSummary({
  items,
}: OrderSummaryProps) {
  const subtotal = items.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0,
  );

  return (
    <aside className="border border-black/10 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase">
          Your Order
        </h2>

        <span className="text-xs">
          ({items.length})
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="
              grid
              grid-cols-[64px_minmax(0,1fr)_auto]
              gap-3
            "
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="aspect-4/5 w-16 object-cover"
            />

            <div className="min-w-0">
              <p className="truncate text-xs font-medium uppercase">
                {item.name}
              </p>

              {item.size && (
                <p className="mt-1 text-[10px] text-neutral-500">
                  Size: {item.size}
                </p>
              )}

              <p className="mt-2 text-[10px]">
                ({item.quantity})
              </p>
            </div>

            <p className="text-xs">
              {formatCurrency(
                item.price *
                  item.quantity,
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7 space-y-3 border-t border-black/10 pt-5 text-xs">
        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>

          <span className="text-[10px] text-neutral-500">
            Calculated at next step
          </span>
        </div>

        <div className="flex justify-between border-t border-black/10 pt-4 font-semibold">
          <span>Total</span>

          <span>
            {formatCurrency(subtotal)}
          </span>
        </div>
      </div>
    </aside>
  );
}