import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ClaimsDetailsView from '../ClaimsDetailsView';
import Link from 'next/link';
import IntimationListTable, { RowData } from './Tables/IntimationListTable';
import { getClaims, getInitiatedClaims, getAssignedClaims, GetClaimsParams } from '@/utils/getClaims';
import { deleteClaim } from '@/utils/deleteClaim';

interface Handler {
  name: string;
  pinCode: number;
  outGoingClaims: number;
}

const ClaimsDashboard: React.FC = () => {
  const [allClaims, setAllClaims] = useState<RowData[]>([]);
  const [handlers, setHandlers] = useState<Handler[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<RowData[]>([]);
  const [activeStatusFilter, setActiveStatusFilter] = useState<'assigned' | 'reallocate' | 'draft' | 'dueToday' | 'pastDue' | ''>('');
  const [activeTab, setActiveTab] = useState<'cases' | 'status'>('cases');
  // Remove currentPage state since IntimationListTable handles pagination
  const [selectedClaim, setSelectedClaim] = useState<RowData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedHandler, setSelectedHandler] = useState<Handler | null>(null);
  const [modalConfirmScreen, setModalConfirmScreen] = useState<boolean>(false);
  const [claimsDetails, setClaimsDetails] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<RowData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  // Remove rowsPerPage constant since we're no longer using client-side pagination

  const fetchClaims = async () => {
  setIsLoading(true);
  try {
    const response = await getClaims();

    if (response.status === 401) {
      router.push("/");
      return;
    }

    const apiData = response.data || [];
    console.log(apiData, "apiData");

    const mappedClaims: RowData[] = apiData
      //@ts-ignore
      .filter((item: any) => item.status !== "deleted")
      .map((item: any) => ({
        id: item.id,
        claimNumber: item.reference_id,
        vehicleNumber: item.insurerInformation?.vehicleNo || "N/A",
        insurer:
          item.workshopDetails?.workshopName ||
          item.policyDetails?.insurer ||
          "ABC Insurance",
        placeOfLoss:
          item.workshopDetails?.state ||
          item.workshopDetails?.addressLine1 ||
          item.policyDetails?.placeOfIncident ||
          "Unknown",
        dueDate: item.created_at.split("T")[0],
        caseCount: 1,
        claimStatus: mapApiStatusToClaimStatus(item.status),
        handler: item.allocation?.allocatedTo || "Unassigned",
        referenceNumber: item.reference_id,
      }));

    const handlerMap: { [key: string]: Handler } = {};
    mappedClaims.forEach((claim) => {
      if (claim.handler && claim.handler !== "Unassigned") {
        if (!handlerMap[claim.handler]) {
          //@ts-ignore
          const matchingItem = apiData.find(
            (dataItem: any) =>
              dataItem.allocation?.allocatedTo === claim.handler
          );
          handlerMap[claim.handler] = {
            name: claim.handler,
            pinCode: parseInt(
              matchingItem?.allocation?.workshopPincode || "400000",
              10
            ),
            outGoingClaims: 0,
          };
        }
        handlerMap[claim.handler].outGoingClaims += 1;
      }
    });

    const handlersList = Object.values(handlerMap);

    setAllClaims(mappedClaims);
    setFilteredClaims(mappedClaims);
    setHandlers(handlersList);
  } catch (error: any) {
    console.log(error.response, "error");
    if (error?.response?.status === 401) {
      router.push("/");
    } else {
      console.error("Error fetching claims data:", error);
    }
  } finally {
    setIsLoading(false);
  }
};

// Data fetching function for IntimationListTable
const fetchTableData = async (params: {
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: RowData[]; total: number; page: number; pageSize: number; totalPages: number }> => {
  try {
    let response;
    
    if (activeTab === 'status') {
      // For Initiated tab, fetch claims with status 'submitted'
      response = await getInitiatedClaims(params);
    } else {
      // For main tab, fetch all claims
      response = await getClaims(params);
    }
    
    if (response.status === 401) {
      router.push("/");
      return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }

    const apiData = (response as any).data || [];
    const paginationData = (response as any).data || {};
    
    const mappedClaims: RowData[] = apiData
      .filter((item: any) => item.status !== "deleted")
      .map((item: any) => ({
        id: item.id,
        claimNumber: item.reference_id,
        vehicleNumber: item.insurerInformation?.vehicleNo || "N/A",
        insurer:
          item.workshopDetails?.workshopName ||
          item.policyDetails?.insurer ||
          "ABC Insurance",
        placeOfLoss:
          item.workshopDetails?.state ||
          item.workshopDetails?.addressLine1 ||
          item.policyDetails?.placeOfIncident ||
          "Unknown",
        dueDate: item.created_at.split("T")[0],
        caseCount: 1,
        claimStatus: mapApiStatusToClaimStatus(item.status),
        handler: item.allocation?.allocatedTo || "Unassigned",
        referenceNumber: item.reference_id,
      }));
    
    // Extract pagination metadata from response
    const total = (response as any).total || mappedClaims.length;
    const page = (response as any).page || 1;
    const pageSize = (response as any).pageSize || 10;
    const totalPages = (response as any).totalPages || Math.ceil(total / pageSize);
    
    return {
      data: mappedClaims,
      total,
      page,
      pageSize,
      totalPages
    };
  } catch (error: any) {
    console.error("Error fetching table data:", error);
    return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
  }
};

useEffect(() => {
  fetchClaims();
}, []);

  const mapApiStatusToClaimStatus = (apiStatus: string): string => {
    // Return the API status as-is, just capitalize first letter
    return apiStatus.charAt(0).toUpperCase() + apiStatus.slice(1).toLowerCase();
  };

  const dueTodayClaims = allClaims.filter(row => row.dueDate === today && row.claimStatus === 'Draft').length;
  const draftClaims = allClaims.filter(row => row.claimStatus === 'Draft').length;
  const reallocateClaims = allClaims.filter(row => ['In_review', 'Rejected'].includes(row.claimStatus)).length;
  const assignedClaims = allClaims.filter(row => row.claimStatus === 'Approved').length;
  const pastDueClaims = allClaims.filter(row => row.dueDate < today && row.claimStatus === 'Draft').length;

  const totalCount = filteredClaims.length;
  // Remove client-side pagination since IntimationListTable handles it with server-side filtering
  const paginatedClaims = filteredClaims;

  const allColumns = [
    'Claim Number',
    'Vehicle Number',
    'Insurer',
    'Place of Loss',
    'Due Date',
    'Claim Status',
    'Actions',
  ];

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    Object.fromEntries(allColumns.map((col) => [col, true]))
  );

  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const filteredHandlers = handlers
    .filter(handler => handler.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleStatusFilterClick = (filterType: 'assigned' | 'reallocate' | 'draft' | 'dueToday' | 'pastDue') => {
    if (activeStatusFilter === filterType) {
      setActiveStatusFilter('');
      setFilteredClaims(allClaims);
      // setCurrentPage(1); // This line is removed
      return;
    }
    setActiveStatusFilter(filterType);
    // setCurrentPage(1); // This line is removed
    switch (filterType) {
      case 'dueToday':
        setFilteredClaims(allClaims.filter(row => row.dueDate === today && row.claimStatus === 'Draft'));
        break;
      case 'draft':
        setFilteredClaims(allClaims.filter(row => row.claimStatus === 'Draft'));
        break;
             case 'reallocate':
         setFilteredClaims(allClaims.filter(row => ['In_review', 'Rejected'].includes(row.claimStatus)));
         break;
       case 'assigned':
         setFilteredClaims(allClaims.filter(row => row.claimStatus === 'Approved'));
         break;
      case 'pastDue':
        setFilteredClaims(allClaims.filter(row => row.dueDate < today && row.claimStatus === 'Draft'));
        break;
    }
  };


  const handleRowClick = (claim: RowData) => {
    setClaimsDetails(true);
    setSelectedClaim(claim);
  };

  const handleModal = (claim: RowData) => {
    setClaimsDetails(false);
    setSelectedClaim(claim);
  };

  const closeModal = () => {
    setSelectedClaim(null);
    setSearchTerm('');
    setSortOrder('asc');
    setSelectedHandler(null);
    setModalConfirmScreen(false);
    setCancelReason('');
  };

  const handleConfirm = () => {
         if (selectedClaim && selectedHandler && (selectedClaim.claimStatus === 'In_review' || selectedClaim.claimStatus === 'Rejected')) {
      const updatedClaims = allClaims.map(claim =>
        claim.id === selectedClaim.id
          ? { ...claim, claimStatus: 'Assigned', handler: selectedHandler.name }
          : claim
      );
      setAllClaims(updatedClaims);
      setFilteredClaims(updatedClaims.filter(row => {
        switch (activeStatusFilter) {
          case 'dueToday':
            return row.dueDate === today && row.claimStatus === 'Draft';
          case 'draft':
            return row.claimStatus === 'Draft';
          case 'reallocate':
            return row.claimStatus === 'In_review';
          case 'assigned':
            return row.claimStatus === 'Approved';
          case 'pastDue':
            return row.dueDate < today && row.claimStatus === 'Draft';
          default:
            return true;
        }
      }));
      setModalConfirmScreen(true);
      closeModal();
    }
  };

  const confirmDelete = async () => {
  if (!deleteTarget) return;
  try {
    await deleteClaim(deleteTarget.id);
    await fetchClaims();
  } catch (error) {
    console.error("Delete failed:", error);
  } finally {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  }
};

  const getActionButton = (claim: RowData) => {
    const handleButtonClick = () => {
      if (claim.claimStatus === 'Draft') {
        router.push('/register-claims');
      } else if (claim.claimStatus === 'In_review' || claim.claimStatus === 'Rejected' || claim.claimStatus === 'Approved') {
        handleModal(claim);
      }
    };

    switch (claim.claimStatus) {
      case 'Draft':
        return (
          <button
            className="inline-flex items-center border border-[#D4D4D8] px-3 py-1 rounded font-medium text-gray-600"
            aria-label={`Resume claim ${claim.claimNumber}`}
            onClick={handleButtonClick}
          >
            Resume
          </button>
        );
             case 'In_review':
       case 'Rejected':
         return (
           <button
             className="inline-flex items-center border border-[#D4D4D8] px-3 py-1 rounded font-medium text-green-600 gap-2"
             aria-label={`Approve claim ${claim.claimNumber}`}
             onClick={handleButtonClick}
           >
             Approve
             <span className="border border-[#D4D4D8] h-3"></span>
             <img src="/assets/leftArrow.svg" alt="" className="rotate-270" />
           </button>
         );
      default:
        return null;
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : (
        <>
          {!claimsDetails && (
            <div className="p-4 px-7 py-4 space-y-4 text-[#333333] font-geist bg-[#FBFBFB]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[24px] font-medium text-[#333333] mb-6">Claims View</h2>
                <button
                  className="bg-black text-white px-4 rounded-md text-[12px] flex items-center gap-2 cursor-pointer transition-colors"
                  aria-label="Create new claim"
                  onClick={() => router.push('/register-claims')}
                >
                  New Claim
                  <span className="text-emerald-400 text-[25px] font-light">+</span>
                </button>
              </div>

              <div className="mb-6 border-b border-gray-200">
                <div className="flex space-x-8">
                  <button
                    onClick={() => {
                      setActiveTab('cases');
                      setFilteredClaims(allClaims);
                      setActiveStatusFilter('');
                    }}
                    className={`py-2 px-3 border-b-2 font-medium text-[16px] cursor-pointer ${
                      activeTab === 'cases'
                        ? 'border-[#21FF91] text-[#3A6048] font-semibold'
                        : 'border-transparent text-[#858585] hover:text-[#858585] hover:border-[#858585]'
                    }`}
                    aria-label="View action required cases"
                  >
                    Action Required
                    {/* <span className="p-[1px] px-2 mx-2 bg-[#618CF01A] text-[#618CF0] rounded-lg font-normal">{dueTodayClaims}</span> */}
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('status');
                      setFilteredClaims(allClaims);
                    }}
                    className={`py-2 px-3 border-b-2 font-medium text-[16px] cursor-pointer ${
                      activeTab === 'status'
                        ? 'border-[#21FF91] text-[#3A6048] font-semibold'
                        : 'border-transparent text-[#858585] hover:text-[#858585] hover:border-[#858585]'
                    }`}
                    aria-label="View initiated cases"
                  >
                    Initiated
                  </button>
                </div>
              </div>

              {/* {activeTab === 'cases' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div
                    onClick={() => handleStatusFilterClick('dueToday')}
                    className={`bg-white rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-4 border ${
                      activeStatusFilter === 'dueToday' ? 'border-[#FF9F43]' : 'border-gray-200'
                    } cursor-pointer transition-shadow relative`}
                    role="button"
                    aria-label="Filter by due today claims"
                  >
                    <div className="relative z-10">
                      <p className="text-[24px] font-bold text-[#3C434A]">{dueTodayClaims}</p>
                      <p className="text-[#A7AAAD] text-[16px]">Due Today</p>
                    </div>
                    <img src="/assets/fileIcon.svg" alt="" className="w-12 h-12 absolute top-2 right-2" />
                  </div>

                  <div
                    onClick={() => handleStatusFilterClick('draft')}
                    className={`bg-white rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-4 border ${
                      activeStatusFilter === 'draft' ? 'border-[#787C82]' : 'border-gray-200'
                    } cursor-pointer transition-shadow relative`}
                    role="button"
                    aria-label="Filter by draft claims"
                  >
                    <div className="relative z-10">
                      <p className="text-[24px] font-bold text-[#3C434A]">{draftClaims}</p>
                      <p className="text-[#A7AAAD] text-[16px]">Draft</p>
                    </div>
                    <img src="/assets/fileIconGray.svg" alt="" className="w-12 h-12 absolute top-2 right-2" />
                  </div>

                  <div
                    onClick={() => handleStatusFilterClick('reallocate')}
                    className={`bg-white rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-4 border ${
                      activeStatusFilter === 'reallocate' ? 'border-[#6235FF]' : 'border-gray-200'
                    } cursor-pointer transition-shadow relative`}
                    role="button"
                    aria-label="Filter by re-allocate claims"
                  >
                    <div className="relative z-10">
                      <p className="text-[24px] font-bold text-[#3C434A]">{reallocateClaims}</p>
                      <p className="text-[#A7AAAD] text-[16px]">Re-allocate</p>
                    </div>
                    <img src="/assets/fileBlue.svg" alt="" className="w-12 h-12 absolute top-2 right-2" />
                  </div>

                  <div
                    onClick={() => handleStatusFilterClick('pastDue')}
                    className={`bg-white rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-4 border ${
                      activeStatusFilter === 'pastDue' ? 'border-[#EA5455]' : 'border-gray-200'
                    } cursor-pointer transition-shadow relative`}
                    role="button"
                    aria-label="Filter by past due claims"
                  >
                    <div className="relative z-10">
                      <p className="text-[24px] font-bold text-[#3C434A]">{pastDueClaims}</p>
                      <p className="text-[#A7AAAD] text-[16px]">Past Due Date</p>
                    </div>
                    <img src="/assets/fileRed.svg" alt="" className="w-12 h-12 absolute top-2 right-2" />
                  </div>
                </div>
              )} */}

              <IntimationListTable
                rowData={paginatedClaims}
                onRowClick={handleRowClick}
                handleModal={handleModal}
                activeTab={activeTab}
                fetchData={fetchTableData}
                enableServerSideFiltering={true}
              />

              {selectedClaim && !modalConfirmScreen && (
                <div className="fixed inset-0 bg-[#00000014] bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-[#FFFFFF] rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[20px] font-bold text-[#000000]">
                                                 {selectedClaim.claimStatus === 'Approved' ? 'Reject reallocation request' : 'Reallocate Handler'}
                      </h3>
                      <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close modal"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                                         <div
                       className={`grid ${selectedClaim.claimStatus === 'Approved' ? 'grid-cols-4' : 'grid-cols-3'} gap-4 mb-6 text-center`}
                       style={{ background: '#FAFAFA', textAlign: 'center' }}
                     >
                       {selectedClaim.claimStatus === 'Approved' && (
                        <div className="border-r border-[#E4E4E7]">
                          <p className="text-sm text-[#A1A1AA]">Current Handler</p>
                          <p className="text-[#3C434A]">{selectedClaim.handler}</p>
                        </div>
                      )}
                      <div className="border-r border-[#E4E4E7] px-4 py-4 bg-[#FAFAFA] text-left">
                        <p className="text-sm text-[#A1A1AA]">Claim No:</p>
                        <p className="text-[#3C434A] font-semibold">{selectedClaim.claimNumber}</p>
                      </div>
                      <div className="border-r border-[#E4E4E7] px-4 py-4 bg-[#FAFAFA]">
                        <p className="text-sm text-[#A1A1AA]">Area Pincode:</p>
                        <p className="text-[#3C434A] font-semibold">400054</p>
                      </div>
                      <div className="border-r border-[#E4E4E7] px-4 py-4 bg-[#FAFAFA]">
                        <p className="text-sm text-[#A1A1AA]">Vehicle Location</p>
                        <p className="text-[#3C434A] font-semibold">{selectedClaim.placeOfLoss}</p>
                      </div>
                    </div>

                    {selectedClaim.claimStatus !== 'Approved' && (
                      <>
                        {selectedClaim.handler && (
                          <div className="flex items-center justify-center gap-8 text-center mb-6">
                            <div>
                              <p className="text-sm text-[#A1A1AA]">Current Handler</p>
                              <p className="text-[#3C434A]">{selectedClaim.handler}</p>
                            </div>
                            <div className="gap-y-0">
                              <span className="text-[#16A34A] text-[10px]">Re-Allocate to</span>
                              <img src="/assets/reallocatearrow.svg" alt="reallocatearrow" className="h-3 w-auto" />
                            </div>
                            <div>
                              <p className="text-sm text-[#A1A1AA]">Re-Allocate To</p>
                              <p className="text-[#3C434A] font-medium">
                                {selectedHandler ? selectedHandler.name : 'Select a handler'}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="my-6">
                          <div className="flex text-[rgba(255, 255, 255, 0.7)] w-full gap-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <img src="/assets/searchIcon.svg" alt="search" className="h-[14px]" />
                            <input
                              type="text"
                              placeholder="Search name & ID"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              aria-label="Search handlers"
                              className="focus:outline-none w-full"
                            />
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-[#F4F4F5]">
                            <thead className="bg-[#FAFAFA]">
                              <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-[#858585] tracking-wider">
                                  <div className="flex items-center justify-between">
                                    <span>Claim Handler</span>
                                    <button
                                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                      className="text-[#858585] hover:text-blue-600 ml-2"
                                      aria-label={`Sort names ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                                    >
                                      {sortOrder === 'asc' ? '↑' : '↓'}
                                    </button>
                                  </div>
                                </th>
                                <th className="px-6 py-3 text-[12px] font-bold text-[#858585] tracking-wider">PIN Code</th>
                                <th className="px-6 py-3 text-xs font-semibold text-[#A1A1AA] tracking-wider">Ongoing Claims</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {filteredHandlers.length > 0 ? (
                                filteredHandlers.map((handler) => (
                                  <tr
                                    key={handler.pinCode}
                                    className={`hover:bg-gray-50 cursor-pointer ${
                                      selectedHandler?.pinCode === handler.pinCode ? 'bg-[#DCFCE7]' : ''
                                    }`}
                                    onClick={() => setSelectedHandler(handler)}
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-[#3C434A] text-[14px] font-medium">
                                      {handler.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-[#3C434A] text-[14px]">
                                      {handler.pinCode}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-[#3C434A] text-[14px]">
                                      {handler.outGoingClaims}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={3} className="px-6 py-4 text-center text-[#A1A1AA] text-[14px]">
                                    No handlers found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {selectedClaim.claimStatus === 'Approved' && (
                      <div className="flex flex-col gap-2 mb-16">
                        <label htmlFor="cancelReason" className="w-40 font-medium text-[#000000] text-[12px]">
                          Reason to Cancel <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="cancelReason"
                          type="text"
                          placeholder="Enter your comments"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        />
                      </div>
                    )}

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 rounded-md text-[#4B465C] border border-gray-200"
                      >
                        Close
                      </button>
                                             {selectedClaim.claimStatus !== 'Approved' ? (
                        <button
                          onClick={handleConfirm}
                          disabled={!selectedHandler}
                          className={`px-4 py-2 rounded-md text-white ${
                            selectedHandler ? 'bg-[#000000]' : 'bg-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setModalConfirmScreen(true);
                          }}
                          className="px-4 py-1 rounded-md text-white bg-[#DC2626]"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {modalConfirmScreen && selectedClaim && (
                <div className="fixed inset-0 bg-[#00000014] bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-[#FFFFFF] rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <button
                      onClick={() => {
                        setModalConfirmScreen(false);
                        closeModal();
                      }}
                      className="float-right text-gray-500 hover:text-gray-700"
                      aria-label="Close modal"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="flex flex-col items-center justify-center my-8">
                      <img
                        src={selectedClaim.claimStatus === 'Assigned' ? '/assets/handlerRejectIcon.svg' : '/assets/handlerSuccessIcon.svg'}
                        alt="handlerSuccessIcon"
                      />
                                             <h1 className="text-[#3C434A] text-[25px] font-bold">
                         {selectedClaim.claimStatus === 'Approved' ? 'Re-allocation request declined!' : 'Re-allocation done successfully!'}
                       </h1>
                       <p className="text-[#A1A1AA] text-[12px] font-medium">
                         You can locate this claim in the Initiated Tab for further info.
                       </p>
                     </div>
                     {selectedClaim.claimStatus !== 'Approved' && (
                      <div className="grid grid-cols-4 gap-4 mb-6 text-center" style={{ background: '#FAFAFA' }}>
                        <div>
                          <p className="text-sm text-[#16A34A]">Re-allocated to:</p>
                          <p className="text-[#3C434A]">{selectedHandler?.name || selectedClaim.handler}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#A1A1AA]">Claim Number</p>
                          <p className="text-[#3C434A]">{selectedClaim.claimNumber}</p>
                        </div>
                        <div className="border-x border-[#E4E4E7]">
                          <p className="text-sm text-[#A1A1AA]">Vehicle Number</p>
                          <p className="text-[#3C434A]">{selectedClaim.vehicleNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#A1A1AA]">Place of Loss</p>
                          <p className="text-[#3C434A]">{selectedClaim.placeOfLoss}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {showDeleteModal && deleteTarget && (
                <div className="fixed inset-0 bg-[#00000014] bg-opacity-50 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4 text-[#333]">Delete Claim?</h3>
                    <p className="mb-6 text-[#555]">
                      Are you sure you want to delete claim <strong>{deleteTarget.claimNumber}</strong>?
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 border rounded text-[#555] hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {claimsDetails && (
            <>
              <nav className="px-6 pt-6 flex items-center text-sm font-geist bg-[#FBFBFB]">
                <span
                  className="cursor-pointer text-[15px] text-[#999999] hover:underline"
                  onClick={() => {
                    setClaimsDetails(false);
                    setSelectedClaim(null);
                  }}
                >
                  Claims
                </span>
                <span className="mx-2 text-[#858585]">/</span>
                <span className="text-[#333333] text-[15px] font-medium">{selectedClaim?.claimNumber}</span>
              </nav>
              {selectedClaim && <ClaimsDetailsView selectedClaim={selectedClaim} />}
            </>
          )}
        </>
      )}
    </>
  );
};

export default ClaimsDashboard;