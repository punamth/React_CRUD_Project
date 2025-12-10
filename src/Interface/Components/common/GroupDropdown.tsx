import React, { useEffect, useState } from "react";
import type { ProductGroupResponse } from "../../../Domain/Types/ProductGroupResponse";
import { ProductGroupRepository } from "../../../Infrastructure/Repositories/ProductGroupRepository";
import { getAllProductGroups } from "../../../Application/Usecases/productGroup/getAllProductGroups";
import { useAuth } from "../Contexts/AuthContext";

const repo = new ProductGroupRepository();
const getAllGroups = getAllProductGroups(repo);

interface GroupDropdownProps {
	onSelect: (groupId: number | null) => void;
	selectedGroupId?: number | null;
	className?: string;
}

function GroupDropdown({ onSelect, selectedGroupId, className = "" }: GroupDropdownProps) {
	const [groups, setGroups] = useState<ProductGroupResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { token } = useAuth();

	useEffect(() => {
		const fetchGroups = async () => {
			if (!token) {
				setError("No authentication token available");
				setLoading(false);
				return;
			}

			try {
				const data = await getAllGroups(token);
				setGroups(data);
			} catch (error) {
				setError("Failed to load groups");
			} finally {
				setLoading(false);
			}
		};
		fetchGroups();
	}, [token]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		onSelect(value ? parseInt(value) : null);
	};

	if (loading) {
		return (
			<div className={`mb-4 ${className}`}>
				<label className="block text-gray-700 font-medium mb-2">
					Group
				</label>
				<div className="w-full px-4 py-2 border rounded-lg bg-gray-100 animate-pulse">
					Loading groups...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={`mb-4 ${className}`}>
				<label className="block text-gray-700 font-medium mb-2">
					Group
				</label>
				<div className="w-full px-4 py-2 border border-red-300 rounded-lg bg-red-50 text-red-600">
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className={`mb-4 ${className}`}>
			<label className="block text-gray-700 font-medium mb-2">
				Group
			</label>
			<select
				className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				value={selectedGroupId || ""}
				onChange={handleChange}
				required
			>
				<option value="">Select a group</option>
				{groups.map((group) => (
					<option key={group.id} value={group.id}>
						{group.name}
					</option>
				))}
			</select>
		</div>
	);
}

export default GroupDropdown; 