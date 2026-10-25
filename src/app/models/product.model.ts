import { Variant, VariantRequest } from './variant.model';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  basePrice: number;
  categoryId: number | null;
  categoryName: string | null;
  variants: Variant[];
  imageUrl: string | null;
  images?: ProductImage[];   // ← لیست عکس‌ها با رنگ اختیاری
  price: number;   // ← لیست عکس‌ها با رنگ اختیاری
  // ← لیست عکس‌ها

}
export interface ProductImage {
  url: string;
  color: string | null;
}
export interface ProductRequest {
  name: string;
  description?: string | null;
  basePrice: number;
  categoryId: number;
  variants?: VariantRequest[];

}
