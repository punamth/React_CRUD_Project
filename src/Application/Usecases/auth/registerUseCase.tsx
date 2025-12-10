import type { IAuthRepository } from "../../../Domain/Repositories/IAuthRepository";

export function registerUseCase(authRepo: IAuthRepository) {
	return async (
		name: string,
		email: string,
		password: string,
		confirmPassword: string
	): Promise<void> => {
		try {
			if (!name || !email || !password || !confirmPassword) {
				throw new Error("All fields are required");
			}
			
			if (password !== confirmPassword) {
				throw new Error("Passwords do not match");
			}
			
			return await authRepo.register(name, email, password, confirmPassword);
		} catch (error) {
			console.error("Register use case error:", error);
			throw error;
		}
	};
}