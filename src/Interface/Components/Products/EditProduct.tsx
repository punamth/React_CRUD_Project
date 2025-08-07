import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ProductResponse } from "../../../Domain/Types/ProductResponse";
import type { ProductCategoryResponse } from "../../../Domain/Types/ProductCategoryResponse";
import { ProductRepository } from "../../../Infrastructure/Repositories/ProductRepository";
import { ProductCategoryRepository } from "../../../Infrastructure/Repositories/ProductCategoryRepository";
import { getAllProducts } from "../../../Application/Usecases/product/getAllProducts";
import { getAllProductCategories } from "../../../Application/Usecases/productCategory/getAllProductCategories";
import Pagination from "../common/Pagination";
import { useAuth } from "../../Components/Contexts/AuthContext";

const repo = new ProductRepository();
const categoryRepo = new ProductCategoryRepository();
const getAllProd = getAllProducts(repo);
const getAllCategories = getAllProductCategories(categoryRepo);
const itemsPerPage = 10;

interface EditProductProps {
	className?: string;
}

function EditProduct({ className = "" }: EditProductProps) {
	const navigate = useNavigate();
	const [products, setProducts] = useState<ProductResponse[]>([]);
	const [categories, setCategories] = useState<ProductCategoryResponse[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { token } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			setError(null);
			setLoading(true);
			try {
				const [productsData, categoriesData] = await Promise.all([
					getAllProd(token),
					getAllCategories(token)
				]);
				setProducts(productsData);
				setCategories(categoriesData);
			} catch (error) {
				setError("Failed to load data");
			} finally {
				setLoading(false);
			}
		};
		if (token) {
			fetchData();
		}
	}, [token]);

	const getCategoryName = (categoryId: number) => {
		const category = categories.find(cat => cat.id === categoryId);
		return category ? category.name : `Category ${categoryId}`;
	};

	const handleEdit = (product: ProductResponse) => {
		// Navigate to edit page with product data
		navigate(`/products/edit/${product.id}`, { 
			state: { product } 
		});
	};

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(products.length / itemsPerPage);

	if (loading) {
		return (
			<div className={`max-w-4xl mx-auto mt-8 ${className}`}>
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded mb-6"></div>
					<div className="h-64 bg-gray-200 rounded"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={`max-w-4xl mx-auto mt-8 ${className}`}>
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className={`max-w-4xl mx-auto mt-8 ${className}`}>
			<h2 className="text-2xl font-bold mb-6 text-center">Edit Products</h2>
			
			<table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
				<thead className="bg-gray-700 text-white">
					<tr>
						<th className="py-3 px-6 text-left">ID</th>
						<th className="py-3 px-6 text-left">Name</th>
						<th className="py-3 px-6 text-left">Price (NPR)</th>
						<th className="py-3 px-6 text-left">Category</th>
						<th className="py-3 px-6 text-center">Image</th>
						<th className="py-3 px-6 text-center">Action</th>
					</tr>
				</thead>
				<tbody>
					{currentItems.map((product) => (
						<tr
							key={product.id}
							className="even:bg-gray-100 odd:bg-white"
						>
							<td className="py-2 px-6 border-t border-gray-300">
								{product.id}
							</td>
							<td className="py-2 px-6 border-t border-gray-300">
								{product.name}
							</td>
							<td className="py-2 px-6 border-t border-gray-300">
								Rs. {product.price}
							</td>
							<td className="py-2 px-6 border-t border-gray-300">
								{getCategoryName(product.categoryId)}
							</td>
							<td className="w-80 py-2 px-6 border-t border-gray-300">
								{product.imageUrl ? (
									<img
										src={product.imageUrl}
										alt={product.name}
										className="max-w-full h-auto"
									/>
								) : (
									<span className="text-gray-400">No image</span>
								)}
							</td>
							<td className="py-2 px-6 border-t border-gray-300">
								<button
									onClick={() => handleEdit(product)}
									className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
								>
									Edit
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<Pagination 
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}

export default EditProduct; 