import { useNavigate } from "react-router-dom";
import CategoryForm from "../../Components/Categories/CategoryForm";

function AddCategory() {
	const navigate = useNavigate();

	const handleSuccess = () => {
		navigate("/categories");
	};

	const handleCancel = () => {
		navigate("/categories");
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<CategoryForm 
				onSuccess={handleSuccess}
				onCancel={handleCancel}
			/>
		</div>
	);
}

export default AddCategory; 