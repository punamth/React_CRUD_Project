import { useNavigate } from "react-router-dom";
import UpdateGroupForm from "../../Components/Groups/UpdateGroupForm";

function UpdateGroup() {
	const navigate = useNavigate();

	const handleSuccess = () => {
		navigate("/groups");
	};

	const handleCancel = () => {
		navigate("/groups");
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<UpdateGroupForm 
				onSuccess={handleSuccess}
				onCancel={handleCancel}
			/>
		</div>
	);
}

export default UpdateGroup; 