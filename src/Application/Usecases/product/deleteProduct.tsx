import type { IProductRepository } from "../../../Domain/Repositories/IProductRepository";

export function deleteProduct(repo: IProductRepository) {
	return async (id: number): Promise<void> => {
		try {
			if (!id || id <= 0) {
				throw new Error("Valid product ID is required");
			}
			await repo.delete(id);
		} catch (error) {
			console.error("Failed to delete product:", error);
			throw error;
		}
	};
}