import type{ Product } from "../Types/Product";
import type{ ProductResponse } from "../Types/ProductResponse";
export interface IProductRepository {
	getAll(): Promise<ProductResponse[]>;
	create(product: Omit<Product, "id">): Promise<void>;
	update(product: Product): Promise<void>;
	delete(id: number): Promise<void>;
}