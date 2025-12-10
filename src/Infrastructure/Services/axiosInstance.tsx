import axios from "axios";

// Instead of a singleton, export a function to create an axios instance with the current token
export function createAxiosInstance(token?: string) {
	const instance = axios.create({
		baseURL: "https://localhost:5001/api",
	});

	instance.interceptors.request.use(
		(config) => {
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => Promise.reject(error)
	);

	return instance;
}