import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductById } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const useProducts = (category?: string, limit?: number, page: number = 1) => {
  return useQuery({
    queryKey: ['products', category, page, limit],
    queryFn: () => fetchProducts({ category, limit, page }),
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to fetch products: ${error.message}`,
        variant: 'destructive',
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to fetch product: ${error.message}`,
        variant: 'destructive',
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
