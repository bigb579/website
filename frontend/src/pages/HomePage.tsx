import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { Package, Truck, Award, Mail, Phone, MapPin } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Premium Corporate Gifts for Your Brand
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Elevate your brand with customized corporate gifts. From mugs to apparel, we help you make a lasting
                impression with high-quality branded merchandise.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate({ to: '/products' })}>
                  Browse Products
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/products' })}>
                  Get Started
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/assets/generated/company-hero.dim_800x600.jpg"
                alt="Corporate gifts showcase"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose BrandGifts?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide end-to-end solutions for all your corporate gifting needs
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Custom Branding</h3>
              <p className="text-muted-foreground">
                Upload your company logo and we'll print it on high-quality products that represent your brand
                perfectly.
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Quick turnaround times and reliable shipping ensure your branded gifts arrive when you need them.
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Premium Quality</h3>
              <p className="text-muted-foreground">
                We source only the best materials to ensure your corporate gifts leave a lasting positive impression.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Image Section */}
      <section className="bg-muted/30 py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
              <img
                src="/assets/generated/services-image.dim_600x400.jpg"
                alt="Our services"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Comprehensive Gifting Solutions</h2>
              <p className="text-lg text-muted-foreground">
                From small startups to large enterprises, we handle orders of all sizes with the same attention to
                detail and commitment to quality.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground">Easy online ordering with secure authentication</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground">Simple logo upload and customization process</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground">Track your orders from placement to delivery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? Our team is here to help you find the perfect corporate gifts
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 space-y-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground">contact@corporategifts.com</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Location</h3>
              <p className="text-sm text-muted-foreground">San Francisco, CA</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
