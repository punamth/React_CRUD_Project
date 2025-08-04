
import { useNavigate } from "react-router-dom";
import type { ProductGroupResponse } from "../../../Domain/Types/ProductGroupResponse";
import { ProductGroupRepository } from "../../../Infrastructure/Repositories/ProductGroupRepository";
import { deleteProductGroup } from "../../../Application/Usecases/productGroup/deleteProductGroup";

const repo = new ProductGroupRepository();
const deleteGroup = deleteProductGroup(repo);

interface GroupTableProps {
	groups: ProductGroupResponse[];
	className?: string;
	onGroupDeleted?: (id: number) => void;
}

function GroupTable({ groups, className = "", onGroupDeleted }: GroupTableProps) {
	const navigate = useNavigate();

	const handleEdit = (group: ProductGroupResponse) => {
		navigate(`/groups/edit/${group.id}`, { 
			state: { group } 
		});
	};

	const handleDelete = async (id: number) => {
		const confirm = window.confirm("Are you sure you want to delete this group?");
		if (!confirm) return;

		try {
			await deleteGroup(id);
			if (onGroupDeleted) {
				onGroupDeleted(id);
			}
		} catch (error) {
			alert("Error deleting group");
		}
	};

	return (
		<div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-slate-600 text-white">
						<tr>
							<th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
								Name
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
								Description
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
								Created At
							</th>
							<th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{groups.map((group, index) => (
							<tr
								key={group.id}
								className={`hover:bg-gray-50 transition-colors ${
									index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
								}`}
							>
								<td className="px-6 py-4 text-sm font-medium text-gray-900">
									{group.name}
								</td>
								<td className="px-6 py-4 text-sm text-gray-600">
									{group.description || "No description"}
								</td>
								<td className="px-6 py-4 text-sm text-gray-600">
									{group.createdAt ? new Date(group.createdAt).toLocaleDateString() : "N/A"}
								</td>
								<td className="px-6 py-4 text-sm text-gray-600 text-center">
									<div className="flex items-center justify-center space-x-2">
										<button
											onClick={() => handleEdit(group)}
											className="text-blue-600 hover:text-blue-900 transition-colors"
											title="Edit group"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
											</svg>
										</button>
										<button
											onClick={() => group.id && handleDelete(group.id)}
											className="text-red-600 hover:text-red-900 transition-colors"
											title="Delete group"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default GroupTable; 