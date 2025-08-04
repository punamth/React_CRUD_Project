import { useState, useEffect } from 'react';
import type { ProductCategoryResponse } from "../../../../Domain/Types/ProductCategoryResponse";
import { ProductCategoryRepository } from "../../../../Infrastructure/Repositories/ProductCategoryRepository";
import { getAllProductCategories } from "../../../../Application/Usecases/productCategory/getAllProductCategories";

const categoryRepo = new ProductCategoryRepository();
const getAllCategories = getAllProductCategories(categoryRepo);

export const useProductCategories = () => {
	const [categories, setCategories] = useState<ProductCategoryResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await getAllCategories();
				setCategories(data);
			} catch (error) {
				console.error("Failed to load categories:", error);
				setError("Failed to load categories");
			} finally {
				setLoading(false);
			}
		};
		fetchCategories();
	}, []);

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