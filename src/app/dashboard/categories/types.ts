export interface Category {
  id: string;
  name: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface CreateCategoryPayload {
  name: string;
  icon?: File;
}

export interface UpdateCategoryPayload {
  name: string;
  icon?: File;
}
