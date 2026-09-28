import { Heart, Star, Plus } from 'lucide-react';
import type { Product } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/CartContext';

type Props = {
  product: Product;
  onSelect: (product: Product) => void;
};

export function ProductCard({ product, onSelect }: Props) {
  const { addItem, toggleWishlist, isWishlisted } = useCart();

  return (
    <article className="group">
      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-stone-100">
        <button type="button" onClick={() => onSelect(product)} className="h-full w-full" aria-label={`View ${product.name}`}>
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </button>
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={isWishlisted(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isWishlisted(product.id)}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-stone-700 shadow-sm transition-colors hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
        >
          <Heart className={`h-5 w-5 ${isWishlisted(product.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>
        <button
          type="button"
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
          className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-white shadow-lg transition-all duration-300 hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:bg-stone-400"
          aria-label={product.stock > 0 ? `Add ${product.name} to cart` : `${product.name} is out of stock`}
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
        <button type="button" onClick={() => onSelect(product)} className="text-left font-medium leading-snug text-stone-900 transition-colors hover:text-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500">
          {product.name}
        </button>
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
    </article>
  );
}
