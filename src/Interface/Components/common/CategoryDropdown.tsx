import React, { useState, useCallback, useEffect, useMemo } from "react";
import type { ProductCategoryResponse } from "../../../Domain/Types/ProductCategoryResponse";
import { ProductCategoryRepository } from "../../../Infrastructure/Repositories/ProductCategoryRepository";
import { getAllProductCategories } from "../../../Application/Usecases/productCategory/getAllProductCategories";
import { useAuth } from "../Contexts/AuthContext";

const categoryRepo = new ProductCategoryRepository();
const getAllCategories = getAllProductCategories(categoryRepo);

interface CategoryDropdownProps {
	onSelect: (categoryId: number | null) => void;
	selectedCategoryId?: number | null;
	onCategoriesLoaded?: (categories: any[]) => void;
	className?: string;
}

function CategoryDropdown({ onSelect, selectedCategoryId, onCategoriesLoaded, className = "" }: CategoryDropdownProps) {
	const [categories, setCategories] = useState<ProductCategoryResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { token } = useAuth();

	// Memoize the fetch function to prevent unnecessary re-creations
	const fetchCategories = useCallback(async () => {
		if (!token) {
			setError("No authentication token available");
			setLoading(false);
			return;
		}

		try {
			const data = await getAllCategories(token);
			setCategories(data);
			if (onCategoriesLoaded) {
				onCategoriesLoaded(data);
			}
		} catch (error) {
			console.error(error);
			setError("Failed to load categories");
		} finally {
			setLoading(false);
		}
	}, [onCategoriesLoaded, token]);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	// Memoize the change handler to prevent unnecessary re-renders
	const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		onSelect(value ? parseInt(value) : null);
	}, [onSelect]);

	// Memoize the select value to prevent unnecessary re-renders
	const selectValue = useMemo(() => selectedCategoryId || "", [selectedCategoryId]);

	// Memoize the className to prevent unnecessary re-renders
	const selectClassName = useMemo(() => 
		"w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
		[]
	);

	if (loading) {
		return (
			<div className={`${className}`}>
				<div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 animate-pulse">
					Loading categories...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={`${className}`}>
				<div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-red-50 text-red-600">
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className={`${className}`}>
			<select
				className={selectClassName}
				value={selectValue}
				onChange={handleChange}
				required
			>
				<option value="">Select a category</option>
				{categories.map((category) => (
					<option key={category.id} value={category.id}>
						{category.name}
					</option>
				))}
			</select>
		</div>
	);
}

export default CategoryDropdown;