import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetUserOrders, useGetProductCatalog } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, MapPin, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export default function OrdersPage() {
  const { data: orders, isLoading: ordersLoading } = useGetUserOrders();
  const { data: products } = useGetProductCatalog();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  const getProductName = (productId: string) => {
    const product = products?.find((p) => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getProductPrice = (productId: string) => {
    const product = products?.find((p) => p.id === productId);
    return product ? Number(product.price) / 100 : 0;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-12">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">My Orders</h1>
        <p className="text-lg text-muted-foreground">View and track all your corporate gift orders</p>
      </div>

      {ordersLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {getProductName(order.productId)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Order ID: {order.id.slice(0, 16)}...</p>
                  </div>
                  <Badge>Placed</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Quantity:</span>
                      <span>{order.quantity.toString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Total:</span>
                      <span className="text-primary font-semibold">
                        ${(getProductPrice(order.productId) * Number(order.quantity)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium block">Delivery Details:</span>
                        <span className="text-muted-foreground">{order.deliveryDetails}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm pt-2 border-t">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Company Logo:</span>
                  <a
                    href={order.companyLogo.getDirectURL()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Logo
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No orders yet</p>
            <p className="text-muted-foreground">Start browsing our products to place your first order</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
