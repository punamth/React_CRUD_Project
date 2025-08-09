import type { IProductGroupRepository } from "../../../Domain/Repositories/IProductGroupRepository";
import type { ProductGroup } from "../../../Domain/Types/ProductGroup";

export function createProductGroup(repo: IProductGroupRepository) {
	return async (productGroup: Omit<ProductGroup, "id">, token: string): Promise<void> => {
		try {
			if (!productGroup.name) {
				throw new Error("Name is required");
			}
			await repo.create(productGroup, token);
		} catch (error) {
			console.error("Failed to create product group:", error);
			throw error;
		}
	};
} 