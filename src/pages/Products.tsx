import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '@/hooks/use-products';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } = useProducts(category, 12, page);

  const handleNextPage = () => {
    if (data && page < data.pages) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          {category ? `${category.toUpperCase()} COLLECTION` : 'ALL PRODUCTS'}
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[250px] w-full rounded-md" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-red-500">Error loading products. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {data?.products.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="group">
                  <div className="overflow-hidden bg-gray-50 aspect-[3/4]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&q=80";
                      }}
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-gray-700">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>

            {data && data.pages > 1 && (
              <div className="flex justify-between items-center mt-12">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1 || isFetching}
                  className="px-4 py-2 border border-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="text-sm">
                  Page {page} of {data.pages}
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={page === data.pages || isFetching}
                  className="px-4 py-2 border border-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Products;
