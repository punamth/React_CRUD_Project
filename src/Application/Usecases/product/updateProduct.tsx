import type { IProductRepository } from "../../../Domain/Repositories/IProductRepository";
import type { Product } from "../../../Domain/Types/Product";

export function updateProduct(repo: IProductRepository) {
	return async (product: Product, token: string): Promise<void> => {
		try {
			await repo.update(product, token);
		} catch (error) {
			console.error("Failed to update product:", error);
			throw error;
		}
	};
}