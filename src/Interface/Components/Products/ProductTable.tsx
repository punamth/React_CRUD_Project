import type { ProductResponse } from "../../../Domain/Types/ProductResponse";
import { useProductCategories } from "./hooks/useProductCategories";
import { useProductActions } from "./hooks/useProductActions";
import { ProductImageCell } from "./ProductImageCell";
import { ProductActionButtons } from "./ProductActionButtons";
import { useAuth } from "../Contexts/AuthContext";

interface ProductTableProps {
	products: ProductResponse[];
	className?: string;
	onProductDeleted?: (id: number) => void;
}

function ProductTable({ products, className = "", onProductDeleted }: ProductTableProps) {
	const { token } = useAuth();
	const { getCategoryName } = useProductCategories({ token });
	const { handleEdit, handleDelete } = useProductActions({ onProductDeleted, token });

	return (
		<div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-slate-600 text-white">
						<tr>
							<th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
								Image
							</th>
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
								<ProductImageCell
									imageUrl={product.imageUrl}
									imageFileName={product.imageFileName}
									productName={product.name}
								/>
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
									<ProductActionButtons
										product={product}
										onEdit={handleEdit}
										onDelete={handleDelete}
									/>
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