import type { IProductGroupRepository } from "../../../Domain/Repositories/IProductGroupRepository";
import type { ProductGroup } from "../../../Domain/Types/ProductGroup";

export function updateProductGroup(repo: IProductGroupRepository) {
	return async (productGroup: ProductGroup, token: string): Promise<void> => {
		try {
			if (!productGroup.id || !productGroup.name) {
				throw new Error("ID and name are required for update");
			}
			await repo.update(productGroup, token);
		} catch (error) {
			console.error("Failed to update product group:", error);
			throw error;
		}
	};
} 