import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import type { ProductResponse } from "../../../../Domain/Types/ProductResponse";
import { ProductRepository } from "../../../../Infrastructure/Repositories/ProductRepository";
import { deleteProduct } from "../../../../Application/Usecases/product/deleteProduct";

const repo = new ProductRepository();
const deleteProd = deleteProduct(repo);

interface UseProductActionsProps {
	onProductDeleted?: (id: number) => void;
}

export const useProductActions = ({ onProductDeleted }: UseProductActionsProps) => {
	const navigate = useNavigate();

	const handleEdit = useCallback((product: ProductResponse) => {
		navigate(`/products/edit/${product.id}`, { 
			state: { product } 
		});
	}, [navigate]);

	const handleDelete = useCallback(async (id: number) => {
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
	}, [onProductDeleted]);

	return {
		handleEdit,
		handleDelete
	};
}; 