import type { AuthUser } from "../Types/AuthUser";

export interface IAuthRepository {
	login(email: string, password: string): Promise<AuthUser>;
	register(
		username: string,
		email:string,
		password: string,
		confirmPassword: string
	): Promise<void>;
	logout(): void;
}