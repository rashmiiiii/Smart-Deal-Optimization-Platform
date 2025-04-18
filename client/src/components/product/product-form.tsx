import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, Link } from "lucide-react";
import { insertProductSchema } from "@shared/schema";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  targetPrice: z.coerce.number().positive("Target price must be positive")
});

type FormData = z.infer<typeof formSchema>;

export default function ProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      targetPrice: 0
    }
  });

  const { mutate: scrapeUrl, isPending: isScraping } = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest('POST', '/api/scrape-url', { url });
      return response.json();
    }
  });

  const { mutate: saveProduct, isPending: isSaving } = useMutation({
    mutationFn: async (productData: any) => {
      const response = await apiRequest('POST', '/api/products', productData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/featured-products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recently-tracked'] });
      
      form.reset();
      setIsLoading(false);
      
      toast({
        title: "Success!",
        description: "Product is now being tracked",
      });
    },
    onError: () => {
      setError("Failed to save product");
      setIsLoading(false);
    }
  });

  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    setError(null);
    
    scrapeUrl(data.url, {
      onSuccess: (scrapedData) => {
        // Combine form data with scraped data
        const productData = {
          ...scrapedData,
          targetPrice: data.targetPrice,
          userId: 1 // In a real app, this would be the authenticated user's ID
        };
        
        saveProduct(productData);
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : "Failed to scrape URL");
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="bg-card rounded-xl p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Track a Product</h2>
      
      {error && (
        <div className="bg-destructive/15 border border-destructive text-destructive p-3 rounded-md mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product URL</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      placeholder="Paste Amazon or Flipkart URL" 
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="targetPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      type="number"
                      placeholder="Enter your desired price" 
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-center space-x-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Processing..." : "Start Tracking"}
            </Button>
            
            <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
