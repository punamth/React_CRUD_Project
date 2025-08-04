import type { IAuthRepository } from "../../../Domain/Repositories/IAuthRepository";
import type { AuthUser } from "../../../Domain/Types/AuthUser";

export function loginUseCase(authRepo: IAuthRepository) {
	return async (email: string, password: string): Promise<AuthUser> => {
		try {
			if (!email || !password) {
				throw new Error("Email and password are required");
			}
			
			return await authRepo.login(email, password);
		} catch (error) {
			console.error("Login use case error:", error);
			throw error;
		}
	};
}