export interface AuthUser {
	id: number;
	username: string;
	email: string;
	token: string;
	createdAt?: Date;
} 