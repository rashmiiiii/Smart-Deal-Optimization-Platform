import { Product } from "@shared/schema";

export function calculateSavings(product: Product): number {
  if (!product.originalPrice) return 0;
  return ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100;
}

export function getDiscountLabel(savingsPercentage: number): string {
  return `-${Math.round(savingsPercentage)}%`;
}

export function isPriceBelowTarget(product: Product): boolean {
  return product.currentPrice < product.targetPrice;
}

export function getPriceDifference(product: Product): number {
  return product.targetPrice - product.currentPrice;
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function getStatusLabel(product: Product): string {
  const priceDiff = getPriceDifference(product);
  if (priceDiff > 0) return "Below Target";
  if (priceDiff < 0) return "Above Target";
  return "At Target";
}

export function getStatusVariant(product: Product): "success" | "warning" | "default" {
  const priceDiff = getPriceDifference(product);
  if (priceDiff > 0) return "success";
  if (priceDiff < 0) return "warning";
  return "default";
}

export function extractStoreFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    if (hostname.includes('amazon')) return 'Amazon';
    if (hostname.includes('flipkart')) return 'Flipkart';
    return 'Other';
  } catch (error) {
    return 'Unknown';
  }
}
