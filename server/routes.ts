import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  scrapeUrlSchema,
  updateProductSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

function extractStoreFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    if (hostname.includes('amazon')) return 'Amazon';
    if (hostname.includes('flipkart')) return 'Flipkart';
    return 'Other';
  } catch (error) {
    return 'Unknown';
  }
}

// Function to simulate scraping product data
// In a real app, this would use a library like cheerio
async function scrapeProductData(url: string) {
  // Validate URL
  try {
    const parsedUrl = new URL(url);
    const isValidStore = ['amazon', 'flipkart'].some(store => 
      parsedUrl.hostname.includes(store));
    
    if (!isValidStore) {
      throw new Error("URL is not from a supported store");
    }
    
    // Simulate network delay for scraping
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate random product data based on URL
    // In a real app, this would extract actual product data
    const store = extractStoreFromUrl(url);
    const productId = Math.floor(Math.random() * 1000000);
    const price = Math.floor(Math.random() * 500) + 100;
    const originalPrice = price + Math.floor(Math.random() * 200);
    
    // Product name based on URL path
    const pathSegments = parsedUrl.pathname.split('/').filter(s => s.length > 0);
    let productName = pathSegments.length > 0 
      ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ')
      : "Product " + productId;
    
    // Capitalize words
    productName = productName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Get a random product image from Unsplash
    const imageCategories = [
      'tech', 'electronics', 'gadget', 'computer', 'headphones', 'watch'
    ];
    const randomCategory = imageCategories[Math.floor(Math.random() * imageCategories.length)];
    const imageUrl = `https://source.unsplash.com/random/300x300/?${randomCategory}`;
    
    return {
      name: productName,
      url,
      store,
      currentPrice: price,
      originalPrice,
      imageUrl
    };
  } catch (error) {
    throw new Error("Failed to scrape product data");
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // Product Routes
  router.get('/products', async (req: Request, res: Response) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  router.get('/products/:id', async (req: Request, res: Response) => {
    try {
      const product = await storage.getProductById(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  router.post('/products', async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  
  router.patch('/products/:id', async (req: Request, res: Response) => {
    try {
      const productData = updateProductSchema.parse(req.body);
      const updatedProduct = await storage.updateProduct(Number(req.params.id), productData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  
  router.delete('/products/:id', async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteProduct(Number(req.params.id));
      
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  
  // Featured and Recently Tracked Products
  router.get('/featured-products', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 3;
      const featuredProducts = await storage.getFeaturedProducts(limit);
      res.json(featuredProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });
  
  router.get('/recently-tracked', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 5;
      const recentProducts = await storage.getRecentlyTrackedProducts(limit);
      res.json(recentProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recently tracked products" });
    }
  });
  
  // URL Scraping endpoint
  router.post('/scrape-url', async (req: Request, res: Response) => {
    try {
      const { url } = scrapeUrlSchema.parse(req.body);
      const scrapedData = await scrapeProductData(url);
      res.json(scrapedData);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to scrape URL";
      res.status(400).json({ message });
    }
  });
  
  // Notification preferences
  router.post('/notification-preferences', async (req: Request, res: Response) => {
    try {
      const { email, receiveInstantAlerts, receiveDailyDigest } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // In a real app, this would save to a real user account
      // For now, just return success response
      res.json({ 
        success: true, 
        message: "Notification preferences saved" 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to save notification preferences" });
    }
  });
  
  // Register routes with /api prefix
  app.use('/api', router);

  app.get('*', (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'development') {
      res.sendFile('index.html', { root: './client' });
    } else {
      res.sendFile('index.html', { root: './client/dist' });
    }
  });

  
  const httpServer = createServer(app);
  
  return httpServer;
}
