import { useEffect, useState } from "react";
import type { ProductCategoryResponse } from "../../../Domain/Types/ProductCategoryResponse";
import { ProductCategoryRepository } from "../../../Infrastructure/Repositories/ProductCategoryRepository";
import { getAllProductCategories } from "../../../Application/Usecases/productCategory/getAllProductCategories";
import CategoryTable from "./CategoryTable";
import { useAuth } from "../Contexts/AuthContext";

const repo = new ProductCategoryRepository();
const getAllCategories = getAllProductCategories(repo);
const itemsPerPage = 10;

function EditCategory() {
	const [categories, setCategories] = useState<ProductCategoryResponse[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { token } = useAuth();

	useEffect(() => {
		const fetchCategories = async () => {
			if (!token) {
				setError("No authentication token available");
				setLoading(false);
				return;
			}

			setError(null);
			setLoading(true);
			try {
				const data = await getAllCategories(token);
				setCategories(data);
			} catch (error) {
				setError("Failed to load categories");
			} finally {
				setLoading(false);
			}
		};
		fetchCategories();
	}, [token]);

	const handleCategoryDeleted = (id: number) => {
		setCategories(prev => prev.filter(category => category.id !== id));
	};

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(categories.length / itemsPerPage);

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto mt-8">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded mb-6"></div>
					<div className="h-64 bg-gray-200 rounded"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-4xl mx-auto mt-8">
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
					<div className="flex items-center">
						<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
						</svg>
						{error}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto mt-8">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900">Edit Categories</h2>
				<p className="text-sm text-gray-600 mt-1">
					Select a category to edit its details. Click the edit button next to any category to modify it.
				</p>
			</div>
			
			<CategoryTable 
				categories={currentItems} 
				onCategoryDeleted={handleCategoryDeleted}
			/>
			
			{totalPages > 1 && (
				<div className="mt-6 flex justify-center">
					<nav className="inline-flex -space-x-px">
						{Array.from({ length: totalPages }, (_, index) => (
							<button
								key={index}
								onClick={() => setCurrentPage(index + 1)}
								className={`py-2 px-4 border border-gray-300 hover:bg-gray-200 focus:outline-none ${
									currentPage === index + 1 
										? "bg-blue-600 text-white border-blue-600" 
										: "bg-white text-gray-700"
								} rounded-l-md first:rounded-l-md last:rounded-r-md`}
							>
								{index + 1}
							</button>
						))}
					</nav>
				</div>
			)}
		</div>
	);
}

export default EditCategory; 