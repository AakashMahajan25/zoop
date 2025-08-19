// import React from 'react';

// interface Claim {
//   id: number;
//   vehicleNumber: string;
//   insurer: string;
//   claimAmount: number;
//   claimStatus: 'Assessment Active' | 'Assessment Pending' | 'Assigned';
//   createdOn: Date;
//   claimHandler: string;
// }

// interface TableComponentProps {
//   claimsData: Claim[];
//   searchTerm: string;
//   startDate: Date | null;
//   endDate: Date | null;
//   currentPage: number;
//   rowsPerPage: number;
//   visibleColumns: Record<string, boolean>;
//   onPageChange: (page: number) => void;
//   onViewClaim: (claimId: number) => void;
//   filterStatuses: string[]; // New prop to filter by specific statuses
// }

// const allColumnsOfListView = ['Vehicle Number', 'Insurer', 'Claim Amount', 'Created On', 'Claim Status', 'Actions'];

// const TableComponent: React.FC<TableComponentProps> = ({
//   claimsData,
//   searchTerm,
//   startDate,
//   endDate,
//   currentPage,
//   rowsPerPage,
//   visibleColumns,
//   onPageChange,
//   onViewClaim,
//   filterStatuses,
// }) => {
//   // Filtered data based on filterStatuses and date range
//   const filteredData = claimsData.filter(claim => {
//     const endDateAdjusted = endDate ? new Date(endDate) : null;
//     if (endDateAdjusted) endDateAdjusted.setHours(23, 59, 59, 999);
//     const isWithinDateRange =
//       (!startDate || claim.createdOn >= startDate) &&
//       (!endDateAdjusted || claim.createdOn <= endDateAdjusted);
//     if (!isWithinDateRange) return false;

//     return filterStatuses.includes(claim.claimStatus);
//   });

//   // Searched data based on filteredData
//   const searchedData = filteredData.filter(claim =>
//     claim.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     claim.insurer.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination calculations
//   const totalCount = searchedData.length;
//   const lastPage = Math.ceil(totalCount / rowsPerPage);
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const endIndex = Math.min(currentPage * rowsPerPage, totalCount);
//   const paginatedData = searchedData.slice(startIndex, endIndex);

//   const getPageNumbers = () => {
//     const pages: (number | '...')[] = [];
//     const maxVisiblePages = 5;
//     if (lastPage <= maxVisiblePages) {
//       for (let i = 1; i <= lastPage; i++) pages.push(i);
//     } else {
//       const halfVisible = Math.floor(maxVisiblePages / 2);
//       let start = currentPage - halfVisible;
//       let end = currentPage + halfVisible;
//       if (start < 1) {
//         start = 1;
//         end = maxVisiblePages;
//       }
//       if (end > lastPage) {
//         end = lastPage;
//         start = lastPage - maxVisiblePages + 1;
//       }
//       if (start > 1) {
//         pages.push(1);
//         if (start > 2) pages.push('...');
//       }
//       for (let i = start; i <= end; i++) pages.push(i);
//       if (end < lastPage) {
//         if (end < lastPage - 1) pages.push('...');
//         pages.push(lastPage);
//       }
//     }
//     return pages;
//   };

//   return (
//     <div className="overflow-x-auto h-[calc(100vh-300px)]">
//       <table className="min-w-full divide-y divide-gray-200 border border-[#EFEFEF]">
//         <thead className="bg-gray-100 sticky top-0">
//           <tr className="bg-[#FBFBFB]">
//             {allColumnsOfListView.map((header) => (
//               visibleColumns[header] && (
//                 <th key={header} className="px-6 py-4 text-xs font-semibold text-[#858585] tracking-wider">
//                   <div className="flex items-center justify-between">
//                     <span>{header}</span>
//                     <div className="flex space-x-1 ml-2">
//                       <img src="/assets/filter.svg" alt="Sort" className="w-4 h-4" />
//                       <img src="/assets/verticalDots.svg" alt="Filter" className="w-4 h-4" />
//                     </div>
//                   </div>
//                 </th>
//               )
//             ))}
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {paginatedData.length > 0 ? (
//             paginatedData.map((claim) => (
//               <tr key={claim.id} className="hover:bg-gray-50">
//                 {visibleColumns['Vehicle Number'] && (
//                   <td className="px-6 py-2 whitespace-nowrap text-[#3C434A] text-[14px]">
//                     {claim.vehicleNumber}
//                   </td>
//                 )}
//                 {visibleColumns['Insurer'] && (
//                   <td className="px-6 py-2 whitespace-nowrap text-[#3C434A] text-[14px]">
//                     {claim.insurer}
//                   </td>
//                 )}
//                 {visibleColumns['Claim Amount'] && (
//                   <td className="px-6 py-2 whitespace-nowrap text-[#3C434A] text-[14px]">
//                     ${claim.claimAmount.toLocaleString()}
//                   </td>
//                 )}
//                 {visibleColumns['Created On'] && (
//                   <td className="px-6 py-2 whitespace-nowrap text-[#3C434A] text-[14px]">
//                     {claim.createdOn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                   </td>
//                 )}
//                 {visibleColumns['Claim Status'] && (
//                   <td className="px-6 py-2 whitespace-nowrap text-[14px]">
//                     <div className="flex items-center space-x-2">
//                       <span
//                         className={`w-2 h-2 rounded-full ${
//                           claim.claimStatus === 'Assessment Active'
//                             ? 'bg-[#28C76F]'
//                             : claim.claimStatus === 'Assessment Pending'
//                             ? 'bg-[#AE00ABEA]'
//                             : 'bg-[#28C76F]' // Assigned
//                         }`}
//                       ></span>
//                       <span
//                         className={`${
//                           claim.claimStatus === 'Assessment Active'
//                             ? 'text-[#28C76F]'
//                             : claim.claimStatus === 'Assessment Pending'
//                             ? 'text-[#AE00ABEA]'
//                             : 'text-[#28C76F]' // Assigned
//                         }`}
//                       >
//                         {claim.claimStatus}
//                       </span>
//                     </div>
//                   </td>
//                 )}
//                 {visibleColumns['Actions'] && (
//                   <td className="px-6 py-4 whitespace-nowrap text-[#3C434A] text-[14px]">
//                     <div className="flex justify-between items-center space-x-2 w-full">
//                       <button onClick={() => onViewClaim(claim.id)} className="text-blue-600 hover:underline">
//                         <img src="/assets/viewIcon.svg" alt="View" className="h-6 w-6" />
//                       </button>
//                     </div>
//                   </td>
//                 )}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td
//                 colSpan={Object.values(visibleColumns).filter(Boolean).length}
//                 className="px-6 py-2 text-center text-[#858585] text-[14px]"
//               >
//                 No claims found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="flex justify-between items-center px-4 pt-3 bg-white border-t border-gray-200">
//         <div className="text-[13px] text-[#A1A1AA]">
//           Showing <span>{startIndex + 1}</span> to <span>{endIndex}</span> of <span>{totalCount}</span> entries
//         </div>
//         <div className="flex items-center space-x-1">
//           <button
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`px-3 py-1 rounded-md border ${
//               currentPage === 1 ? 'border-[#4B465C14] text-[#6F6B7D] cursor-not-allowed' : 'border-gray-300 hover:bg-gray-100'
//             }`}
//           >
//             Previous
//           </button>
//           {getPageNumbers().map((page, idx) =>
//             page === '...' ? (
//               <span key={`dots-${idx}`} className="px-2 text-gray-500 select-none">...</span>
//             ) : (
//               <button
//                 key={page}
//                 onClick={() => onPageChange(Number(page))}
//                 className={`px-3 py-1 rounded-md border ${
//                   page === currentPage ? 'bg-[#000000] text-[#FFFFFF] border-[#000000]' : 'border-gray-300 hover:bg-gray-100'
//                 }`}
//               >
//                 {page}
//               </button>
//             )
//           )}
//           <button
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === lastPage}
//             className={`px-3 py-1 rounded-md border ${
//               currentPage === lastPage ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-gray-300 hover:bg-gray-100'
//             }`}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TableComponent;