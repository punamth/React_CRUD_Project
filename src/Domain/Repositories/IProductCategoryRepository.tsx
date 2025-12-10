import type { ProductCategory } from "../Types/ProductCategory";
import type { ProductCategoryResponse } from "../Types/ProductCategoryResponse";

export interface IProductCategoryRepository {
    getAll(token: string): Promise<ProductCategoryResponse[]>;
    create(product: Omit<ProductCategory, "id">, token: string): Promise<void>;
    update(product: ProductCategory, token: string): Promise<void>;
    delete(id: number, token: string): Promise<void>;
}