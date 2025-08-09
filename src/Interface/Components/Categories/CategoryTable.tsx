
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ProductCategoryResponse } from "../../../Domain/Types/ProductCategoryResponse";
import type { ProductGroupResponse } from "../../../Domain/Types/ProductGroupResponse";
import { ProductCategoryRepository } from "../../../Infrastructure/Repositories/ProductCategoryRepository";
import { ProductGroupRepository } from "../../../Infrastructure/Repositories/ProductGroupRepository";
import { deleteProductCategory } from "../../../Application/Usecases/productCategory/deleteProductCategory";
import { getAllProductGroups } from "../../../Application/Usecases/productGroup/getAllProductGroups";
import { useAuth } from "../Contexts/AuthContext";

const repo = new ProductCategoryRepository();
const groupRepo = new ProductGroupRepository();
const deleteCategory = deleteProductCategory(repo);
const getAllGroups = getAllProductGroups(groupRepo);

interface CategoryTableProps {
	categories: ProductCategoryResponse[];
	className?: string;
	onCategoryDeleted?: (id: number) => void;
}

function CategoryTable({ categories, className = "", onCategoryDeleted }: CategoryTableProps) {
	const navigate = useNavigate();
	const [groups, setGroups] = useState<ProductGroupResponse[]>([]);
	const { token } = useAuth();

	useEffect(() => {
		const fetchGroups = async () => {
			if (!token) {
				console.error("No authentication token available");
				return;
			}

			try {
				const data = await getAllGroups(token);
				setGroups(data);
			} catch (error) {
				console.error("Failed to load groups:", error);
			}
		};
		fetchGroups();
	}, [token]);

	const getGroupName = (groupId: number) => {
		const group = groups.find(grp => grp.id === groupId);
		return group ? group.name : `Group ${groupId}`;
	};

	const handleEdit = (category: ProductCategoryResponse) => {
		navigate(`/categories/edit/${category.id}`, { 
			state: { category } 
		});
	};

	const handleDelete = async (id: number) => {
		if (!token) {
			alert("No authentication token available");
			return;
		}

		const confirm = window.confirm("Are you sure you want to delete this category?");
		if (!confirm) return;

		try {
			await deleteCategory(id, token);
			if (onCategoryDeleted) {
				onCategoryDeleted(id);
			}
		} catch (error) {
			alert("Error deleting category");
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
								Description
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
								Group
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
								Created At
							</th>
							<th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{categories.map((category, index) => (
							<tr
								key={category.id}
								className={`hover:bg-gray-50 transition-colors ${
									index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
								}`}
							>
								<td className="px-6 py-4 text-sm font-medium text-gray-900">
									{category.name}
								</td>
								<td className="px-6 py-4 text-sm text-gray-600">
									{category.description || "No description"}
								</td>
								<td className="px-6 py-4 text-sm text-gray-600">
									{getGroupName(category.groupId)}
								</td>
								<td className="px-6 py-4 text-sm text-gray-600">
									{category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "N/A"}
								</td>
								<td className="px-6 py-4">
									<div className="flex gap-2 justify-center">
										<button
											onClick={() => handleEdit(category)}
											className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
											title="Edit Category"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
											</svg>
										</button>
										<button
											onClick={() => handleDelete(category.id!)}
											className="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
											title="Delete Category"
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
			
			{categories.length === 0 && (
				<div className="text-center py-12">
					<div className="text-gray-400 text-lg mb-2">No categories found</div>
					<div className="text-gray-500 text-sm">Add your first category to get started</div>
				</div>
			)}
		</div>
	);
}

export default CategoryTable; 