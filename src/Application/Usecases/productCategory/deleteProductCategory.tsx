import type { IProductCategoryRepository } from "../../../Domain/Repositories/IProductCategoryRepository";

export function deleteProductCategory(repo: IProductCategoryRepository) {
	return async (id: number): Promise<void> => {
		try {
			if (!id || id <= 0) {
				throw new Error("Valid product category ID is required");
			}
			await repo.delete(id);
		} catch (error) {
			console.error("Failed to delete product category:", error);
			throw error;
		}
	};
} 