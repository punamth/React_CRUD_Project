
interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

function Pagination({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) {
	if (totalPages <= 1) return null;

	return (
		<nav className={`mt-6 flex justify-center ${className}`}>
			<ul className="inline-flex -space-x-px">
				{/* Previous button */}
				<li>
					<button
						className={`py-2 px-4 border border-gray-300 hover:bg-gray-200 focus:outline-none ${
							currentPage === 1
								? "bg-gray-100 text-gray-400 cursor-not-allowed"
								: "bg-white text-gray-700"
						} rounded-l-md`}
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						Previous
					</button>
				</li>

				{/* Page numbers */}
				{Array.from({ length: totalPages }, (_, index) => (
					<li key={index}>
						<button
							className={`py-2 px-4 border border-gray-300 hover:bg-gray-200 focus:outline-none ${
								currentPage === index + 1
									? "bg-blue-600 text-white border-blue-600"
									: "bg-white text-gray-700"
							}`}
							onClick={() => onPageChange(index + 1)}
						>
							{index + 1}
						</button>
					</li>
				))}

				{/* Next button */}
				<li>
					<button
						className={`py-2 px-4 border border-gray-300 hover:bg-gray-200 focus:outline-none ${
							currentPage === totalPages
								? "bg-gray-100 text-gray-400 cursor-not-allowed"
								: "bg-white text-gray-700"
						} rounded-r-md`}
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						Next
					</button>
				</li>
			</ul>
		</nav>
	);
}

export default Pagination; 