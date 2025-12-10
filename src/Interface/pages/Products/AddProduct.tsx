import { useNavigate } from "react-router-dom";
import ProductForm from "../../Components/Products/ProductForm";

function AddProduct() {
	const navigate = useNavigate();

	const handleSuccess = () => {
		navigate("/products");
	};

	const handleCancel = () => {
		navigate("/products");
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<ProductForm 
				onSuccess={handleSuccess}
				onCancel={handleCancel}
			/>
		</div>
	);
}

export default AddProduct;