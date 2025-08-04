import React, { useState, useCallback } from "react";
import type { ProductCategory } from "../../../Domain/Types/ProductCategory";
import { ProductCategoryRepository } from "../../../Infrastructure/Repositories/ProductCategoryRepository";
import { createProductCategory } from "../../../Application/Usecases/productCategory/createProductCategory";
import GroupDropdown from "../common/GroupDropdown";

const repo = new ProductCategoryRepository();
const add = createProductCategory(repo);

interface CategoryFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
	className?: string;
}

function CategoryForm({ onSuccess, onCancel, className = "" }: CategoryFormProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [groupId, setGroupId] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (!groupId) {
			setError("Please select a group");
			setLoading(false);
			return;
		}

		const categoryData: Omit<ProductCategory, 'id'> = {
			name: name,
			description: description,
			groupId: groupId
		};

		try {
			await add(categoryData);
			alert("Category added successfully");
			
			// Reset form
			setName("");
			setDescription("");
			setGroupId(null);
			
			// Call success callback
			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			setError("Error adding category");
		} finally {
			setLoading(false);
		}
	}, [name, description, groupId, onSuccess]);

	const handleCancel = useCallback(() => {
		if (onCancel) {
			onCancel();
		}
	}, [onCancel]);

	const handleGroupSelect = useCallback((value: number | null) => {
		setGroupId(value);
	}, []);

	return (
		<div className={`max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
			<div className="px-6 py-4 border-b border-gray-200 bg-slate-600 text-white">
				<h2 className="text-xl font-semibold">Add New Category</h2>
				<p className="text-sm text-gray-300 mt-1">Fill in the details below to add a new category</p>
			</div>
			
			<div className="p-6">
				{error && (
					<div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
						<div className="flex items-center">
							<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
							</svg>
							{error}
						</div>
					</div>
				)}
				
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Category Name
						</label>
						<input
							type="text"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
							placeholder="Enter category name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						<textarea
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
							placeholder="Enter category description (optional)"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
						/>
					</div>
					
					<div>
						<GroupDropdown 
							onSelect={handleGroupSelect} 
							selectedGroupId={groupId}
							className="mb-4"
						/>
					</div>
					
					<div className="flex gap-3 pt-4">
						<button
							type="submit"
							disabled={loading}
							className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
						>
							{loading ? (
								<div className="flex items-center justify-center">
									<svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Adding Category...
								</div>
							) : (
								"Add Category"
							)}
						</button>
						
						{onCancel && (
							<button
								type="button"
								onClick={handleCancel}
								className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
							>
								Cancel
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}

export default CategoryForm; 