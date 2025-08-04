import type { IProductRepository } from "../../../Domain/Repositories/IProductRepository";
import type { Product } from "../../../Domain/Types/Product";

export function updateProduct(repo: IProductRepository) {
	return async (product: Product): Promise<void> => {
		try {
			if (!product.id || !product.name || !product.sku || product.price <= 0 || product.stockQuantity < 0) {
				throw new Error("Invalid product data for update");
			}
			
					await repo.update(product);
		} catch (error) {
			console.error("Failed to update product:", error);
			throw error;
		}
	};
}