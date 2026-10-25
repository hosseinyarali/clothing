export interface Variant {
  id: number;
  size: string;
  color: string;
  stockQuantity: number;
  price: number | null;
  sku: string | null;
  stock: number;

}

export interface VariantRequest {
  size: string;
  color: string;
  stockQuantity: number;
  price?: number | null;
  sku?: string | null;
}
