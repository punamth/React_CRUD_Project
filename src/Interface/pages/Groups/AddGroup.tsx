import { useNavigate } from "react-router-dom";
import GroupForm from "../../Components/Groups/GroupForm";

function AddGroup() {
	const navigate = useNavigate();

	const handleSuccess = () => {
		navigate("/groups");
	};

	const handleCancel = () => {
		navigate("/groups");
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<GroupForm 
				onSuccess={handleSuccess}
				onCancel={handleCancel}
			/>
		</div>
	);
}

export default AddGroup; 