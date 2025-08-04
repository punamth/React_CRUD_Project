import axiosInstance from "../Services/axiosInstance";
import type { IProductCategoryRepository } from "../../Domain/Repositories/IProductCategoryRepository";
import type { ProductCategory } from "../../Domain/Types/ProductCategory";
import type { ProductCategoryResponse } from "../../Domain/Types/ProductCategoryResponse";
export class ProductCategoryRepository implements IProductCategoryRepository {
	async getAll(): Promise<ProductCategoryResponse[]> {
		try {
			const res = await axiosInstance.get("/ProductCategory");
			return res.data;
		} catch (error) {
			console.error("Failed to fetch product categories:", error);
			throw new Error("Failed to fetch product categories");
		}
	}
	
	async create(product: Omit<ProductCategory, "id">): Promise<void> {
		try {
			const createDto = {
				GroupId: product.groupId,
				Name: product.name,
				Description: product.description
			};
			await axiosInstance.post("/ProductCategory", createDto);
		} catch (error) {
			console.error("Failed to create product category:", error);
			throw new Error("Failed to create product category");
		}
	}
	
	async update(product: ProductCategory): Promise<void> {
		try {
			if (!product.id) {
				throw new Error("Product category ID is required for update");
			}
			
			const updateDto = {
				Name: product.name,
				Description: product.description
			};
			await axiosInstance.put(`/ProductCategory/${product.id}`, updateDto);
		} catch (error) {
			console.error("Failed to update product category:", error);
			throw new Error("Failed to update product category");
		}
	}
	
	async delete(id: number): Promise<void> {
		try {
			await axiosInstance.delete(`/ProductCategory/${id}`);
		} catch (error) {
			console.error("Failed to delete product category:", error);
			throw new Error("Failed to delete product category");
		}
	}
}