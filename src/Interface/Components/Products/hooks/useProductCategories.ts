import { useState, useEffect } from 'react';
import type { ProductCategoryResponse } from "../../../../Domain/Types/ProductCategoryResponse";
import { ProductCategoryRepository } from "../../../../Infrastructure/Repositories/ProductCategoryRepository";
import { getAllProductCategories } from "../../../../Application/Usecases/productCategory/getAllProductCategories";

const categoryRepo = new ProductCategoryRepository();
const getAllCategories = getAllProductCategories(categoryRepo);

interface UseProductCategoriesProps {
	token: string | null;
}

export const useProductCategories = ({ token }: UseProductCategoriesProps) => {
	const [categories, setCategories] = useState<ProductCategoryResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCategories = async () => {
			if (!token) {
				setError("No authentication token available");
				setLoading(false);
				return;
			}
			
			try {
				setLoading(true);
				setError(null);
				const data = await getAllCategories(token);
				setCategories(data);
			} catch (error) {
				console.error("Failed to load categories:", error);
				setError("Failed to load categories");
			} finally {
				setLoading(false);
			}
		};
		
		if (token) {
			fetchCategories();
		}
	}, [token]);

	const getCategoryName = (categoryId: number): string => {
		const category = categories.find(cat => cat.id === categoryId);
		return category ? category.name : `Category ${categoryId}`;
	};

	return {
		categories,
		loading,
		error,
		getCategoryName
	};
}; 