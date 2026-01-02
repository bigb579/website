import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetProductCatalog } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import OrderDialog from '../components/OrderDialog';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { Product } from '../backend';

export default function ProductsPage() {
  const { data: products, isLoading } = useGetProductCatalog();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const handleOrderClick = (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      return;
    }
    setSelectedProduct(product);
  };

  const productImages: Record<string, string> = {
    '1': '/assets/generated/mug-product.dim_400x400.png',
    '2': '/assets/generated/pen-product.dim_400x400.png',
    '3': '/assets/generated/tshirt-product.dim_400x400.png',
  };

  return (
    <div className="container py-12">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Product Catalog</h1>
        <p className="text-lg text-muted-foreground">
          Browse our selection of customizable corporate gifts. Each item can be branded with your company logo.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-64 w-full" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={productImages[product.id] || '/assets/generated/mug-product.dim_400x400.png'}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-2">
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <p className="text-2xl font-bold text-primary">
                  ${(Number(product.price) / 100).toFixed(2)}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleOrderClick(product)}>
                  Order Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products available at the moment.</p>
        </div>
      )}

      {selectedProduct && (
        <OrderDialog product={selectedProduct} open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
