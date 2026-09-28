/*
# E-commerce Schema (single-tenant, no auth)

1. New Tables
- `products`: catalog of items for sale
  - id (uuid, PK)
  - name (text)
  - description (text)
  - price (numeric)
  - image_url (text)
  - category (text)
  - stock (int)
  - featured (boolean)
  - rating (numeric)
  - reviews_count (int)
  - created_at (timestamptz)
- `orders`: customer orders
  - id (uuid, PK)
  - customer_name (text)
  - customer_email (text)
  - shipping_address (text)
  - city (text)
  - zip_code (text)
  - total (numeric)
  - status (text, default 'pending')
  - items (jsonb — array of {product_id, name, price, quantity})
  - created_at (timestamptz)

2. Security
- RLS enabled on both tables.
- Products: public read (anon + authenticated), no writes from frontend.
- Orders: anon + authenticated can insert (guest checkout) and read their own orders.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  stock int NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  reviews_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  shipping_address text NOT NULL,
  city text NOT NULL,
  zip_code text NOT NULL,
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  items jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_orders" ON orders;
CREATE POLICY "anon_read_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);
