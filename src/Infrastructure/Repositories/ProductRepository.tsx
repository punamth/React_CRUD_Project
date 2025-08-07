import { createAxiosInstance } from "../Services/axiosInstance";
import type { IProductRepository } from "../../Domain/Repositories/IProductRepository";
import type { Product } from "../../Domain/Types/Product";
import type { ProductResponse } from "../../Domain/Types/ProductResponse";

export class ProductRepository implements IProductRepository {
	async getAll(token: string): Promise<ProductResponse[]> {
		try {
			const axios = createAxiosInstance(token);
			const res = await axios.get("/Product");
			return res.data;
		} catch (error) {
			console.error("Failed to fetch products:", error);
			throw new Error("Failed to fetch products");
		}
	}
	
	async create(product: Omit<Product, "id">, token: string): Promise<void> {
		try {
			const axios = createAxiosInstance(token);
			// Create product without image first
			const createDto = {
				CategoryId: product.categoryId,
				Name: product.name,
				Sku: product.sku,
				Price: product.price,
				StockQuantity: product.stockQuantity,
				Description: product.description
			};
			const response = await axios.post("/Product", createDto);
			// If image is provided, upload it separately using the dedicated endpoint
			if (product.image && response.data?.id) {
				await this.uploadImage(response.data.id, product.image, token);
			}
		} catch (error) {
			console.error("Failed to create product:", error);
			throw new Error("Failed to create product");
		}
	}

	async update(product: Product, token: string): Promise<void> {
		try {
			const axios = createAxiosInstance(token);
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
			await axios.put(`/Product/${product.id}`, updateDto);
			// If image is provided, upload it separately using the dedicated endpoint
			if (product.image) {
				await this.uploadImage(product.id, product.image, token);
			}
		} catch (error) {
			console.error("Failed to update product:", error);
			throw new Error("Failed to update product");
		}
	}

	async delete(id: number, token: string): Promise<void> {
		try {
			const axios = createAxiosInstance(token);
			await axios.delete(`/Product/${id}`);
		} catch (error) {
			console.error("Failed to delete product:", error);
			throw new Error("Failed to delete product");
		}
	}

	async uploadImage(productId: number, image: File, token: string): Promise<string> {
		try {
			const axios = createAxiosInstance(token);
			const formData = new FormData();
			formData.append("image", image);
			const res = await axios.post(`/Product/${productId}/upload-image`, formData, {
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