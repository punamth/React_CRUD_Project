import { createContext, useContext, useEffect, useState } from "react";
import { AuthRepository } from "../../../Infrastructure/Repositories/AuthRepository";
import { loginUseCase } from "../../../Application/Usecases/auth/loginUseCase";
import { registerUseCase } from "../../../Application/Usecases/auth/registerUseCase";
import type { AuthUser } from "../../../Domain/Types/AuthUser";

interface AuthContextType {
	user: AuthUser | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (
		name: string,
		email: string,
		password: string,
		confirmPassword: string
	) => Promise<void>;
	logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authRepo = new AuthRepository();
const loginUC = loginUseCase(authRepo);
const registerUc = registerUseCase(authRepo);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token")
	);
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setToken(token);
			// Optionally fetch user data from token/localStorage
		}
	}, []);

	const login = async (email: string, password: string) => {
		try {
			const authUser = await loginUC(email, password);
			console.log("Auth user:", authUser);
			setToken(authUser.token);
			setUser(authUser);
			localStorage.setItem("token", authUser.token); // Keep in sync for persistence
		} catch (error) {
			console.error("Login error:", error);
			throw error; // Re-throw to let components handle it
		}
	};
	
	const register = async (
		name: string,
		email: string,
		password: string,
		confirmPassword: string
	) => {
		try {
			console.log("inside auth ");
			await registerUc(name, email, password, confirmPassword);
		} catch (error) {
			console.error("Register error:", error);
			throw error; // Re-throw to let components handle it
		}
	};
	const logout = () => {
		localStorage.removeItem("token"); // Remove from storage
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};