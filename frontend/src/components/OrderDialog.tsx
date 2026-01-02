import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePlaceOrder } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { Product } from '../backend';
import { Upload, X } from 'lucide-react';
import { ExternalBlob } from '../backend';
import { Progress } from '@/components/ui/progress';

interface OrderDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OrderDialog({ product, open, onOpenChange }: OrderDialogProps) {
  const [quantity, setQuantity] = useState('1');
  const [deliveryDetails, setDeliveryDetails] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const placeOrder = usePlaceOrder();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      toast.error('Please enter a valid quantity');
      return;
    }
    if (!deliveryDetails.trim()) {
      toast.error('Please enter delivery details');
      return;
    }
    if (!logoFile) {
      toast.error('Please upload your company logo');
      return;
    }

    try {
      const arrayBuffer = await logoFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const externalBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await placeOrder.mutateAsync({
        productId: product.id,
        quantity: BigInt(qty),
        deliveryDetails: deliveryDetails.trim(),
        companyLogo: externalBlob,
      });

      toast.success('Order placed successfully!');
      onOpenChange(false);
      setQuantity('1');
      setDeliveryDetails('');
      setLogoFile(null);
      setLogoPreview(null);
      setUploadProgress(0);
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  const handleClose = () => {
    if (!placeOrder.isPending) {
      onOpenChange(false);
      setQuantity('1');
      setDeliveryDetails('');
      setLogoFile(null);
      setLogoPreview(null);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Place Order - {product.name}</DialogTitle>
          <DialogDescription>
            Fill in the details below to order your customized {product.name.toLowerCase()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery">Delivery Details</Label>
            <Textarea
              id="delivery"
              placeholder="Enter your delivery address and contact information"
              value={deliveryDetails}
              onChange={(e) => setDeliveryDetails(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            {logoPreview ? (
              <div className="relative">
                <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center bg-muted/30">
                  <img src={logoPreview} alt="Logo preview" className="max-h-32 object-contain" />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setLogoFile(null);
                    setLogoPreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <label htmlFor="logo" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload your logo</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </label>
              </div>
            )}
          </div>
          {placeOrder.isPending && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <Label>Upload Progress</Label>
              <Progress value={uploadProgress} />
              <p className="text-xs text-muted-foreground text-center">{uploadProgress}%</p>
            </div>
          )}
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total:</span>
              <span className="text-2xl font-bold text-primary">
                ${((Number(product.price) / 100) * parseInt(quantity || '1')).toFixed(2)}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={placeOrder.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={placeOrder.isPending}>
              {placeOrder.isPending ? 'Placing Order...' : 'Place Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
