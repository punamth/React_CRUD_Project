import type { ProductGroup } from "../Types/ProductGroup";
import type { ProductGroupResponse } from "../Types/ProductGroupResponse";

export interface IProductGroupRepository {
    getAll(token: string): Promise<ProductGroupResponse[]>;
    create(productGroup: Omit<ProductGroup, "id">, token: string): Promise<void>;
    update(productGroup: ProductGroup, token: string): Promise<void>;
    delete(id: number, token: string): Promise<void>;
} 