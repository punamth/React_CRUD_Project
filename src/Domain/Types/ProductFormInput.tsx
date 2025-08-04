export interface ProductFormInput {
	categoryId: number;
	name: string;
	sku: string;
	price: number;
	stockQuantity: number;
	description?: string;
	image?: File | null;
}