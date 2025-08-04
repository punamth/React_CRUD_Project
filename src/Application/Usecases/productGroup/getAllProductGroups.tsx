import type { IProductGroupRepository } from "../../../Domain/Repositories/IProductGroupRepository";
import type { ProductGroupResponse } from "../../../Domain/Types/ProductGroupResponse";

export function getAllProductGroups(repo: IProductGroupRepository) {
	return async (): Promise<ProductGroupResponse[]> => {
		try {
			return await repo.getAll();
		} catch (error) {
			console.error("Failed to get all product groups:", error);
			throw error;
		}
	};
} 