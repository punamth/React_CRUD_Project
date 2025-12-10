import  { useEffect, useState } from "react";
import type { ProductGroupResponse } from "../../../Domain/Types/ProductGroupResponse";
import { ProductGroupRepository } from "../../../Infrastructure/Repositories/ProductGroupRepository";
import { getAllProductGroups } from "../../../Application/Usecases/productGroup/getAllProductGroups";
import GroupTable from "./GroupTable";
import Pagination from "../common/Pagination";
import { useAuth } from "../Contexts/AuthContext";

const repo = new ProductGroupRepository();
const showAll = getAllProductGroups(repo);
const itemsPerPage = 10;

interface GroupListProps {
	title?: string;
	className?: string;
}

function GroupList({ title = "Group List", className = "" }: GroupListProps) {
	const [groups, setGroups] = useState<ProductGroupResponse[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
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

			setError(null);
			setLoading(true);
			try {
				const data = await showAll(token);
				setGroups(data);
			} catch (error) {
				setError("Failed to load groups");
			} finally {
				setLoading(false);
			}
		};
		fetchGroups();
	}, [token]);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = groups.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(groups.length / itemsPerPage);

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

	const handleGroupDeleted = (id: number) => {
		setGroups(prev => prev.filter(group => group.id !== id));
	};

	return (
		<div className={`max-w-4xl mx-auto mt-8 ${className}`}>
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900">{title}</h2>
			</div>
			
			<GroupTable 
				groups={currentItems} 
				onGroupDeleted={handleGroupDeleted}
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

export default GroupList; 