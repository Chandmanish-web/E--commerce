import { Heart, ShoppingBag, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type Props = {
  onSearch: (query: string) => void;
  searchQuery: string;
};

export function Header({ onSearch, searchQuery }: Props) {
  const { totalItems, wishlist, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <a href="#/" className="flex items-center gap-2.5 shrink-0" aria-label="Maven home">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900">
              Maven
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600" aria-label="Main navigation">
            <a href="#/" className="hover:text-stone-950 transition-colors">Home</a>
            <a href="#/shop" className="hover:text-stone-950 transition-colors">Shop</a>
            <a href="#/about" className="hover:text-stone-950 transition-colors">Our story</a>
            <a href="#/contact" className="hover:text-stone-950 transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#/wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
              aria-label={`Wishlist${wishlist.length ? `, ${wishlist.length} items` : ''}`}
            >
              <Heart className="h-5 w-5 text-stone-700" />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-xs font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </a>
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5 text-stone-700" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
