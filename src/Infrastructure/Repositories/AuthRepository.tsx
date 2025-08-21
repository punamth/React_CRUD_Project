import axios from "axios";
import type { IAuthRepository } from "../../Domain/Repositories/IAuthRepository";
import type { AuthUser } from "../../Domain/Types/AuthUser";

export class AuthRepository implements IAuthRepository {
	async login(username: string, password: string): Promise<AuthUser> {
		try {
			const res = await axios.post("https://localhost:5001/api/Auth/login", {
				Username: username,
				Password: password,
			});

			const data = res.data;

			// Build AuthUser object
			const authUser: AuthUser = {
				id: 0, // Placeholder until backend sends actual ID
				username: username,
				email: "", // Not using email login
				token: data.token,
				createdAt: undefined,
			};

			return authUser; // Context will store it
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
			if (password !== confirmPassword) {
				throw new Error("Passwords do not match.");
			}

			await axios.post("https://localhost:5001/api/Auth/register", {
				Username: name,
				Email: email,
				Password: password,
				ConfirmPassword: confirmPassword,
			});
		} catch (error) {
			console.error("Registration failed:", error);
			throw new Error("Registration failed. Please try again.");
		}
	}

	logout(): void {
		// No localStorage clearing here — Context will handle it
	}
}
