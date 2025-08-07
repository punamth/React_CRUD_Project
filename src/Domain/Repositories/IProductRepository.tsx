import type{ Product } from "../Types/Product";
import type{ ProductResponse } from "../Types/ProductResponse";
export interface IProductRepository {
	getAll(token: string): Promise<ProductResponse[]>;
	create(product: Omit<Product, "id">, token: string): Promise<void>;
	update(product: Product, token: string): Promise<void>;
	delete(id: number, token: string): Promise<void>;
}