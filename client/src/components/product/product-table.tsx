import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductTable({ products, isLoading }: ProductTableProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/products/${id}`);
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
  
  if (isLoading) {
    return (
      <div className="w-full bg-card rounded-xl border border-border p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="w-full bg-card rounded-xl border border-border p-8 text-center">
        <p className="text-muted-foreground">No tracked products found</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table className="w-full bg-card rounded-xl border border-border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Product</TableHead>
            <TableHead className="text-left">Current Price</TableHead>
            <TableHead className="text-left">Target Price</TableHead>
            <TableHead className="text-left">Status</TableHead>
            <TableHead className="text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const priceDifference = product.targetPrice - product.currentPrice;
            const isBelowTarget = priceDifference > 0;
            
            return (
              <TableRow key={product.id}>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded object-cover" 
                        src={product.imageUrl || "https://via.placeholder.com/100"} 
                        alt={product.name} 
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.store}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="text-sm font-mono">${product.currentPrice.toFixed(2)}</div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="text-sm text-muted-foreground font-mono">${product.targetPrice.toFixed(2)}</div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant={isBelowTarget ? "success" : "warning"}>
                    {isBelowTarget ? "Below Target" : "Above Target"}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={product.url} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
