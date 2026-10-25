export interface CartItem {
  variantId: number;      // شناسه یکتای آیتم (variant.id یا در نبود variant، product.id)
  productId: number;
  name: string;
  imageUrl: string | null;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
  maxStock: number;
}
