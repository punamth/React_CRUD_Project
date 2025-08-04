import type{ ProductCategory } from "../Types/ProductCategory";
import type{ ProductCategoryResponse } from "../Types/ProductCategoryResponse";
export interface IProductCategoryRepository {
	getAll(): Promise<ProductCategoryResponse[]>;
	create(product: Omit<ProductCategory, "id">): Promise<void>;
	update(product: ProductCategory): Promise<void>;
	delete(id: number): Promise<void>;
}