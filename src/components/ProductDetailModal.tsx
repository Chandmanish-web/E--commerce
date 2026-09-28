import { X, Star, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/CartContext';

type Props = {
  product: Product | null;
  onClose: () => void;
};

export function ProductDetailModal({ product, onClose }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [product]);

  if (!product) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-[slideUp_0.3s_ease-out]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-md hover:bg-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-stone-700" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="aspect-square md:aspect-auto md:h-full bg-stone-100 overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-8 flex flex-col">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400 mb-2">
                {product.category}
              </p>
              <h2 className="text-2xl font-bold text-stone-900 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-stone-500">
                  {product.rating} · {product.reviews_count} reviews
                </span>
              </div>

              <p className="text-3xl font-bold text-stone-900 mt-6">
                {formatPrice(product.price)}
              </p>

              <p className="text-sm text-stone-600 leading-relaxed mt-4">
                {product.description}
              </p>

              <div className="mt-4 flex items-center gap-2">
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5 text-sm text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    In stock {product.stock < 20 && `(${product.stock} left)`}
                  </span>
                ) : (
                  <span className="text-sm text-stone-500">Out of stock</span>
                )}
              </div>

              <div className="mt-auto pt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-stone-700">Quantity</span>
                  <div className="flex items-center gap-1 rounded-full border border-stone-200">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addItem(product, quantity);
                    onClose();
                  }}
                  disabled={product.stock === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Add to Cart · {formatPrice(product.price * quantity)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
