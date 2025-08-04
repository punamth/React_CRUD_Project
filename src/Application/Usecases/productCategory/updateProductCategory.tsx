import type { IProductCategoryRepository } from "../../../Domain/Repositories/IProductCategoryRepository";
import type { ProductCategory } from "../../../Domain/Types/ProductCategory";

export function updateProductCategory(repo: IProductCategoryRepository) {
	return async (productCategory: ProductCategory): Promise<void> => {
		try {
			if (!productCategory.id || !productCategory.name) {
				throw new Error("ID and name are required for update");
			}
			await repo.update(productCategory);
		} catch (error) {
			console.error("Failed to update product category:", error);
			throw error;
		}
	};
} 