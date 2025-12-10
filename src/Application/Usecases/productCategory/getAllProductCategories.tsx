import type { IProductCategoryRepository } from "../../../Domain/Repositories/IProductCategoryRepository";
import type { ProductCategoryResponse } from "../../../Domain/Types/ProductCategoryResponse";

export function getAllProductCategories(repo: IProductCategoryRepository) {
	return async (token: string): Promise<ProductCategoryResponse[]> => {
		try {
			return await repo.getAll(token);
		} catch (error) {
			console.error("Failed to get all product categories:", error);
			throw error;
		}
	};
} 