import { ArrowRight, Heart, Headphones, House, RotateCcw, ShieldCheck, Shirt, Truck } from 'lucide-react';
import type { Product } from '@/lib/supabase';
import { CATEGORIES, type Category } from '@/lib/categories';
import { ProductCard } from '@/components/ProductCard';

type Props = {
  products: Product[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onShop: (category?: Category) => void;
  onSelectProduct: (product: Product) => void;
  onExploreCategories: () => void;
};

const categoryImages: Record<Exclude<Category, 'All'>, string> = {
  Electronics: 'https://images.pexels.com/photos/5081382/pexels-photo-5081382.jpeg?auto=compress&cs=tinysrgb&w=900',
  Fashion: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=900',
  Accessories: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=900',
  Home: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=900',
};

const categoryIcons = {
  Electronics: Headphones,
  Fashion: Shirt,
  Accessories: Heart,
  Home: House,
};

export function LandingPage({ products, loading, error, onRetry, onShop, onSelectProduct, onExploreCategories }: Props) {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);
  const categories = CATEGORIES.filter((category): category is Exclude<Category, 'All'> => category !== 'All');

  return (
    <main>
      <section className="relative isolate min-h-[560px] overflow-hidden bg-stone-950 text-white md:min-h-[620px]">
        <img
          src="https://images.pexels.com/photos/6567204/pexels-photo-6567204.jpeg?auto=compress&cs=tinysrgb&h=1200&w=2000"
          alt="A considered collection of everyday goods"
          loading="eager"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950/90 via-stone-950/65 to-stone-950/20" />
        <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20 sm:px-6 md:min-h-[620px] lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Thoughtful finds for everyday living</p>
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.04] md:text-7xl">Maven, for the way you live.</h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-stone-200 md:text-lg">
              A considered edit of useful, well-made pieces across home, fashion, accessories, and tech. Less noise, more things worth keeping.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button type="button" onClick={() => onShop()} className="inline-flex min-h-12 items-center gap-2 bg-white px-6 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                Shop the collection <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={onExploreCategories} className="min-h-12 border border-white/60 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                Explore categories
              </button>
            </div>
            <p className="mt-8 text-sm text-stone-300">Complimentary shipping on orders over $75</p>
          </div>
        </div>
      </section>

      <section id="home-categories" className="scroll-mt-24 border-b border-stone-200 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-700">Browse the edit</p>
              <h2 className="text-3xl font-semibold text-stone-950">Good things, by category</h2>
            </div>
            <button type="button" onClick={() => onShop()} className="hidden items-center gap-2 pb-1 text-sm font-semibold text-stone-700 hover:text-stone-950 sm:inline-flex">
              View everything <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {categories.map((category) => {
              const product = products.find((item) => item.category === category);
              const Icon = categoryIcons[category];
              return (
                <button key={category} type="button" onClick={() => onShop(category)} className="group relative aspect-[4/5] overflow-hidden bg-stone-100 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900">
                  <img src={product?.image_url || categoryImages[category]} alt={`${category} collection`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white md:p-5">
                    <div>
                      <Icon className="mb-3 h-5 w-5" aria-hidden="true" />
                      <h3 className="text-lg font-semibold md:text-xl">{category}</h3>
                    </div>
                    <ArrowRight className="mb-1 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-700">Chosen by Maven</p>
              <h2 className="text-3xl font-semibold text-stone-950">A few good places to start</h2>
            </div>
            <button type="button" onClick={() => onShop()} className="hidden items-center gap-2 pb-1 text-sm font-semibold text-stone-700 hover:text-stone-950 sm:inline-flex">
              Shop all <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-6" role="status" aria-label="Loading featured products">
              {Array.from({ length: 4 }, (_, index) => <div key={index} className="animate-pulse"><div className="aspect-square bg-stone-100" /><div className="mt-4 h-4 w-3/4 bg-stone-100" /><div className="mt-3 h-4 w-1/3 bg-stone-100" /></div>)}
            </div>
          ) : error ? (
            <div className="border-y border-stone-200 py-10 text-center">
              <p className="text-sm text-stone-600">We could not load the collection just now.</p>
              <button type="button" onClick={onRetry} className="mt-3 text-sm font-semibold text-stone-950 underline underline-offset-4">Try again</button>
            </div>
          ) : featuredProducts.length ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {featuredProducts.map((product) => <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />)}
            </div>
          ) : (
            <p className="border-y border-stone-200 py-10 text-sm text-stone-600">New finds are on their way. Browse the full collection in the meantime.</p>
          )}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-stone-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_0.7fr] md:items-center md:gap-16 md:py-20 lg:px-8">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-700">The Maven point of view</p>
            <h2 className="max-w-xl text-3xl font-semibold leading-tight text-stone-950 md:text-4xl">Useful by design. Chosen to stay.</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-stone-600">We believe everyday things deserve a little more thought. Maven brings together practical, well-designed essentials and keeps the collection focused, so finding something you will use feels simple.</p>
            <a href="#/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-950 hover:text-amber-800">Get to know Maven <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="grid grid-cols-2 border-l border-t border-stone-200">
            <div className="border-b border-r border-stone-200 bg-white p-5 md:p-6"><p className="text-sm font-semibold text-stone-950">A focused collection</p><p className="mt-2 text-sm leading-relaxed text-stone-600">Home, fashion, accessories, and useful tech in one considered edit.</p></div>
            <div className="border-b border-r border-stone-200 bg-white p-5 md:p-6"><p className="text-sm font-semibold text-stone-950">Quality over quantity</p><p className="mt-2 text-sm leading-relaxed text-stone-600">Thoughtful details and everyday usefulness come first.</p></div>
            <div className="border-b border-r border-stone-200 bg-white p-5 md:p-6"><p className="text-sm font-semibold text-stone-950">A little less guesswork</p><p className="mt-2 text-sm leading-relaxed text-stone-600">Product ratings, stock status, and clear prices help you choose.</p></div>
            <div className="border-b border-r border-stone-200 bg-white p-5 md:p-6"><p className="text-sm font-semibold text-stone-950">Here when you need us</p><p className="mt-2 text-sm leading-relaxed text-stone-600">Find delivery details, returns information, or get in touch.</p></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <TrustItem icon={<Truck />} title="Free shipping" text="On orders over $75" />
          <TrustItem icon={<RotateCcw />} title="30-day returns" text="Review our returns terms" href="#/shipping" />
          <TrustItem icon={<ShieldCheck />} title="Cash on delivery" text="Pay when your order arrives" />
          <TrustItem icon={<Headphones />} title="Customer care" text="Questions? We are here to help" href="#/contact" />
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-stone-200 pt-8 sm:flex-row sm:items-center">
          <div><h2 className="text-xl font-semibold text-stone-950">Find your next everyday favorite.</h2><p className="mt-1 text-sm text-stone-500">Browse the Maven collection, or take a closer look at how we choose.</p></div>
          <button type="button" onClick={() => onShop()} className="inline-flex min-h-11 items-center gap-2 bg-stone-950 px-5 text-sm font-semibold text-white hover:bg-stone-700">Explore the shop <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>
    </main>
  );
}

function TrustItem({ icon, title, text, href }: { icon: React.ReactNode; title: string; text: string; href?: string }) {
  const content = <><span className="flex h-10 w-10 shrink-0 items-center justify-center bg-stone-100 text-stone-800">{icon}</span><span><span className="block font-semibold text-stone-950">{title}</span><span className="mt-1 block text-sm text-stone-500">{text}</span></span></>;
  return href ? <a href={href} className="flex items-start gap-3 hover:text-stone-950">{content}</a> : <div className="flex items-start gap-3">{content}</div>;
}