export interface ProductCategory {
	id?: number;
	groupId: number;
	name: string;
	description?: string;
	createdAt?: Date;
	image?: File | null;
}