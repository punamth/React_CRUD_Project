export interface ProductResponse {
	id?: number;
	categoryId: number;
	categoryName?: string;
	name: string;
	sku: string;
	price: number;
	stockQuantity: number;
	description?: string;
	createdAt?: Date;
	imageUrl?: string | null;
	imageFileName?: string;
}