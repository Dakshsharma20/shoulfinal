export interface ProductImage {
  url: string;
  publicId: string;
  order: number;
}

export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
}

/**
 * Shape returned by /api/products and /api/admin/products (with
 * category populated). Field names deliberately match the Mongoose
 * Product model — this is what actually comes back from MongoDB, not a
 * frontend-invented shape.
 */
export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  price: number;
  images: ProductImage[];
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  inStock: boolean;
  isVisible: boolean;
  material: string;
  color?: string;
  careInstructions: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; publicId: string };
  displayOrder: number;
}

export interface Testimonial {
  name: string;
  location: string;
  quote: string;
  rating: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Reel {
  id: string;
  title: string;
  caption: string;
  thumbnail: string;
}
