import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

type Props = {
  onCheckout: () => void;
};

export function CartDrawer({ onCheckout }: Props) {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  const shipping = subtotal >= 75 ? 0 : 7.95;
  const total = subtotal + shipping;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-400 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-stone-700" />
            <h2 className="text-lg font-semibold text-stone-900">
              Your Cart {totalItems > 0 && `(${totalItems})`}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5 text-stone-600" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 mb-4">
              <ShoppingBag className="h-9 w-9 text-stone-400" />
            </div>
            <p className="text-lg font-medium text-stone-900">Your cart is empty</p>
            <p className="text-sm text-stone-500 mt-1 mb-6">
              Add some products to get started.
            </p>
            <button
              onClick={closeCart}
              className="rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 border-b border-stone-100 pb-4"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-xl object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-stone-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {item.product.category}
                      </p>
                      <p className="text-sm font-semibold text-stone-900 mt-1">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 rounded-full border border-stone-200">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-xs text-stone-400 hover:text-stone-900 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-100 px-6 py-5 space-y-3 bg-stone-50">
              <div className="flex justify-between text-sm text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>Shipping</span>
                <span className="font-medium text-stone-900">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              {subtotal < 75 && subtotal > 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                  Add {formatPrice(75 - subtotal)} more for free shipping
                </p>
              )}
              <div className="flex justify-between text-base font-semibold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white hover:bg-stone-800 transition-colors mt-2"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
