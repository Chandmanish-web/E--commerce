import { useState, useEffect, useRef } from 'react';
import { supabase, type Product } from '@/lib/supabase';
import { CATEGORIES, type Category } from '@/lib/categories';
import { CartProvider, useCart } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { InfoPage, type InfoPageName } from '@/components/InfoPage';
import { AlertCircle } from 'lucide-react';

type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating';
type PageName = 'shop' | 'wishlist' | InfoPageName;

function pageFromHash(): PageName {
  const page = window.location.hash.replace(/^#\/?/, '') as PageName;
  return ['about', 'shipping', 'contact', 'privacy', 'wishlist'].includes(page) ? page : 'shop';
}

function Shop() {
  const { closeCart, wishlist } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState<PageName>(pageFromHash);
  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
    const handleHashChange = () => setPage(pageFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const scrollToCatalog = () => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth';
    catalogRef.current?.scrollIntoView({ behavior });
  };

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price >= minPrice && p.price <= (maxPrice ?? Number.POSITIVE_INFINITY);
    const matchesRating = p.rating >= minRating;
    const matchesStock = !inStockOnly || p.stock > 0;
    return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesStock;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const catalogMaxPrice = Math.ceil(Math.max(0, ...products.map((product) => product.price)));
  const hasFilters = activeCategory !== 'All' || searchQuery !== '' || minPrice > 0 || maxPrice !== null || minRating > 0 || inStockOnly;

  const clearFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(null);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const openCheckout = () => {
    closeCart();
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header searchQuery={searchQuery} onSearch={setSearchQuery} />

      <div key={page} className="page-enter">
        {page === 'shop' ? <Hero onShopNow={scrollToCatalog} /> : page === 'wishlist' ? null : <InfoPage page={page} />}

        {page === 'wishlist' && (
          <section className="mx-auto min-h-[50vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-700">Saved for later</p>
            <h1 className="mb-8 text-3xl font-bold text-stone-950">Your wishlist</h1>
            {wishlist.length === 0 ? (
              <div className="border-y border-stone-200 py-16 text-center">
                <p className="text-lg font-medium text-stone-900">Nothing saved just yet</p>
                <p className="mt-2 text-sm text-stone-500">Tap the heart on a product to keep it here.</p>
                <a href="#/shop" className="mt-6 inline-flex bg-stone-950 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-700">Explore the shop</a>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
                {wishlist.map((product) => <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />)}
              </div>
            )}
          </section>
        )}

      {/* Featured Products */}
      {page === 'shop' && featuredProducts.length > 0 && !searchQuery && activeCategory === 'All' && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-amber-500 mb-2">
                Handpicked
              </p>
              <h2 className="text-3xl font-bold text-stone-900 tracking-tight">
                Featured Products
              </h2>
            </div>
            <button
              onClick={scrollToCatalog}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors hidden sm:block"
            >
              View all →
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* Full Catalog */}
      {page === 'shop' && <section
        ref={catalogRef}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight mb-6">
            All Products
          </h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mb-6 grid gap-3 rounded-xl bg-stone-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-medium text-stone-600">Minimum price
              <input type="number" min={0} max={catalogMaxPrice} value={minPrice} onChange={(event) => setMinPrice(Math.max(0, Number(event.target.value)))} className="mt-1.5 w-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </label>
            <label className="text-xs font-medium text-stone-600">Maximum price
              <input type="number" min={minPrice} max={catalogMaxPrice || undefined} value={maxPrice ?? ''} placeholder={catalogMaxPrice ? String(catalogMaxPrice) : 'No limit'} onChange={(event) => setMaxPrice(event.target.value ? Math.max(minPrice, Number(event.target.value)) : null)} className="mt-1.5 w-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </label>
            <label className="text-xs font-medium text-stone-600">Minimum rating
              <select value={minRating} onChange={(event) => setMinRating(Number(event.target.value))} className="mt-1.5 w-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200">
                <option value={0}>Any rating</option><option value={3}>3+ stars</option><option value={4}>4+ stars</option><option value={4.5}>4.5+ stars</option>
              </select>
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm text-stone-700">
              <input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} className="h-4 w-4 accent-stone-900" />
              In stock only
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-stone-500" aria-live="polite">
              {sorted.length} {sorted.length === 1 ? 'product' : 'products'}
              {hasFilters && <button type="button" onClick={clearFilters} className="ml-3 font-medium text-stone-900 underline underline-offset-4">Clear filters</button>}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 focus:border-stone-400 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-6" role="status" aria-label="Loading products">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-stone-100" />
                <div className="mt-4 h-3 w-1/3 rounded bg-stone-100" />
                <div className="mt-2 h-4 w-4/5 rounded bg-stone-100" />
                <div className="mt-3 h-3 w-1/2 rounded bg-stone-100" />
                <div className="mt-3 h-5 w-1/4 rounded bg-stone-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <AlertCircle className="h-10 w-10 text-red-400 mb-4" />
            <p className="text-sm text-stone-600 mb-2">Failed to load products</p>
            <p className="text-xs text-stone-400 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-lg font-medium text-stone-900">No products found</p>
            <p className="text-sm text-stone-500 mt-1">
              Try a different category or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {sorted.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </section>}

      {/* Value Props */}
      {page === 'shop' && <section className="border-t border-stone-100 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <ValueProp
              icon="truck"
              title="Free Shipping"
              desc="On all orders over $75. Fast 2-3 day delivery."
            />
            <ValueProp
              icon="rotate"
              title="30-Day Returns"
              desc="Not happy? Send it back, no questions asked."
            />
            <ValueProp
              icon="shield"
              title="Secure Checkout"
              desc="Your data is encrypted and never shared."
            />
          </div>
        </div>
      </section>}
      </div>

      <Footer />

      <CartDrawer onCheckout={openCheckout} />
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
}

function ValueProp({
  icon,
  title,
  desc,
}: {
  icon: 'truck' | 'rotate' | 'shield';
  title: string;
  desc: string;
}) {
  const icons = {
    truck: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9-1.5h11.25c.621 0 1.125-.504 1.125-1.125V7.875c0-.621-.504-1.125-1.125-1.125H1.5m6.75 12V7.875c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125v3.75m0 0v3.75m0-3.75H18M15 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0" />
      </svg>
    ),
    rotate: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    shield: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  };

  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-white">
        {icons[icon]}
      </div>
      <div>
        <h3 className="font-semibold text-stone-900">{title}</h3>
        <p className="text-sm text-stone-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Shop />
    </CartProvider>
  );
}
