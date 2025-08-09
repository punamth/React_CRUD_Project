import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { ProductGroup } from "../../../Domain/Types/ProductGroup";
import type { ProductGroupResponse } from "../../../Domain/Types/ProductGroupResponse";
import { ProductGroupRepository } from "../../../Infrastructure/Repositories/ProductGroupRepository";
import { updateProductGroup } from "../../../Application/Usecases/productGroup/updateProductGroup";
import { useAuth } from "../Contexts/AuthContext";

const repo = new ProductGroupRepository();
const update = updateProductGroup(repo);

interface UpdateGroupFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
	className?: string;
}

function UpdateGroupForm({ onSuccess, onCancel, className = "" }: UpdateGroupFormProps) {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const groupData = location.state?.group as ProductGroupResponse;
	const { token } = useAuth();
	
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Initialize form with group data
	useEffect(() => {
		if (groupData) {
			setName(groupData.name || "");
			setDescription(groupData.description || "");
		}
	}, [groupData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (!token) {
			setError("No authentication token available");
			setLoading(false);
			return;
		}

		if (!id) {
			setError("Group ID is required");
			setLoading(false);
			return;
		}

		const groupUpdateData: ProductGroup = {
			id: parseInt(id),
			name: name,
			description: description
		};

		try {
			await update(groupUpdateData, token);
			alert("Group updated successfully");
			
			// Call success callback
			if (onSuccess) {
				onSuccess();
			} else {
				navigate("/groups");
			}
		} catch (error) {
			setError("Error updating group");
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		} else {
			navigate("/groups");
		}
	};

	if (!groupData) {
		return (
			<div className={`max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md ${className}`}>
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					Group not found. Please go back and try again.
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
		<div className={`max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
			<div className="px-6 py-4 border-b border-gray-200 bg-slate-600 text-white">
				<h2 className="text-xl font-semibold">Update Group</h2>
				<p className="text-sm text-gray-300 mt-1">Modify the group details below</p>
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
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Group Name
						</label>
						<input
							type="text"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
							placeholder="Enter group name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						<textarea
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
							placeholder="Enter group description (optional)"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
						/>
					</div>
					
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
									Updating Group...
								</div>
							) : (
								"Update Group"
							)}
						</button>
						
						<button
							type="button"
							onClick={handleCancel}
							className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default UpdateGroupForm; 