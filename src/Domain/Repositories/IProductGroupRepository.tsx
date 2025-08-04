import type { ProductGroup } from "../Types/ProductGroup";
import type { ProductGroupResponse } from "../Types/ProductGroupResponse";

export interface IProductGroupRepository {
	getAll(): Promise<ProductGroupResponse[]>;
	create(productGroup: Omit<ProductGroup, "id">): Promise<void>;
	update(productGroup: ProductGroup): Promise<void>;
	delete(id: number): Promise<void>;
} 