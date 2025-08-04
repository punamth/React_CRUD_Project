import React, { useEffect, useState, useCallback, useMemo } from "react";
import type { ProductCategoryResponse } from "../../../Domain/Types/ProductCategoryResponse";

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

	// Memoize the fetch function to prevent unnecessary re-creations
	const fetchCategories = useCallback(async () => {
		const token = localStorage.getItem("token");
		try {
			const response = await fetch(
				"https://localhost:5001/api/ProductCategory",
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			const selectedData = data.map(({ id, name }: any) => ({
				id,
				name,
			}));
			setCategories(selectedData);
			if (onCategoriesLoaded) {
				onCategoriesLoaded(selectedData);
			}
		} catch (error) {
			console.error(error);
			setError("Failed to load categories");
		} finally {
			setLoading(false);
		}
	}, [onCategoriesLoaded]);

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