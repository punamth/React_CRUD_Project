export interface Product {
	id?: number;
	categoryId: number;
	name: string;
	sku: string;
	price: number;
	stockQuantity: number;
	description?: string;
	createdAt?: Date;
	image?: File | null;
	imageFileName?: string;
}