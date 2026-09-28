import { ArrowRight } from 'lucide-react';

type Props = {
  onShopNow: () => void;
};

export function Hero({ onShopNow }: Props) {
  return (
    <section className="relative overflow-hidden bg-stone-900">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/6567204/pexels-photo-6567204.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600"
          alt="Shopping"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-stone-900/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-400 mb-4">
            New Collection 2026
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Products you'll love, designed to last.
          </h1>
          <p className="text-lg text-stone-300 mt-6 leading-relaxed max-w-lg">
            Discover thoughtfully curated electronics, fashion, and home goods.
            Quality over quantity, always.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <button
              onClick={onShopNow}
              className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-stone-900 hover:bg-stone-100 transition-all"
            >
              Shop Now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button onClick={onShopNow} className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Explore Categories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
