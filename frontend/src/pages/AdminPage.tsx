import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllOrders, useGetProductCatalog, useIsCallerAdmin, useGetUserProfile } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from '@tanstack/react-router';
import { Shield, Package, Users, DollarSign } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();
  const { data: products } = useGetProductCatalog();
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  useEffect(() => {
    if (!isAuthenticated || (!adminLoading && !isAdmin)) {
      navigate({ to: '/' });
    }
  }, [isAdmin, adminLoading, isAuthenticated, navigate]);

  const getProductName = (productId: string) => {
    const product = products?.find((p) => p.id === productId);
    return product?.name || 'Unknown';
  };

  const getProductPrice = (productId: string) => {
    const product = products?.find((p) => p.id === productId);
    return product ? Number(product.price) / 100 : 0;
  };

  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => {
    return sum + getProductPrice(order.productId) * Number(order.quantity);
  }, 0) || 0;
  const uniqueCustomers = new Set(orders?.map((o) => o.user.toString())).size;

  if (adminLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="container py-12">
      <div className="space-y-4 mb-12">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>
        <p className="text-lg text-muted-foreground">Manage and view all orders from customers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Logo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id.slice(0, 12)}...</TableCell>
                      <TableCell>
                        <UserCell userId={order.user} />
                      </TableCell>
                      <TableCell>{getProductName(order.productId)}</TableCell>
                      <TableCell>{order.quantity.toString()}</TableCell>
                      <TableCell className="font-semibold">
                        ${(getProductPrice(order.productId) * Number(order.quantity)).toFixed(2)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{order.deliveryDetails}</TableCell>
                      <TableCell>
                        <a
                          href={order.companyLogo.getDirectURL()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          View
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge>Placed</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No orders yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function UserCell({ userId }: { userId: any }) {
  const { data: profile } = useGetUserProfile(userId);
  
  if (profile) {
    return (
      <div className="space-y-0.5">
        <div className="font-medium">{profile.name}</div>
        <div className="text-xs text-muted-foreground">{profile.email}</div>
      </div>
    );
  }
  
  return <span className="font-mono text-xs">{userId.toString().slice(0, 12)}...</span>;
}
