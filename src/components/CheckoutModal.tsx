import { useState, useEffect } from 'react';
import { X, Check, Loader2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { supabase } from '@/lib/supabase';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type Step = 'form' | 'processing' | 'success';

export function CheckoutModal({ isOpen, onClose }: Props) {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState<Step>('form');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const shipping = subtotal >= 75 ? 0 : 7.95;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep('processing');

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const { data, error: insertError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name,
          customer_email: form.email,
          shipping_address: form.address,
          city: form.city,
          zip_code: form.zip,
          total,
          items: orderItems,
          status: 'confirmed',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setOrderId(data.id);
      clear();
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStep('form');
    }
  };

  const handleClose = () => {
    if (step === 'success') {
      setStep('form');
      setForm({ name: '', email: '', address: '', city: '', zip: '' });
      setOrderId(null);
    }
    setError(null);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-[slideUp_0.3s_ease-out]">
          {step !== 'success' && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-stone-600" />
            </button>
          )}

          {step === 'success' ? (
            <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6 animate-[scaleIn_0.3s_ease-out]">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900">Order Confirmed!</h2>
              <p className="text-sm text-stone-500 mt-2 max-w-sm">
                Thank you for your purchase. A confirmation email is on its way.
              </p>
              <div className="mt-6 rounded-xl bg-stone-50 px-6 py-4 w-full">
                <p className="text-xs text-stone-400 uppercase tracking-wide">Order Number</p>
                <p className="text-sm font-mono font-semibold text-stone-900 mt-1">
                  {orderId?.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-8 rounded-full bg-stone-900 px-8 py-3 text-sm font-semibold text-white hover:bg-stone-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : step === 'processing' ? (
            <div className="flex flex-col items-center justify-center px-8 py-20">
              <Loader2 className="h-10 w-10 text-stone-400 animate-spin" />
              <p className="text-sm text-stone-500 mt-4">Processing your order...</p>
            </div>
          ) : (
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="h-5 w-5 text-stone-700" />
                <h2 className="text-xl font-bold text-stone-900">Checkout</h2>
              </div>

              {error && (
                <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Full Name"
                    required
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                  />
                  <Field
                    label="Email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                  />
                </div>
                <Field
                  label="Shipping Address"
                  required
                  value={form.address}
                  onChange={(v) => setForm({ ...form, address: v })}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="City"
                    required
                    value={form.city}
                    onChange={(v) => setForm({ ...form, city: v })}
                  />
                  <Field
                    label="ZIP Code"
                    required
                    value={form.zip}
                    onChange={(v) => setForm({ ...form, zip: v })}
                  />
                </div>

                <div className="rounded-xl bg-stone-50 p-4 space-y-2 mt-6">
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-stone-900 pt-2 border-t border-stone-200">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={items.length === 0}
                  className="w-full rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white hover:bg-stone-800 transition-colors disabled:opacity-50"
                >
                  Place Order · {formatPrice(total)}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-600 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all"
      />
    </div>
  );
}
