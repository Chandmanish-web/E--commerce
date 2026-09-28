import { ShoppingBag, Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900">
                Maven
              </span>
            </div>
            <p className="text-sm text-stone-500 max-w-sm leading-relaxed">
              Thoughtfully designed products for everyday living. We curate
              quality over quantity, so every item earns its place.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-900 mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-stone-500">
              <li><a href="#/shop" className="hover:text-stone-900 transition-colors">Electronics</a></li>
              <li><a href="#/shop" className="hover:text-stone-900 transition-colors">Fashion</a></li>
              <li><a href="#/shop" className="hover:text-stone-900 transition-colors">Accessories</a></li>
              <li><a href="#/shop" className="hover:text-stone-900 transition-colors">Home</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-stone-500">
              <li><a href="#/about" className="hover:text-stone-900 transition-colors">About Us</a></li>
              <li><a href="#/shipping" className="hover:text-stone-900 transition-colors">Shipping & Returns</a></li>
              <li><a href="#/contact" className="hover:text-stone-900 transition-colors">Contact</a></li>
              <li><a href="#/privacy" className="hover:text-stone-900 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-stone-400">
            © 2026 Maven. All rights reserved.
          </p>
          <p className="text-sm text-stone-400">
            Free shipping on orders over $75
          </p>
        </div>
      </div>
    </footer>
  );
}
