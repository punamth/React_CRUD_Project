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
				id: 0, // Will be set from token if needed
				username: email, // Using email as username for now
				email: email,
				token: data.token,
				createdAt: undefined
			};
			
			localStorage.setItem("token", data.token);
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
				Username: name, // Backend expects Username field
				Email: email,
				Password: password,
			});
		} catch (error) {
			console.error("Registration failed:", error);
			throw new Error("Registration failed. Please try again.");
		}
	}
	logout(): void {
		localStorage.removeItem("token");
	}
}