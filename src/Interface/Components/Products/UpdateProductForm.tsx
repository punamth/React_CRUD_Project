import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { Product } from "../../../Domain/Types/Product";
import type { ProductResponse } from "../../../Domain/Types/ProductResponse";
import { ProductRepository } from "../../../Infrastructure/Repositories/ProductRepository";
import { updateProduct } from "../../../Application/Usecases/product/updateProduct";
import CategoryNameDropdown from "../common/CategoryNameDropdown";
import { useAuth } from "../../Components/Contexts/AuthContext";

const repo = new ProductRepository();
const update = updateProduct(repo);

interface UpdateProductFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
	className?: string;
}

function UpdateProductForm({ onSuccess, onCancel, className = "" }: UpdateProductFormProps) {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const productData = location.state?.product as ProductResponse;
	
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [categoryName, setCategoryName] = useState<string | null>(null);
	const [categories, setCategories] = useState<any[]>([]);
	const [sku, setSku] = useState("");
	const [stockQuantity, setStockQuantity] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const { token } = useAuth();

	// Initialize form with product data
	useEffect(() => {
		if (productData) {
			setName(productData.name || "");
			setPrice(productData.price?.toString() || "");
			setSku(productData.sku || "");
			setStockQuantity(productData.stockQuantity?.toString() || "");
			setDescription(productData.description || "");
			setPreview(productData.imageUrl || null);
		}
	}, [productData]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setImage(file);
		setPreview(URL.createObjectURL(file));
	};

	const handleImageClick = () => {
		if (inputRef.current) {
			inputRef.current.click();
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (!token) {
			setError("No authentication token available");
			setLoading(false);
			return;
		}

		if (!id || !categoryName) {
			setError("Product ID and category are required");
			setLoading(false);
			return;
		}

		// Find the category ID from the selected category name
		const selectedCategory = categories.find(cat => cat.name === categoryName);
		if (!selectedCategory) {
			setError("Selected category not found");
			setLoading(false);
			return;
		}

		const productData: Product = {
			id: parseInt(id),
			name: name,
			price: parseFloat(price),
			categoryId: selectedCategory.id,
			sku: sku,
			stockQuantity: parseInt(stockQuantity),
			description: description,
			image: image
		};

		try {
			await update(productData, token);
			alert("Product updated successfully");
			
			if (onSuccess) {
				onSuccess();
			} else {
				navigate("/products");
			}
		} catch (error) {
			setError("Error updating product");
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		} else {
			navigate("/products");
		}
	};

	if (!productData) {
		return (
			<div className={`max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md ${className}`}>
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					Product not found. Please go back and try again.
				</div>
				<button
					onClick={handleCancel}
					className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
				>
					Go Back
				</button>
			</div>
		);
	}

	return (
		<div className={`max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md ${className}`}>
			<h2 className="text-2xl font-bold mb-6 text-center">Update Product</h2>
			
			{error && (
				<div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			)}
			
			<form onSubmit={handleSubmit}>
				{/* Name */}
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-2">
						Name
					</label>
					<input
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				
				{/* Price */}
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-2">
						Price
					</label>
					<input
						type="number"
						step="0.01"
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						required
					/>
				</div>

				{/* SKU */}
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-2">
						SKU
					</label>
					<input
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={sku}
						onChange={(e) => setSku(e.target.value)}
						required
					/>
				</div>

				{/* Stock Quantity */}
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-2">
						Stock Quantity
					</label>
					<input
						type="number"
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={stockQuantity}
						onChange={(e) => setStockQuantity(e.target.value)}
						required
					/>
				</div>

				{/* Description */}
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-2">
						Description
					</label>
					<textarea
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={3}
					/>
				</div>
				
				{/* Category */}
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-2">
						Category
					</label>
					<CategoryNameDropdown 
						onSelect={setCategoryName} 
						selectedCategoryName={categoryName}
						onCategoriesLoaded={(cats: any[]) => {
							setCategories(cats);
							// Set the category name based on the product's category ID
							if (productData && productData.categoryId) {
								const category = cats.find(cat => cat.id === productData.categoryId);
								if (category) {
									setCategoryName(category.name);
								}
							}
						}}
					/>
				</div>
				
				{/* Image */}
				<div className="mb-6">
					<label className="block text-gray-700 font-medium mb-2">
						Image
					</label>
					<input
						type="file"
						accept="image/*"
						ref={inputRef}
						onChange={handleImageChange}
						className="hidden"
					/>
					{!preview ? (
						<input
							type="file"
							accept="image/*"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							onChange={handleImageChange}
						/>
					) : (
						<img
							src={preview}
							alt="Preview"
							className="mb-4 rounded hover:opacity-80 cursor-pointer max-w-full h-auto"
							onClick={handleImageClick}
						/>
					)}
				</div>
				
				{/* Form Buttons */}
				<div className="flex gap-4">
					<button
						type="submit"
						disabled={loading}
						className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
					>
						{loading ? "Updating..." : "Update Product"}
					</button>
					
					<button
						type="button"
						onClick={handleCancel}
						className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}

export default UpdateProductForm; 