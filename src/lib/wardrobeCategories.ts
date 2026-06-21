export const WARDROBE_CATEGORIES = [
  { id: 'tops', label: 'Tops', emoji: '👕' },
  { id: 'bottoms', label: 'Bottoms', emoji: '👖' },
  { id: 'dresses', label: 'Dresses', emoji: '👗' },
  { id: 'outerwear', label: 'Outerwear', emoji: '🧥' },
  { id: 'shoes', label: 'Footwear', emoji: '👟' },
  { id: 'accessories', label: 'Accessories', emoji: '👜' },
] as const;

export type WardrobeCategoryId = (typeof WARDROBE_CATEGORIES)[number]['id'];

export const WARDROBE_SUGGESTIONS = [
  'black oversized hoodie',
  'white sneakers',
  'beige trousers',
  'navy blazer',
  'denim jacket',
  'striped t-shirt',
  'black midi skirt',
  'brown leather boots',
];
