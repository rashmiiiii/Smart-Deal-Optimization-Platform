import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, ExternalLink } from "lucide-react";
import { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/products/${product.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/featured-products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recently-tracked'] });
      toast({
        title: "Product deleted",
        description: "The product has been removed from your tracking list",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  });
  
  const calculateSavings = () => {
    if (!product.originalPrice) return 0;
    return ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100;
  };
  
  const savings = calculateSavings();
  const savingsPercentage = savings.toFixed(0);

  const priceDifference = product.targetPrice - product.currentPrice;
  const isBelowTarget = priceDifference > 0;
  const isPerfectTarget = priceDifference === 0;
  
  return (
    <Card className="group overflow-hidden border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={product.imageUrl || "https://via.placeholder.com/500x300"}
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {product.isBestDeal && (
          <div className="absolute top-3 right-3 bg-amber-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            BEST DEAL
          </div>
        )}
        
        {savings > 0 && (
          <div className={`absolute bottom-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${
            savings > 25 ? "bg-green-500 text-white" : "bg-amber-500 text-black"
          }`}>
            -{savingsPercentage}%
          </div>
        )}
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-3">{product.name}</h3>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Price</p>
            <p className="text-xl font-bold text-foreground font-mono">${product.currentPrice.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Target Price</p>
            <p className={`text-lg font-medium font-mono ${isBelowTarget ? "line-through text-muted-foreground" : "text-foreground"}`}>
              ${product.targetPrice.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="mb-5">
          <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isBelowTarget ? "bg-green-500" : isPerfectTarget ? "bg-amber-500" : "bg-amber-500"
              }`}
              style={{ width: `${Math.min(100, isBelowTarget ? 100 : (product.currentPrice / product.targetPrice) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {isBelowTarget 
              ? `$${Math.abs(priceDifference).toFixed(2)} below your target price`
              : isPerfectTarget
                ? "Exactly at your target price"
                : `$${Math.abs(priceDifference).toFixed(2)} above your target price`
            }
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-muted/50"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => deleteProduct()}
              disabled={isDeleting}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            asChild
          >
            <a href={product.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Buy Now
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
