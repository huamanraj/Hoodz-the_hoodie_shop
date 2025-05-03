import { Product } from '../types/product';

const API_URL = "https://hoodz-backend.vercel.app/api/v1";

type FetchProductsParams = {
  category?: string;
  limit?: number;
  page?: number;
};

type ProductsResponse = {
  products: Product[];
  page: number;
  pages: number;
  total: number;
};

type SearchProductsParams = {
  query: string;
  limit?: number;
};

export const fetchProducts = async (params: FetchProductsParams = {}): Promise<ProductsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.category) {
    queryParams.append('category', params.category);
  }
  
  if (params.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params.page) {
    queryParams.append('page', params.page.toString());
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await fetch(`${API_URL}/products${queryString}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch products');
  }
  
  return response.json();
};

export const searchProducts = async (params: SearchProductsParams): Promise<Product[]> => {
  const queryParams = new URLSearchParams();
  
  queryParams.append('query', params.query);
  
  if (params.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await fetch(`${API_URL}/products/search${queryString}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to search products');
  }
  
  return response.json();
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch product');
  }
  
  return response.json();
};

export const createProduct = async (productData: Omit<Product, '_id'>): Promise<Product> => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create product');
  }
  
  return response.json();
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update product');
  }
  
  return response.json();
};

export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete product');
  }
  
  return response.json();
};
