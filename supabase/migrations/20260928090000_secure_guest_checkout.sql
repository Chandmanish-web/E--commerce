ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'cash_on_delivery',
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';

DROP POLICY IF EXISTS "anon_insert_orders" ON public.orders;
DROP POLICY IF EXISTS "anon_read_orders" ON public.orders;

CREATE POLICY "orders_authenticated_read_own"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

REVOKE INSERT, UPDATE, DELETE ON public.orders FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.place_guest_order(
  p_customer_name text,
  p_customer_email text,
  p_shipping_address text,
  p_city text,
  p_zip_code text,
  p_items jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  order_line jsonb;
  product_row public.products%ROWTYPE;
  product_id uuid;
  quantity integer;
  order_items jsonb := '[]'::jsonb;
  order_subtotal numeric(10, 2) := 0;
  shipping_cost numeric(10, 2);
  created_order_id uuid;
BEGIN
  IF length(trim(coalesce(p_customer_name, ''))) NOT BETWEEN 2 AND 120
    OR position('@' IN coalesce(p_customer_email, '')) < 2
    OR length(trim(coalesce(p_customer_email, ''))) > 254
    OR length(trim(coalesce(p_shipping_address, ''))) NOT BETWEEN 5 AND 300
    OR length(trim(coalesce(p_city, ''))) NOT BETWEEN 2 AND 120
    OR length(trim(coalesce(p_zip_code, ''))) NOT BETWEEN 2 AND 20 THEN
    RAISE EXCEPTION 'Please provide valid customer and shipping details.' USING ERRCODE = '22023';
  END IF;

  IF p_items IS NULL
    OR jsonb_typeof(p_items) IS DISTINCT FROM 'array'
    OR jsonb_array_length(p_items) NOT BETWEEN 1 AND 50 THEN
    RAISE EXCEPTION 'The order must contain between 1 and 50 items.' USING ERRCODE = '22023';
  END IF;

  FOR order_line IN SELECT value FROM jsonb_array_elements(p_items)
  LOOP
    BEGIN
      product_id := (order_line ->> 'product_id')::uuid;
      quantity := (order_line ->> 'quantity')::integer;
    EXCEPTION
      WHEN invalid_text_representation OR numeric_value_out_of_range THEN
        RAISE EXCEPTION 'The cart contains an invalid product or quantity.' USING ERRCODE = '22023';
    END;

    IF quantity IS NULL OR quantity NOT BETWEEN 1 AND 99 THEN
      RAISE EXCEPTION 'Each item quantity must be between 1 and 99.' USING ERRCODE = '22023';
    END IF;

    SELECT * INTO product_row
      FROM public.products
      WHERE id = product_id
      FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'A product in the cart is no longer available.' USING ERRCODE = '22023';
    END IF;

    IF product_row.stock < quantity THEN
      RAISE EXCEPTION 'Not enough stock for %.', product_row.name USING ERRCODE = '22023';
    END IF;

    UPDATE public.products
      SET stock = stock - quantity
      WHERE id = product_row.id;

    order_subtotal := order_subtotal + (product_row.price * quantity);
    order_items := order_items || jsonb_build_array(jsonb_build_object(
      'product_id', product_row.id,
      'name', product_row.name,
      'price', product_row.price,
      'quantity', quantity
    ));
  END LOOP;

  shipping_cost := CASE WHEN order_subtotal >= 75 THEN 0 ELSE 7.95 END;

  INSERT INTO public.orders (
    user_id,
    customer_name,
    customer_email,
    shipping_address,
    city,
    zip_code,
    total,
    status,
    payment_method,
    payment_status,
    items
  ) VALUES (
    auth.uid(),
    trim(p_customer_name),
    lower(trim(p_customer_email)),
    trim(p_shipping_address),
    trim(p_city),
    trim(p_zip_code),
    order_subtotal + shipping_cost,
    'pending',
    'cash_on_delivery',
    'pending',
    order_items
  ) RETURNING id INTO created_order_id;

  RETURN created_order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.place_guest_order(text, text, text, text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_guest_order(text, text, text, text, text, jsonb) TO anon, authenticated;
