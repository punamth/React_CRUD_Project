import { useEffect, useState } from "react";
import type { ProductResponse } from "../../../Domain/Types/ProductResponse";
import { ProductRepository } from "../../../Infrastructure/Repositories/ProductRepository";
import { getAllProducts } from "../../../Application/Usecases/product/getAllProducts";
import ProductTable from "./ProductTable";
import Pagination from "../common/Pagination";
import { useAuth } from "../../Components/Contexts/AuthContext";

const repo = new ProductRepository();
const showAll = getAllProducts(repo);
const itemsPerPage = 10;

interface ProductListProps {
	title?: string;
	className?: string;
}

function ProductList({ title = "Product List", className = "" }: ProductListProps) {
	const [products, setProducts] = useState<ProductResponse[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { token } = useAuth();

	useEffect(() => {
		const fetchProducts = async () => {
			setError(null);
			setLoading(true);
			try {
				const data = await showAll(token);
				setProducts(data);
			} catch (error) {
				setError("Failed to load products");
			} finally {
				setLoading(false);
			}
		};
		if (token) {
			fetchProducts();
		}
	}, [token]);

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

	const handleProductDeleted = (id: number) => {
		setProducts(prev => prev.filter(product => product.id !== id));
	};

	return (
		<div className={`max-w-4xl mx-auto mt-8 ${className}`}>
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900">{title}</h2>
			</div>
			
			<ProductTable 
				products={currentItems} 
				onProductDeleted={handleProductDeleted}
			/>
			
			{totalPages > 1 && (
				<div className="mt-6 flex justify-center">
					<Pagination 
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</div>
			)}
		</div>
	);
}

export default ProductList; 