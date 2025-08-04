import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ProductResponse } from "../../../Domain/Types/ProductResponse";
import type { ProductCategoryResponse } from "../../../Domain/Types/ProductCategoryResponse";
import { ProductRepository } from "../../../Infrastructure/Repositories/ProductRepository";
import { ProductCategoryRepository } from "../../../Infrastructure/Repositories/ProductCategoryRepository";
import { deleteProduct } from "../../../Application/Usecases/product/deleteProduct";
import { getAllProductCategories } from "../../../Application/Usecases/productCategory/getAllProductCategories";

const repo = new ProductRepository();
const categoryRepo = new ProductCategoryRepository();
const deleteProd = deleteProduct(repo);
const getAllCategories = getAllProductCategories(categoryRepo);

interface ProductTableProps {
	products: ProductResponse[];
	className?: string;
	onProductDeleted?: (id: number) => void;
}

function ProductTable({ products, className = "", onProductDeleted }: ProductTableProps) {
	const navigate = useNavigate();
	const [categories, setCategories] = useState<ProductCategoryResponse[]>([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const data = await getAllCategories();
				setCategories(data);
			} catch (error) {
				console.error("Failed to load categories:", error);
			}
		};
		fetchCategories();
	}, []);

	const getCategoryName = (categoryId: number) => {
		const category = categories.find(cat => cat.id === categoryId);
		return category ? category.name : `Category ${categoryId}`;
	};

	const handleEdit = (product: ProductResponse) => {
		navigate(`/products/edit/${product.id}`, { 
			state: { product } 
		});
	};

	const handleDelete = async (id: number) => {
		const confirm = window.confirm("Are you sure you want to delete this product?");
		if (!confirm) return;

		try {
			await deleteProd(id);
			if (onProductDeleted) {
				onProductDeleted(id);
			}
		} catch (error) {
			alert("Error deleting product");
		}
	};

	return (
		<div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-slate-600 text-white">
						<tr>
							<th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
								Name
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
								Category
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
								SKU
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
								Price (NPR)
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
								Stock Qty
							</th>
							<th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{products.map((product, index) => (
							<tr
								key={product.id}
								className={`hover:bg-gray-50 transition-colors ${
									index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
								}`}
							>
								<td className="px-6 py-4 text-sm font-medium text-gray-900">
									{product.name}
								</td>
								<td className="px-6 py-4 text-sm text-gray-600">
									{getCategoryName(product.categoryId)}
								</td>
								<td className="px-6 py-4 text-sm text-gray-500 font-mono">
									{product.sku}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 font-medium">
									Rs. {product.price.toLocaleString()}
								</td>
								<td className="px-6 py-4 text-sm text-gray-600">
									<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
										product.stockQuantity > 0 
											? 'bg-green-100 text-green-800' 
											: 'bg-red-100 text-red-800'
									}`}>
										{product.stockQuantity}
									</span>
								</td>
								<td className="px-6 py-4">
									<div className="flex gap-2 justify-center">
										<button
											onClick={() => handleEdit(product)}
											className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
											title="Edit Product"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
											</svg>
										</button>
										<button
											onClick={() => handleDelete(product.id!)}
											className="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
											title="Delete Product"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			
			{products.length === 0 && (
				<div className="text-center py-12">
					<div className="text-gray-400 text-lg mb-2">No products found</div>
					<div className="text-gray-500 text-sm">Add your first product to get started</div>
				</div>
			)}
		</div>
	);
}

export default ProductTable;