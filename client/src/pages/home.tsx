import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ProductCard from "@/components/product/product-card";
import ProductTable from "@/components/product/product-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { PlusCircle, Link as LinkIcon, DollarSign, Bell } from "lucide-react";

export default function Home() {
  const { data: featuredProducts, isLoading: isFeaturedLoading } = useQuery<Product[]>({
    queryKey: ['/api/featured-products'],
  });
  
  const { data: recentProducts, isLoading: isRecentLoading } = useQuery<Product[]>({
    queryKey: ['/api/recently-tracked'],
  });
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-card rounded-xl p-6 md:flex items-center justify-between">
        <div className="space-y-4 md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Never miss a deal again</h1>
          <p className="text-muted-foreground">Track product prices from Amazon, Flipkart and more. Get notified when prices drop to your target.</p>
          <Button asChild>
            <Link href="/track">
              <PlusCircle className="h-4 w-4 mr-2" />
              Track New Product
            </Link>
          </Button>
        </div>
        <div className="hidden md:block md:w-2/5">
          <img 
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&h=300" 
            alt="Online shopping illustration" 
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      </section>
      
      {/* Track Product Form */}
      <section className="bg-card rounded-xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Track</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <input 
                type="text" 
                placeholder="Paste Amazon or Flipkart URL" 
                className="bg-background text-foreground rounded-lg pl-10 pr-4 py-2.5 w-full border border-input focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </div>
          </div>
          <Button className="w-full">Go to Track Page</Button>
        </div>
      </section>
      
      {/* Featured Deals Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">Featured Deals</h2>
          <Link href="/dashboard" className="text-primary hover:text-primary/80 transition text-sm font-medium">
            View All
          </Link>
        </div>
        
        {isFeaturedLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="flex justify-between mb-3">
                    <div>
                      <div className="h-3 bg-muted rounded w-16 mb-1"></div>
                      <div className="h-5 bg-muted rounded w-20"></div>
                    </div>
                    <div>
                      <div className="h-3 bg-muted rounded w-16 mb-1"></div>
                      <div className="h-5 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded w-full mb-1"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-8 bg-muted rounded w-8"></div>
                    <div className="h-8 bg-muted rounded w-8"></div>
                    <div className="h-8 bg-muted rounded w-24"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      
      {/* How It Works Section */}
      <section className="bg-card rounded-xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <LinkIcon className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Add Product URL</h3>
            <p className="text-muted-foreground text-sm">Paste the URL of any product from supported online stores.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <DollarSign className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Set Target Price</h3>
            <p className="text-muted-foreground text-sm">Tell us what price you're willing to pay for the product.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Bell className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Get Notified</h3>
            <p className="text-muted-foreground text-sm">Receive email alerts when the price drops to your target.</p>
          </div>
        </div>
      </section>
      
      {/* Recently Tracked Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">Recently Tracked</h2>
          <Link href="/dashboard" className="text-primary hover:text-primary/80 transition text-sm font-medium">
            View All
          </Link>
        </div>
        
        <ProductTable products={recentProducts || []} isLoading={isRecentLoading} />
      </section>
    </>
  );
}
