import type { IProductRepository } from "../../../Domain/Repositories/IProductRepository";
import type { ProductResponse } from "../../../Domain/Types/ProductResponse";

export function getAllProducts(repo: IProductRepository) {
	return async (token: string): Promise<ProductResponse[]> => {
		try {
			return await repo.getAll(token);
		} catch (error) {
			console.error("Failed to get all products:", error);
			throw error;
		}
	};
}