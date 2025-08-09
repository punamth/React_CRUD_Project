import type { IProductCategoryRepository } from "../../../Domain/Repositories/IProductCategoryRepository";
import type { ProductCategory } from "../../../Domain/Types/ProductCategory";

export function createProductCategory(repo: IProductCategoryRepository) {
	return async (productCategory: Omit<ProductCategory, "id">, token: string): Promise<void> => {
		try {
			if (!productCategory.name || !productCategory.groupId) {
				throw new Error("Name and group ID are required");
			}
			await repo.create(productCategory, token);
		} catch (error) {
			console.error("Failed to create product category:", error);
			throw error;
		}
	};
} 