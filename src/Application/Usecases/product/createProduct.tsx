import type { IProductRepository } from "../../../Domain/Repositories/IProductRepository";
import type { Product } from "../../../Domain/Types/Product";

export function createProduct(repo: IProductRepository) {
	return async (product: Omit<Product, "id">): Promise<void> => {
		try {
			if (!product.name || !product.sku || product.price <= 0 || product.stockQuantity < 0) {
				throw new Error("Invalid product data");
			}
			
					await repo.create(product);
		} catch (error) {
			console.error("Failed to create product:", error);
			throw error;
		}
	};
}