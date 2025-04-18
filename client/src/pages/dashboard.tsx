import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product/product-card";
import ProductTable from "@/components/product/product-table";
import { Product } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3X3, List } from "lucide-react";

export default function Dashboard() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.store.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-foreground">Your Product Dashboard</h1>
        
        <div className="flex space-x-2">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input 
              type="text"
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="hidden md:flex border border-input rounded-md">
            <Button 
              variant={view === "grid" ? "default" : "ghost"} 
              size="icon"
              onClick={() => setView("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={view === "list" ? "default" : "ghost"} 
              size="icon"
              onClick={() => setView("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="below-target">Below Target</TabsTrigger>
          <TabsTrigger value="above-target">Above Target</TabsTrigger>
          <TabsTrigger value="best-deals">Best Deals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="w-full bg-card rounded-xl border border-border p-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredProducts?.length === 0 ? (
            <div className="w-full bg-card rounded-xl border border-border p-8 text-center">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts?.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <ProductTable products={filteredProducts || []} />
          )}
        </TabsContent>
        
        <TabsContent value="below-target" className="space-y-4">
          {isLoading ? (
            <div className="w-full bg-card rounded-xl border border-border p-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts?.filter(product => product.currentPrice < product.targetPrice)
                .map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          ) : (
            <ProductTable 
              products={filteredProducts?.filter(product => product.currentPrice < product.targetPrice) || []}
            />
          )}
        </TabsContent>
        
        <TabsContent value="above-target" className="space-y-4">
          {isLoading ? (
            <div className="w-full bg-card rounded-xl border border-border p-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts?.filter(product => product.currentPrice >= product.targetPrice)
                .map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          ) : (
            <ProductTable 
              products={filteredProducts?.filter(product => product.currentPrice >= product.targetPrice) || []}
            />
          )}
        </TabsContent>
        
        <TabsContent value="best-deals" className="space-y-4">
          {isLoading ? (
            <div className="w-full bg-card rounded-xl border border-border p-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts?.filter(product => product.isBestDeal)
                .map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          ) : (
            <ProductTable 
              products={filteredProducts?.filter(product => product.isBestDeal) || []}
            />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
