import axiosInstance from "../Services/axiosInstance";
import type { IProductRepository } from "../../Domain/Repositories/IProductRepository";
import type { Product } from "../../Domain/Types/Product";
import type { ProductResponse } from "../../Domain/Types/ProductResponse";

export class ProductRepository implements IProductRepository {
	async getAll(): Promise<ProductResponse[]> {
		try {
			const res = await axiosInstance.get("/Product");
			return res.data;
		} catch (error) {
			console.error("Failed to fetch products:", error);
			throw new Error("Failed to fetch products");
		}
	}
	
	async create(product: Omit<Product, "id">): Promise<void> {
		try {
			// Create product without image first
			const createDto = {
				CategoryId: product.categoryId,
				Name: product.name,
				Sku: product.sku,
				Price: product.price,
				StockQuantity: product.stockQuantity,
				Description: product.description
			};
			
			const response = await axiosInstance.post("/Product", createDto);
			
			// If image is provided, upload it separately using the dedicated endpoint
			if (product.image && response.data?.id) {
				await this.uploadImage(response.data.id, product.image);
			}
		} catch (error) {
			console.error("Failed to create product:", error);
			throw new Error("Failed to create product");
		}
	}


	
	async update(product: Product): Promise<void> {
		try {
			if (!product.id) {
				throw new Error("Product ID is required for update");
			}
			
			// Update product without image first
			const updateDto = {
				CategoryId: product.categoryId,
				Name: product.name,
				Sku: product.sku,
				Price: product.price,
				StockQuantity: product.stockQuantity,
				Description: product.description
			};
			
			await axiosInstance.put(`/Product/${product.id}`, updateDto);
			
			// If image is provided, upload it separately using the dedicated endpoint
			if (product.image) {
				await this.uploadImage(product.id, product.image);
			}
		} catch (error) {
			console.error("Failed to update product:", error);
			throw new Error("Failed to update product");
		}
	}


	
	async delete(id: number): Promise<void> {
		try {
			await axiosInstance.delete(`/Product/${id}`);
		} catch (error) {
			console.error("Failed to delete product:", error);
			throw new Error("Failed to delete product");
		}
	}
	
	async uploadImage(productId: number, image: File): Promise<string> {
		try {
			const formData = new FormData();
			formData.append("image", image);
			
			const res = await axiosInstance.post(`/Product/${productId}/upload-image`, formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});
			
			return res.data.imageUrl;
		} catch (error) {
			console.error("Failed to upload product image:", error);
			throw new Error("Failed to upload product image");
		}
	}
}