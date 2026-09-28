import { useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, Clock3, Mail, MapPin, PackageCheck, RotateCcw, ShieldCheck } from 'lucide-react';

export type InfoPageName = 'about' | 'shipping' | 'contact' | 'privacy';

const pageDetails: Record<InfoPageName, { eyebrow: string; title: string; intro: string }> = {
  about: {
    eyebrow: 'A little about us',
    title: 'Fewer things. Better chosen.',
    intro: 'Maven is a small edit of useful, well-made pieces for everyday life. We look for thoughtful design, dependable materials, and details that make something a pleasure to use.',
  },
  shipping: {
    eyebrow: 'The practical details',
    title: 'Delivery & returns',
    intro: 'Good things should arrive without the guesswork. Here is what to expect after you place an order, and how to send something back if it is not quite right.',
  },
  contact: {
    eyebrow: 'We are here to help',
    title: 'Talk to a real person.',
    intro: 'Questions about a product, an order, or finding the right fit? Leave a note below. Connect the form to your support inbox to receive customer messages.',
  },
  privacy: {
    eyebrow: 'Your information',
    title: 'Privacy, plainly stated.',
    intro: 'We collect only what we need to process your order and help you shop. We do not sell your personal information, and we work to keep it protected.',
  },
};

export function InfoPage({ page }: { page: InfoPageName }) {
  const details = pageDetails[page];
  const [submitted, setSubmitted] = useState(false);

  const handleContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-[60vh]">
      <section className="bg-stone-100 border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-amber-700">{details.eyebrow}</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-stone-950 md:text-6xl">{details.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-600">{details.intro}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        {page === 'about' && <AboutContent />}
        {page === 'shipping' && <ShippingContent />}
        {page === 'contact' && <ContactContent onSubmit={handleContact} submitted={submitted} />}
        {page === 'privacy' && <PrivacyContent />}
      </div>
    </main>
  );
}

function AboutContent() {
  return (
    <div className="grid gap-12 md:grid-cols-[1fr_0.8fr] md:gap-20">
      <div className="space-y-6 text-stone-600 leading-relaxed">
        <h2 className="text-2xl font-semibold text-stone-950">Useful by design</h2>
        <p>We started Maven with a simple question: what if shopping felt less like scrolling and more like finding exactly what you need? Our collection brings together everyday essentials across home, accessories, fashion, and tech, chosen for lasting usefulness rather than passing trends.</p>
        <p>Each piece earns its place through considered materials, practical details, and a design that feels right at home. We keep our range focused so it is easier to choose well and easier to love what arrives.</p>
        <a href="#/shop" className="inline-flex items-center gap-2 pt-2 font-semibold text-stone-950 hover:text-amber-700">Explore the collection <ArrowRight className="h-4 w-4" /></a>
      </div>
      <div className="grid grid-cols-2 gap-px self-start border border-stone-200 bg-stone-200">
        <div className="bg-white p-6"><p className="text-3xl font-bold text-stone-950">01</p><p className="mt-2 text-sm text-stone-600">Buy less, choose well</p></div>
        <div className="bg-white p-6"><p className="text-3xl font-bold text-stone-950">02</p><p className="mt-2 text-sm text-stone-600">Make the everyday better</p></div>
        <div className="bg-white p-6"><p className="text-3xl font-bold text-stone-950">03</p><p className="mt-2 text-sm text-stone-600">Care about the details</p></div>
        <div className="bg-white p-6"><p className="text-3xl font-bold text-stone-950">04</p><p className="mt-2 text-sm text-stone-600">Be here when you need us</p></div>
      </div>
    </div>
  );
}

function ShippingContent() {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <h2 className="mb-8 text-2xl font-semibold text-stone-950">Shipping</h2>
        <div className="space-y-7">
          <PolicyRow icon={<PackageCheck />} title="Free shipping over $75" text="Orders under $75 ship for a flat $6.95. Orders are usually packed within 1-2 business days." />
          <PolicyRow icon={<Clock3 />} title="Arrives in 2-5 business days" text="Standard delivery is available throughout the contiguous United States. You will receive tracking details as soon as your parcel is on its way." />
          <PolicyRow icon={<Mail />} title="Need a hand with an order?" text="Write to hello@maven.example with your order number and we will help you track it down." />
        </div>
      </div>
      <div className="border-t border-stone-200 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
        <h2 className="mb-8 text-2xl font-semibold text-stone-950">Returns</h2>
        <div className="space-y-7">
          <PolicyRow icon={<RotateCcw />} title="30 days to decide" text="Return unused items in their original condition within 30 days of delivery for a refund to your original payment method." />
          <PolicyRow icon={<ShieldCheck />} title="Simple, straightforward support" text="Email hello@maven.example with your order number. We will reply with return instructions and help make it right." />
        </div>
        <p className="mt-8 border-l-2 border-amber-500 pl-4 text-sm leading-relaxed text-stone-500">Final-sale items and items damaged through use are not eligible for return. Original shipping fees are non-refundable. Confirm rates and delivery estimates match your fulfillment setup before launch.</p>
      </div>
    </div>
  );
}

function PolicyRow({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center bg-stone-100 text-stone-700">{icon}</span><div><h3 className="font-semibold text-stone-950">{title}</h3><p className="mt-1 text-sm leading-relaxed text-stone-600">{text}</p></div></div>;
}

function ContactContent({ onSubmit, submitted }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; submitted: boolean }) {
  return (
    <div className="grid gap-12 md:grid-cols-[0.7fr_1fr] md:gap-20">
      <div className="space-y-8">
        <div><h2 className="text-xl font-semibold text-stone-950">Customer care</h2><p className="mt-2 text-stone-600">Support email to be configured</p></div>
        <div><h2 className="text-xl font-semibold text-stone-950">Support hours</h2><p className="mt-2 text-stone-600">Add your customer care hours here</p></div>
        <div className="flex items-start gap-3 text-sm text-stone-500"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /><span>Independent by nature. Online everywhere.</span></div>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-stone-700">Your name<input required name="name" autoComplete="name" className="mt-2 block w-full border border-stone-300 bg-white px-3 py-3 text-base font-normal outline-none focus:border-stone-900" /></label>
          <label className="text-sm font-medium text-stone-700">Email address<input required name="email" type="email" autoComplete="email" className="mt-2 block w-full border border-stone-300 bg-white px-3 py-3 text-base font-normal outline-none focus:border-stone-900" /></label>
        </div>
        <label className="block text-sm font-medium text-stone-700">Order number <span className="font-normal text-stone-400">(optional)</span><input name="order" className="mt-2 block w-full border border-stone-300 bg-white px-3 py-3 text-base font-normal outline-none focus:border-stone-900" /></label>
        <label className="block text-sm font-medium text-stone-700">How can we help?<textarea required name="message" rows={5} className="mt-2 block w-full resize-y border border-stone-300 bg-white px-3 py-3 text-base font-normal outline-none focus:border-stone-900" /></label>
        <button type="submit" className="bg-stone-950 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800">Send message <ArrowRight className="ml-2 inline h-4 w-4" /></button>
        {submitted && <p role="status" className="text-sm text-amber-800">This demo form does not send messages yet. Connect a support inbox before accepting customer inquiries.</p>}
        <p className="text-xs leading-relaxed text-stone-400">Your message is not transmitted or stored by this demo form.</p>
      </form>
    </div>
  );
}

function PrivacyContent() {
  return (
    <article className="max-w-3xl space-y-8 text-sm leading-relaxed text-stone-600">
      <p className="text-xs uppercase tracking-wide text-stone-400">Last updated September 28, 2026</p>
      <section><h2 className="mb-2 text-xl font-semibold text-stone-950">What we collect</h2><p>When you place an order, we use the details you provide, such as your name, email, delivery address, and order information, to process and support that purchase. Payment information is handled by our payment provider; Maven does not store full card numbers.</p></section>
      <section><h2 className="mb-2 text-xl font-semibold text-stone-950">How we use it</h2><p>We use personal information to fulfill orders, respond to questions, prevent fraud, and improve the store. We do not sell or rent your personal information. We share only the information needed with service providers that help us operate, such as payment and delivery partners.</p></section>
      <section><h2 className="mb-2 text-xl font-semibold text-stone-950">Cookies and analytics</h2><p>Our store may use essential browser storage to support shopping features. Optional analytics or advertising tools should only be enabled with appropriate notice and consent where required.</p></section>
      <section><h2 className="mb-2 text-xl font-semibold text-stone-950">Your choices</h2><p>You can ask to access, correct, or delete your personal information, subject to legal and order-record requirements. Contact <a className="underline underline-offset-4 hover:text-stone-950" href="mailto:hello@maven.example">hello@maven.example</a> and we will respond to your request.</p></section>
      <p className="border-t border-stone-200 pt-6 text-xs text-stone-400">This is a general store privacy notice template. Update it to reflect the services, vendors, and legal requirements that apply to your business.</p>
    </article>
  );
}