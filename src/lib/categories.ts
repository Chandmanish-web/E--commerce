export const CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Accessories',
  'Home',
] as const;

export type Category = (typeof CATEGORIES)[number];
