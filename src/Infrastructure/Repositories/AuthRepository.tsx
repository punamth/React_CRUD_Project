import axios from "axios";
import type { IAuthRepository } from "../../Domain/Repositories/IAuthRepository";
import type { AuthUser } from "../../Domain/Types/AuthUser";

export class AuthRepository implements IAuthRepository {
	async login(email: string, password: string): Promise<AuthUser> {
		try {
			const res = await axios.post("https://localhost:5001/api/Auth/login", {
				Username: email, // Backend expects Username field
				Password: password,
			});
			const data = res.data;
			// Backend currently only returns { token }, so we create AuthUser with available data
			const authUser: AuthUser = {
				id: 0, 
				username: email, 
				email: email,
				token: data.token,
				createdAt: undefined
			};
			return authUser;
		} catch (error) {
			console.error("Login failed:", error);
			throw new Error("Login failed. Please check your credentials.");
		}
	}
	async register(
		name: string,
		email: string,
		password: string,
		confirmPassword: string
	): Promise<void> {
		try {
			console.log({ name, email, password, confirmPassword });
			await axios.post("https://localhost:5001/api/Auth/register", {
				Username: name, 
				Email: email,
				Password: password,
			});
		} catch (error) {
			console.error("Registration failed:", error);
			throw new Error("Registration failed. Please try again.");
		}
	}
	logout(): void {
		// No localStorage operation here. Context will handle token removal.
	}
}