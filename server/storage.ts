import { 
  users, type User, type InsertUser, 
  products, type Product, type InsertProduct, type UpdateProduct 
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProductsByUserId(userId: number): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: UpdateProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Featured and best deals
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getRecentlyTrackedProducts(limit?: number): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private userId: number;
  private productId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.userId = 1;
    this.productId = 1;
    
    // Add some initial products for demonstration
    this.seedProducts();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductsByUserId(userId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.userId === userId,
    );
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const now = new Date();
    const product: Product = { 
      ...insertProduct, 
      id, 
      lastUpdated: now,
      createdAt: now,
      isBestDeal: false
    };
    this.products.set(id, product);
    this.updateBestDeals();
    return product;
  }
  
  async updateProduct(id: number, productData: UpdateProduct): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { 
      ...product, 
      ...productData,
      lastUpdated: new Date() 
    };
    this.products.set(id, updatedProduct);
    this.updateBestDeals();
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const deleted = this.products.delete(id);
    if (deleted) {
      this.updateBestDeals();
    }
    return deleted;
  }
  
  // Featured and recent products
  async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    return Array.from(this.products.values())
      .sort((a, b) => {
        // Sort by best deal first, then by largest discount percentage
        if (a.isBestDeal && !b.isBestDeal) return -1;
        if (!a.isBestDeal && b.isBestDeal) return 1;
        
        const aDiscount = a.originalPrice ? (a.originalPrice - a.currentPrice) / a.originalPrice : 0;
        const bDiscount = b.originalPrice ? (b.originalPrice - b.currentPrice) / b.originalPrice : 0;
        
        return bDiscount - aDiscount;
      })
      .slice(0, limit);
  }
  
  async getRecentlyTrackedProducts(limit: number = 5): Promise<Product[]> {
    return Array.from(this.products.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  
  // Helper methods
  private updateBestDeals(): void {
    // Group products by name (assuming similar products across stores)
    const productGroups = new Map<string, Product[]>();
    
    Array.from(this.products.values()).forEach(product => {
      const key = product.name.toLowerCase();
      const group = productGroups.get(key) || [];
      group.push(product);
      productGroups.set(key, group);
    });
    
    // Reset all best deals
    Array.from(this.products.values()).forEach(product => {
      const p = this.products.get(product.id);
      if (p) {
        p.isBestDeal = false;
        this.products.set(p.id, p);
      }
    });
    
    // For each group, find the product with the lowest price and mark as best deal
    productGroups.forEach(group => {
      if (group.length > 1) {
        const bestDeal = group.reduce((best, current) => 
          current.currentPrice < best.currentPrice ? current : best
        );
        
        const p = this.products.get(bestDeal.id);
        if (p) {
          p.isBestDeal = true;
          this.products.set(p.id, p);
        }
      }
    });
  }
  
  private seedProducts(): void {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Premium Wireless Headphones",
        url: "https://www.amazon.com/headphones/premium",
        imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
        store: "Amazon",
        currentPrice: 129.99,
        targetPrice: 199.99,
        originalPrice: 199.99,
        userId: 1
      },
      {
        name: "Ultra Slim Laptop",
        url: "https://www.flipkart.com/laptop/ultraslim",
        imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6",
        store: "Flipkart",
        currentPrice: 849.99,
        targetPrice: 799.99,
        originalPrice: 999.99,
        userId: 1
      },
      {
        name: "Smart Watch Series 7",
        url: "https://www.amazon.com/smartwatch/series7",
        imageUrl: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2",
        store: "Amazon",
        currentPrice: 299.99,
        targetPrice: 349.99,
        originalPrice: 399.99,
        userId: 1
      },
      {
        name: "Smartphone Pro Max",
        url: "https://www.flipkart.com/smartphone/promax",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        store: "Flipkart",
        currentPrice: 999.99,
        targetPrice: 899.99,
        originalPrice: 1099.99,
        userId: 1
      },
      {
        name: "Wireless Earbuds",
        url: "https://www.amazon.com/earbuds/wireless",
        imageUrl: "https://images.unsplash.com/photo-1605464315542-bda3e2f4e605",
        store: "Amazon",
        currentPrice: 79.99,
        targetPrice: 69.99,
        originalPrice: 99.99,
        userId: 1
      },
      {
        name: "4K Smart TV",
        url: "https://www.flipkart.com/tv/4ksmart",
        imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
        store: "Flipkart",
        currentPrice: 499.99,
        targetPrice: 449.99,
        originalPrice: 599.99,
        userId: 1
      }
    ];
    
    sampleProducts.forEach(product => {
      const id = this.productId++;
      const now = new Date();
      const p: Product = {
        ...product,
        id,
        lastUpdated: now,
        createdAt: now,
        isBestDeal: false
      };
      this.products.set(id, p);
    });
    
    this.updateBestDeals();
  }
}

export const storage = new MemStorage();
