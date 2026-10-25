export interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

export interface CategoryRequest {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}
