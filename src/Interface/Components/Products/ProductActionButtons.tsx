import type { ProductResponse } from "../../../Domain/Types/ProductResponse";

interface ProductActionButtonsProps {
	product: ProductResponse;
	onEdit: (product: ProductResponse) => void;
	onDelete: (id: number) => void;
}

export const ProductActionButtons = ({ product, onEdit, onDelete }: ProductActionButtonsProps) => {
	return (
		<div className="flex gap-2 justify-center">
			<button
				onClick={() => onEdit(product)}
				className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
				title="Edit Product"
			>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
				</svg>
			</button>
			<button
				onClick={() => onDelete(product.id!)}
				className="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
				title="Delete Product"
			>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
			</button>
		</div>
	);
}; 