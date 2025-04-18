import ProductForm from "@/components/product/product-form";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideShoppingBag, AlertCircle } from "lucide-react";

export default function TrackProduct() {
  return (
    <>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Track a New Product</h1>
        
        <ProductForm />
        
        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="supported-stores">
              <AccordionTrigger>
                <div className="flex items-center">
                  <LucideShoppingBag className="mr-2 h-5 w-5" />
                  <span>Supported Stores</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">Amazon</Badge>
                  <Badge variant="outline">Flipkart</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  We're continuously working to add more stores to our platform.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="tips">
              <AccordionTrigger>
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span>Tips for Better Tracking</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground mt-2">
                  <li>Set realistic target prices to increase your chances of receiving alerts</li>
                  <li>Make sure the product URL is from the product page, not a search or category page</li>
                  <li>For more accurate tracking, use the URL of the product's main page</li>
                  <li>Products with variations (color, size) will track the specific variation in the URL</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
              <div>
                <h3 className="font-semibold">Important Note</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Price tracking works by periodically checking the product page. Due to regional differences,
                  pricing changes, and store policies, the tracked price might occasionally differ from what you see.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
