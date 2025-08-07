import { createAxiosInstance } from "../Services/axiosInstance";
import type { IProductGroupRepository } from "../../Domain/Repositories/IProductGroupRepository";
import type { ProductGroup } from "../../Domain/Types/ProductGroup";
import type { ProductGroupResponse } from "../../Domain/Types/ProductGroupResponse";

export class ProductGroupRepository implements IProductGroupRepository {
    async getAll(token: string): Promise<ProductGroupResponse[]> {
        try {
            const axios = createAxiosInstance(token);
            const res = await axios.get("/ProductGroup");
            return res.data;
        } catch (error) {
            console.error("Failed to fetch product groups:", error);
            throw new Error("Failed to fetch product groups");
        }
    }

    async create(productGroup: Omit<ProductGroup, "id">, token: string): Promise<void> {
        try {
            const axios = createAxiosInstance(token);
            const createDto = {
                Name: productGroup.name,
                Description: productGroup.description
            };
            await axios.post("/ProductGroup", createDto);
        } catch (error) {
            console.error("Failed to create product group:", error);
            throw new Error("Failed to create product group");
        }
    }

    async update(productGroup: ProductGroup, token: string): Promise<void> {
        try {
            const axios = createAxiosInstance(token);
            if (!productGroup.id) {
                throw new Error("Product group ID is required for update");
            }
            const updateDto = {
                Name: productGroup.name,
                Description: productGroup.description
            };
            await axios.put(`/ProductGroup/${productGroup.id}`, updateDto);
        } catch (error) {
            console.error("Failed to update product group:", error);
            throw new Error("Failed to update product group");
        }
    }

    async delete(id: number, token: string): Promise<void> {
        try {
            const axios = createAxiosInstance(token);
            await axios.delete(`/ProductGroup/${id}`);
        } catch (error) {
            console.error("Failed to delete product group:", error);
            throw new Error("Failed to delete product group");
        }
    }
} 