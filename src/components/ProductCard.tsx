import { Star, Plus } from 'lucide-react';
import type { Product } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/CartContext';

type Props = {
  product: Product;
  onSelect: (product: Product) => void;
};

export function ProductCard({ product, onSelect }: Props) {
  const { addItem } = useCart();

  return (
    <div
      className="group cursor-pointer"
      onClick={() => onSelect(product)}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100 mb-4">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            addItem(product);
          }}
          className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-white shadow-lg opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-stone-800"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="h-5 w-5" />
        </button>
        {product.stock < 20 && product.stock > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-amber-500/95 px-3 py-1 text-xs font-semibold text-white">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
          {product.category}
        </p>
        <h3 className="font-medium text-stone-900 leading-snug group-hover:text-stone-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm text-stone-500">
            {product.rating} ({product.reviews_count})
          </span>
        </div>
        <p className="text-lg font-semibold text-stone-900 pt-1">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  );
}
