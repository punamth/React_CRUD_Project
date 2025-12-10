import type { IProductGroupRepository } from "../../../Domain/Repositories/IProductGroupRepository";

export function deleteProductGroup(repo: IProductGroupRepository) {
	return async (id: number, token: string): Promise<void> => {
		try {
			if (!id || id <= 0) {
				throw new Error("Valid product group ID is required");
			}
			await repo.delete(id, token);
		} catch (error) {
			console.error("Failed to delete product group:", error);
			throw error;
		}
	};
} 