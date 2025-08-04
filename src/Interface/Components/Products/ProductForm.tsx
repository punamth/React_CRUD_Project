import React, { useState, useRef, useCallback } from "react";
import type { ProductFormInput } from "../../../Domain/Types/ProductFormInput";
import { ProductRepository } from "../../../Infrastructure/Repositories/ProductRepository";
import { createProduct } from "../../../Application/Usecases/product/createProduct";
import CategoryDropdown from "../common/CategoryDropdown";

const repo = new ProductRepository();
const add = createProduct(repo);

interface ProductFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
	className?: string;
}

function ProductForm({ onSuccess, onCancel, className = "" }: ProductFormProps) {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [sku, setSku] = useState("");
	const [stockQuantity, setStockQuantity] = useState("");
	const [categoryId, setCategoryId] = useState<number | null>(null);
	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setImage(file);
		setPreview(URL.createObjectURL(file));
	}, []);

	const handleImageClick = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.click();
		}
	}, []);

	const handleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (!categoryId) {
			setError("Please select a category");
			setLoading(false);
			return;
		}

		const productData: Omit<ProductFormInput, 'id'> = {
			name: name,
			price: parseFloat(price),
			categoryId: categoryId,
			sku: sku,
			stockQuantity: parseInt(stockQuantity),
			description: "",
			image: image
		};

		try {
			await add(productData);
			alert("Product added successfully");
			
			// Reset form
			setName("");
			setPrice("");
			setSku("");
			setStockQuantity("");
			setCategoryId(null);
			setPreview(null);
			setImage(null);
			
			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			setError("Error adding product");
		} finally {
			setLoading(false);
		}
	}, [name, price, categoryId, sku, stockQuantity, image, onSuccess]);

	const handleCancel = useCallback(() => {
		if (onCancel) {
			onCancel();
		}
	}, [onCancel]);

	const handleCategorySelect = useCallback((value: number | null) => {
		console.log("ProductForm: Received category value:", value);
		setCategoryId(value);
	}, []);

	const handleImageRemove = useCallback(() => {
		setPreview(null);
		setImage(null);
	}, []);

	return (
		<div className={`max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
			<div className="px-6 py-4 border-b border-gray-200 bg-slate-600 text-white">
				<h2 className="text-xl font-semibold">Add New Product</h2>
				<p className="text-sm text-gray-300 mt-1">Fill in the details below to add a new product</p>
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
					{/* Product Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Product Name
						</label>
						<input
							type="text"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
							placeholder="Enter product name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					
					{/* SKU */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							SKU
						</label>
						<input
							type="text"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
							placeholder="Enter SKU"
							value={sku}
							onChange={(e) => setSku(e.target.value)}
							required
						/>
					</div>
					
					{/* Price */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Price (NPR)
						</label>
						<div className="relative">
							<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs.</span>
							<input
								type="number"
								step="0.01"
								min="0"
								className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
								placeholder="0.00"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								required
							/>
						</div>
					</div>
					
					{/* Stock Quantity */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Stock Quantity
						</label>
						<input
							type="number"
							min="0"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
							placeholder="Enter stock quantity"
							value={stockQuantity}
							onChange={(e) => setStockQuantity(e.target.value)}
							required
						/>
					</div>
					
					{/* Category */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Category
						</label>
						<CategoryDropdown 
							onSelect={handleCategorySelect} 
							selectedCategoryId={categoryId}
							className="mb-4"
						/>
					</div>
					
					{/* Product Image */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Product Image
						</label>
						<input
							type="file"
							accept="image/*"
							ref={inputRef}
							onChange={handleImageChange}
							className="hidden"
						/>
						
						{!preview ? (
							<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
								<svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
									<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								<div className="mt-4">
									<input
										type="file"
										accept="image/*"
										className="sr-only"
										onChange={handleImageChange}
										id="image-upload"
									/>
									<label htmlFor="image-upload" className="cursor-pointer">
										<span className="mt-2 block text-sm font-medium text-gray-900">Upload an image</span>
										<span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF up to 10MB</span>
									</label>
								</div>
							</div>
						) : (
							<div className="relative">
								<img
									src={preview}
									alt="Preview"
									className="w-full h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
									onClick={handleImageClick}
								/>
								<button
									type="button"
									onClick={handleImageRemove}
									className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
						)}
					</div>
					
					{/* Form Buttons */}
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
									Adding Product...
								</div>
							) : (
								"Add Product"
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

export default ProductForm;