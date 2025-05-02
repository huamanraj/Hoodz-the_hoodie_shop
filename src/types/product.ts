export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock?: boolean;
  sizes?: string[];
  tags?: string[];
  rating?: number;
  numReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}
