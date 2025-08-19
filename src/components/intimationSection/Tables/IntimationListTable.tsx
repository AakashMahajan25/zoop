"use client";
// React Grid Logic
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Menu, MenuItem, Alert, Snackbar } from "@mui/material";
// Theme
import {
  ClientSideRowModelModule,
  ColDef,
  // IRichCellEditorParams,
  ModuleRegistry,
  RowSelectionOptions,
  TextEditorModule,
  ValidationModule,
  ValueFormatterParams,
  AllCommunityModule,
  GridReadyEvent,
  ICellRendererParams,
  PaginationChangedEvent,
} from "ag-grid-community";
// Core CSS
import { AgGridReact } from "ag-grid-react";
import {
  RichSelectModule,
  AdvancedFilterModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useRouter } from "next/navigation";
import { API_BASE_URL, authenticatedApiCall } from "@/utils/api";
import FilterDatePicker from "./FilterDatePicker";

// Extend dayjs with plugins
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  RichSelectModule,
  AllCommunityModule,
  ValidationModule,
  AdvancedFilterModule,
  ColumnMenuModule,
  ContextMenuModule,
]);

export interface IntimationListTableProps {
  rowData: RowData[];
  pageSize?: number;
  onRowClick?: (row: RowData) => void;
  handleModal?: (row: RowData) => void;
  onActionChange?: (id: number, action: RowData['claimStatus']) => void;
  activeTab?: string;
  // New props for modular data fetching
  fetchData?: (params: {
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => Promise<{ data: RowData[]; total: number; page: number; pageSize: number; totalPages: number }>;
  enableServerSideFiltering?: boolean;
}

export interface RowData {
  id: number;
  claimNumber: string;
  vehicleNumber: string;
  insurer: string;
  placeOfLoss: string;
  dueDate: string;
  caseCount: number;
  claimStatus: string;
  handler: string;
  referenceNumber: string;
}


const today = 'Today';
const yesterday = 'Yesterday';


// Create new GridExample component
const IntimationListTable: React.FC<IntimationListTableProps> = ({
  rowData,
  pageSize = 10,
  onRowClick,
  handleModal,
  onActionChange,
  activeTab,
  fetchData,
  enableServerSideFiltering = false
}) => {
  const router = useRouter();
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Date filter states
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Server-side data state
  const [serverSideData, setServerSideData] = useState<RowData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [serverPagination, setServerPagination] = useState<{
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>({ total: 0, page: 1, pageSize: 10, totalPages: 0 });

  // for the dots menu:
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuRow, setMenuRow] = useState<RowData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RowData | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  //FOR THE ACTION-DROPDOWN MENU ---
  const [actionAnchor, setActionAnchor] = useState<HTMLElement | null>(null);
  const [actionRow, setActionRow] = useState<RowData | null>(null);
  const [actionWidth, setActionWidth] = useState<number>(0);
  const [actionPosition, setActionPosition] = useState<{ top: number; left: number } | null>(null);


  // Cards - separate filtered data for table display
  const [selectedCardFilter, setSelectedCardFilter] = useState<string | null>(null);

  // Calculate card counts based on original rowData (not serverSideData)
  const cardCounts = useMemo(() => {
    const dataToUse = enableServerSideFiltering ? serverSideData : rowData;
    
    return {
      dueToday: dataToUse.filter(claim => {
        const dueDate = dayjs(claim.dueDate);
        const today = dayjs();
        return dueDate.isSame(today, 'day');
      }).length,
      draft: dataToUse.filter(claim => claim.claimStatus === 'Draft').length,
      reallocate: dataToUse.filter(claim => claim.claimStatus === 're-allocate').length,
      pastDueDate: dataToUse.filter(claim => {
        const dueDate = dayjs(claim.dueDate);
        const today = dayjs();
        return dueDate.isBefore(today, 'day');
      }).length
    };
  }, [enableServerSideFiltering, serverSideData, rowData]);

  

  // Alert state for error messages
  const [alertState, setAlertState] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'error'
  });

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const api = params.api;
    setTotalPages(api.paginationGetTotalPages());
    // Only set current page from ag-grid when not using server-side filtering
    if (!enableServerSideFiltering) {
      setCurrentPage(api.paginationGetCurrentPage());
    }
  }, [enableServerSideFiltering]);




  const onPaginationChanged = useCallback((params: PaginationChangedEvent) => {
    const api = params.api;
    // Only set current page from ag-grid when not using server-side filtering
    if (!enableServerSideFiltering) {
      setCurrentPage(api.paginationGetCurrentPage());
    }
    setTotalPages(api.paginationGetTotalPages());
  }, [enableServerSideFiltering]);

  const handleRowClick = useCallback((data: RowData) => {
    onRowClick?.(data);
  }, [onRowClick]);

  const handleActionClick = useCallback((data: RowData) => {
    handleModal?.(data);
  }, [handleModal])

  // Fetch data from server when server-side filtering is enabled
  const fetchServerData = useCallback(async () => {
    if (!fetchData || !enableServerSideFiltering) return;
    
    setIsLoadingData(true);
    try {
      const params = {
        // search: searchQuery.trim() || undefined, // Handle search client-side
        // startDate: startDate?.format('YYYY-MM-DD') || undefined, // Handle date filters client-side
        // endDate: endDate?.format('YYYY-MM-DD') || undefined, // Handle date filters client-side
        page: currentPage + 1, // API uses 1-based indexing, we use 0-based
        limit: pageSize
      };
      
      const response = await fetchData(params);
      setServerSideData(response.data);
              setServerPagination({
          total: response.total,
          page: response.page,
          pageSize: response.pageSize,
          totalPages: response.totalPages
        });
    } catch (error) {
      console.error('Error fetching server data:', error);
      setServerSideData([]);
      setServerPagination({ total: 0, page: 1, pageSize: 10, totalPages: 0 });
    } finally {
      setIsLoadingData(false);
    }
  }, [fetchData, enableServerSideFiltering, currentPage, pageSize]);

  // Effect to fetch server data when page changes or component mounts
  useEffect(() => {
    if (enableServerSideFiltering && fetchData) {
      fetchServerData();
    }
  }, [fetchServerData, enableServerSideFiltering]);

  // Note: Both search and date filters are now handled client-side for instant filtering

  // open the little "▼" menu
  const openActionMenu = (e: React.MouseEvent<HTMLElement>, row: RowData) => {
    e.preventDefault();
    e.stopPropagation();
    
    // measure the width of that "button+▼" container so the menu matches it
    const group = (e.currentTarget.closest(
      ".inline-flex"
    ) as HTMLElement | null);
    const groupRect = group?.getBoundingClientRect();
    const actionWidthValue = groupRect?.width ?? 150;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    setActionPosition({
      top: (groupRect?.bottom ?? 0) + scrollTop + 4,
      left: (groupRect?.left ?? 0) + scrollLeft
    });
    setActionWidth(actionWidthValue);
    setActionRow(row);
    setActionAnchor(e.currentTarget);
  };
  const closeActionMenu = () => {
    setActionAnchor(null);
    setActionRow(null);
    setActionPosition(null);
  };
  const onSelectAction = (newStatus: RowData["claimStatus"]) => {
    if (actionRow && newStatus === "Re-allocate") {
      onActionChange?.(actionRow.id, newStatus);
      handleActionClick({ ...actionRow, claimStatus: newStatus });
    }
    closeActionMenu();
  };
  // open the menu for this row
  const openMenu = (e: React.MouseEvent<HTMLElement>, row: RowData) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    setMenuPosition({
      top: rect.bottom + scrollTop + 4, // 4px below the button
      left: rect.right + scrollLeft - 128 // Align right edge of menu with right edge of button
    });
    setMenuRow(row);
    setMenuAnchor(e.currentTarget);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuRow(null);
    setMenuPosition(null);
  };

  // Handle escape key to close menus
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
        closeActionMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);


  // handle menu actions:
  const handleViewDetails = () => {
    if (menuRow) {
      router.push(`/claim-details/${menuRow.id}`);
    }
    closeMenu();
  };



  const handleDelete = () => {
    if (menuRow) setDeleteTarget(menuRow);
    closeMenu();
  };

  // Handle alert close
  const handleAlertClose = () => {
    setAlertState(prev => ({ ...prev, open: false }));
  };

  // Show alert helper
  const showAlert = (message: string, severity: 'error' | 'success' | 'warning' | 'info' = 'error') => {
    setAlertState({ open: true, message, severity });
  };

  const [colDefs] = useState<ColDef[]>([
    {
      headerName: 'Claim Number',
      field: 'claimNumber',
      minWidth: 200,
      cellRenderer: (p: ICellRendererParams<RowData, string>) => (
        <div className="tableTextStyle mt-2">
          <span>{p.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Vehicle Number',
      field: 'vehicleNumber',
      cellRenderer: (p: ICellRendererParams<RowData, string>) => (
        <div className="tableTextStyle mt-2">
          <span>{p.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Insurer',
      field: 'insurer',
      cellRenderer: (p: ICellRendererParams<RowData, string>) => (
        <div className="tableTextStyle mt-2">
          <span>{p.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Place of Loss',
      field: 'placeOfLoss',
      cellRenderer: (p: ICellRendererParams<RowData, string>) => (
        <div className="tableTextStyle mt-2">
          <span>{p.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Due Date',
      field: 'dueDate',
      cellRenderer: (p: ICellRendererParams<RowData, string>) => {
        const { id, dueDate } = p.data!;
        return (<div className={`tableTextStyle mt-2 ${dueDate === yesterday ? 'text-[#DC2626]' : 'text-[#858585]'} text-[14px] font-medium`}>
          <div className='flex items-center gap-1'>
            {dueDate === yesterday ? <img src='/assets/watchIcon.svg' alt='watchIcon' /> : null}
            {dueDate}
          </div>
        </div>)
      },
    },
    {
      headerName: 'Claim Status',
      field: 'claimStatus',
      cellRenderer: (p: ICellRendererParams<RowData, number>) => {
        const { id, claimStatus } = p.data!;
        return (<div
          className="flex items-center mt-4 font-geist font-medium text-[16px] leading-[24px] cursor-pointer"
          style={{ color: '#3B03FF' }}
        >
                     <span
             className={`w-2 h-2 rounded-full mr-2 ${claimStatus === 'Approved'
               ? 'bg-green-500'
               : claimStatus === 'In_review' || claimStatus === 'Rejected'
                 ? 'bg-[#3B03FF]'
                 : claimStatus === 'Draft'
                   ? 'bg-gray-500'
                   : claimStatus === 'Submitted'
                     ? 'bg-[#28C76F]'
                     : 'bg-gray-500'
               }`}
           > </span>
           <span
             className={`${claimStatus === 'Approved'
               ? 'text-green-600'
               : claimStatus === 'In_review' || claimStatus === 'Rejected'
                 ? 'text-[#3B03FF]'
                 : claimStatus === 'Draft'
                   ? 'text-gray-600'
                   : claimStatus === 'Submitted'
                     ? 'text-[#28C76F]'
                     : 'text-gray-600'
               }`}
           >
             {claimStatus}
           </span>
        </div>)
      },
    },
    {
      headerName: 'Action',
      field: 'claimStatus',
      minWidth: 200,
      cellRenderer: (p: ICellRendererParams<RowData>) => {
        const { claimStatus } = p.data!;
        const isApproved = claimStatus === 'Approved';
        const isDraft = claimStatus === 'Draft';
        const isInReview = claimStatus === 'In_review' || claimStatus === 'Rejected';

        const colorMap: Record<RowData['claimStatus'], string> = {
          Approved: '#3B82F6',
          Draft: '#3B82F6',
          'In_review': '#15803D',
          'Rejected': '#15803D',
        };



        const onResume = (e: React.MouseEvent) => {
          e.stopPropagation();
          router.push(`/register-claims?claimId=${p.data!.id}`);
        };

        // main button click
        const onMainClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          p.context.componentParent.onRowClick?.(p.data!);
        };

        return (
          <div className="flex items-center justify-between mt-2">
            <div className="inline-flex rounded-md overflow-hidden border border-[#D4D4D8]">
              {/* {isAssigned && (
            <button
              className="px-3 py-1 font-geist text-[14px] font-medium leading-[24px] hover:bg-gray-50"
              style={{ color: colorMap.Assigned }}
              onClick={onMainClick}
            >
              Assigned
            </button>
          )} */}

              {isDraft && (
                <button
                  className="px-3 py-1 font-geist text-[14px] font-medium leading-[24px] text-gray-600 cursor-pointer"
                  onClick={onResume}
                >
                  Resume
                </button>
              )}

                             {isInReview && (
                 <>
                   <button
                     className="px-3 py-1 font-geist text-[14px] font-medium leading-[24px] cursor-pointer"
                     style={{ color: colorMap['In_review'] }}
                     onClick={onMainClick}
                   >
                     Approve
                   </button>
                   <button
                     className="px-2 py-1 flex items-center justify-center cursor-pointer"
                     style={{ color: colorMap['In_review'] }}
                     onClick={(e) => openActionMenu(e, p.data!)}
                   >
                     <svg
                       className="w-4 h-4"
                       fill="none"
                       stroke="currentColor"
                       strokeWidth={2}
                       viewBox="0 0 24 24"
                     >
                       <path
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         d="M19 9l-7 7-7-7"
                       />
                     </svg>
                   </button>
                 </>
               )}
            </div>

            {/* right: three-dot menu */}
              <img
                src="/assets/verticalDots.svg"
                alt="More options"
                className="cursor-pointer h-5 w-5 mt-1 cursor-pointer"
                onClick={e => openMenu(e, p.data!)}
              />
          </div>
        );
      },
      cellClass: 'actions-button-cell',
    }


  ]);



  const [initiatedColDefs] = useState<ColDef[]>([
    {
      headerName: 'Claim Number',
      field: 'claimNumber',
      cellRenderer: (p: ICellRendererParams<RowData, string>) => (
        <div className="tableTextStyle mt-2">
          <span>{p.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Reference Number',
      field: 'referenceNumber',
      cellRenderer: (p: ICellRendererParams<RowData, string>) => (
        <div className="tableTextStyle mt-2">
          <span>{p.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Vehicle Number',
      field: 'vehicleNumber',
      cellRenderer: (p: ICellRendererParams<RowData, string>) => (
        <div className="tableTextStyle mt-2">
          <span>{p.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Insurer',
      field: 'insurer',
      cellRenderer: (p: ICellRendererParams<RowData, string>) => (
        <div className="tableTextStyle mt-2">
          <span>{p.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Place of Loss',
      field: 'placeOfLoss',
      cellRenderer: (p: ICellRendererParams<RowData, string>) => (
        <div className="tableTextStyle mt-2">
          <span>{p.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Due Date',
      field: 'dueDate',
      cellRenderer: (p: ICellRendererParams<RowData, string>) => {
        const { dueDate } = p.data!;
        return (
          <div className={`tableTextStyle mt-2 ${dueDate === yesterday ? 'text-[#DC2626]' : 'text-[#858585]'} text-[14px] font-medium`}>
            <div className='flex items-center gap-1'>
              {dueDate === yesterday ? <img src='/assets/watchIcon.svg' alt='watchIcon' /> : null}
              {dueDate}
            </div>
          </div>
        );
      },
    },
    {
      headerName: 'Claim Status',
      field: 'claimStatus',
             cellRenderer: (p: ICellRendererParams<RowData, string>) => {
         const { claimStatus } = p.data!;
         return (
           <div className="flex items-center mt-4 font-geist font-medium text-[16px] leading-[24px] cursor-pointer"
             style={{ color: '#3B03FF' }}>
             <span className={`w-2 h-2 rounded-full mr-2 ${claimStatus === 'Submitted' ? 'bg-[#28C76F]'
                 : claimStatus === 'In_review' ? 'bg-[#3B03FF]'
                   : claimStatus === 'Approved' ? 'bg-green-500'
                   : claimStatus === 'Draft' ? 'bg-gray-500'
                   : 'bg-gray-500'
               }`} />
             <span className={
               claimStatus === 'Submitted' ? 'text-[#28C76F]'
                 : claimStatus === 'In_review' ? 'text-[#3B03FF]'
                   : claimStatus === 'Approved' ? 'text-green-600'
                   : claimStatus === 'Draft' ? 'text-gray-600'
                   : 'text-gray-600'
             }>
               {claimStatus}
             </span>
           </div>
         );
       },
    },
    {
      headerName: 'Claim Handler',
      field: 'handler',
      cellRenderer: (p: ICellRendererParams<RowData, string>) => (
        <div className="tableTextStyle mt-2">
          <span>{p.value}</span>
        </div>
      ),
    },
    {
  headerName: 'Action',
  field: 'claimStatus',
  cellRenderer: (p: ICellRendererParams<RowData, string>) => (
    <div className="flex items-center justify-end mt-3">
      <img
        src="/assets/verticalDots.svg"
        alt="More options"
        className="cursor-pointer h-5 w-5"
        onClick={e => openMenu(e, p.data!)}
      />
    </div>
  ),
  cellClass: 'actions-button-cell',
},
  ]);
  const initiatedRowData: RowData[] = rowData.filter(claim => claim.claimStatus === 'Submitted');
  
  // For Action Required tab, exclude Submitted claims
  const actionRequiredRowData: RowData[] = rowData.filter(claim => claim.claimStatus !== 'Submitted');

  // Filter data based on date range, search query, and selected card filter
  const filteredRowData = useMemo(() => {
    // Start with the appropriate data source
    let filtered = enableServerSideFiltering ? serverSideData : rowData;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(row => 
        row.claimNumber.toLowerCase().includes(query) ||
        row.vehicleNumber.toLowerCase().includes(query) ||
        row.insurer.toLowerCase().includes(query) ||
        row.placeOfLoss.toLowerCase().includes(query) ||
        row.handler.toLowerCase().includes(query) ||
        row.referenceNumber.toLowerCase().includes(query)
      );
    }
    
    // Apply date filter
    if (startDate || endDate) {
      filtered = filtered.filter(row => {
        // Try multiple date formats since we're not sure of the exact format
        let dueDate = dayjs(row.dueDate, 'DD MMM, YYYY');
        if (!dueDate.isValid()) {
          dueDate = dayjs(row.dueDate, 'YYYY-MM-DD');
        }
        if (!dueDate.isValid()) {
          dueDate = dayjs(row.dueDate);
        }
        
        if (!dueDate.isValid()) {
          return false;
        }
        
        if (startDate && endDate) {
          return dueDate.isBetween(startDate, endDate, 'day', '[]');
        } else if (startDate) {
          return dueDate.isSameOrAfter(startDate, 'day');
        } else if (endDate) {
          return dueDate.isSameOrBefore(endDate, 'day');
        }
        
        return true;
      });
    }
    
    // Apply card filter if selected
    if (selectedCardFilter) {
      switch (selectedCardFilter) {
        case "dueToday":
          filtered = filtered.filter(claim => {
            const dueDate = dayjs(claim.dueDate);
            const today = dayjs();
            return dueDate.isSame(today, 'day');
          });
          break;
        case "draft":
          filtered = filtered.filter(claim => claim.claimStatus === 'Draft');
          break;
        case "reallocate":
          filtered = filtered.filter(claim => claim.claimStatus === 're-allocate');
          break;
        case "pastDueDate":
          filtered = filtered.filter(claim => {
            const dueDate = dayjs(claim.dueDate);
            const today = dayjs();
            return dueDate.isBefore(today, 'day');
          });
          break;
      }
    }
    
    return filtered;
  }, [rowData, searchQuery, startDate, endDate, enableServerSideFiltering, serverSideData, selectedCardFilter]);

  // Clear all filters
  const clearAllFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchQuery("");
    setSelectedCardFilter(null); // Clear card filter as well
    
    // Clear server-side data if using server-side filtering
    if (enableServerSideFiltering) {
      setCurrentPage(0); // Reset to first page
      // Don't clear data here - let the effect handle refetching
    }
  };

  // Apply settings across all columns
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      resizable: true,
      sortable: true,
      flex: 1,
    };
  }, []);
  // Use server-side pagination when available, otherwise fall back to client-side
  const effectiveTotalPages = enableServerSideFiltering ? serverPagination.totalPages : totalPages;
  const effectiveTotal = enableServerSideFiltering ? serverPagination.total : filteredRowData.length;
  const effectiveCurrentPage = enableServerSideFiltering ? serverPagination.page - 1 : currentPage; // Convert to 0-based
  
  const startRow = effectiveCurrentPage * pageSize + 1;
  const endRow = Math.min((effectiveCurrentPage + 1) * pageSize, effectiveTotal);

  const pageButtons = useMemo(() => {
    if (effectiveTotalPages <= 1) return [];
    const maxB = 5, half = Math.floor(maxB / 2);
    let start = Math.max(0, Math.min(effectiveCurrentPage - half, effectiveTotalPages - maxB));
    let end = Math.min(effectiveTotalPages - 1, start + maxB - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [effectiveCurrentPage, effectiveTotalPages]);
  


  // Handle card click to filter table data
  const handleCardClick = (cardType: string) => {
    // Set the selected card filter to filter the table
    setSelectedCardFilter(cardType === selectedCardFilter ? null : cardType);
  };

  // Container: Defines the grid's theme & dimensions.
  return (
    <div
      style={{
        height: activeTab !== "status" ? "45dvh" : "60dvh"
      }}
      className="rounded-sm bg-[#FBFBFB] relative"
    >

     {activeTab == 'cases' && (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div 
          onClick={() => handleCardClick("dueToday")} 
          className={`bg-white rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-4 border cursor-pointer transition-all relative ${
            selectedCardFilter === "dueToday" ? 'border-green-400 ring-2 ring-green-200' : 'border-gray-200 hover:shadow-md'
          }`}
        >
          <div className="relative z-10">
            <p className="text-[24px] font-bold text-[#3C434A]">{cardCounts.dueToday}</p>
            <p className="text-[#A7AAAD] text-[16px]">Due Today</p>
          </div>
          <img src="/assets/fileIcon.svg" alt="" className="w-12 h-12 absolute top-2 right-2" />
        </div>

        <div 
          onClick={() => handleCardClick("draft")} 
          className={`bg-white rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-4 border cursor-pointer transition-all relative ${
            selectedCardFilter === "draft" ? 'border-green-400 ring-2 ring-green-200' : 'border-gray-200 hover:shadow-md'
          }`}
        >
          <div className="relative z-10">
            <p className="text-[24px] font-bold text-[#3C434A]">{cardCounts.draft}</p>
            <p className="text-[#A7AAAD] text-[16px]">Draft</p>
          </div>
          <img src="/assets/fileIconGray.svg" alt="" className="w-12 h-12 absolute top-2 right-2" />
        </div>

        <div 
          onClick={() => handleCardClick("reallocate")} 
          className={`bg-white rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-4 border cursor-pointer transition-all relative ${
            selectedCardFilter === "reallocate" ? 'border-green-400 ring-2 ring-green-200' : 'border-gray-200 hover:shadow-md'
          }`}
        >
          <div className="relative z-10">
            <p className="text-[24px] font-bold text-[#3C434A]">{cardCounts.reallocate}</p>
            <p className="text-[#A7AAAD] text-[16px]">Re-allocate</p>
          </div>
          <img src="/assets/fileBlue.svg" alt="" className="w-12 h-12 absolute top-2 right-2" />
        </div>

        <div 
          onClick={() => handleCardClick("pastDueDate")} 
          className={`bg-white rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-4 border cursor-pointer transition-all relative ${
            selectedCardFilter === "pastDueDate" ? 'border-green-400 ring-2 ring-green-200' : 'border-gray-200 hover:shadow-md'
          }`}
        >
          <div className="relative z-10">
            <p className="text-[24px] font-bold text-[#3C434A]">{cardCounts.pastDueDate}</p>
            <p className="text-[#A7AAAD] text-[16px]">Past Due Date</p>
          </div>
          <img src="/assets/fileRed.svg" alt="" className="w-12 h-12 absolute top-2 right-2" />
        </div>
      </div>
     )}






      {/* Table Controls and Table */}
      <div className="flex flex-col h-full px-2">
                 {/* Controls Bar - Search, Date Filters, and Buttons */}
         <div className="flex justify-between items-center bg-white py-4 px-2 border-b border-gray-200">
           {/* Left side - Search Bar */}
           <div className="flex items-center gap-4">
             <div className="relative w-80">
               <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                 </svg>
               </span>
               <input
                 type="text"
                 placeholder="Search name & ID"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-12 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-base"
                 aria-label="Search name and ID"
               />
               {searchQuery && (
                 <button
                   onClick={() => setSearchQuery("")}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                   aria-label="Clear search"
                   type="button"
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               )}
             </div>
           </div>
           
           {/* Right side - Date Filters and Buttons */}
           <div className="flex items-center gap-4">
                           {/* Date Filters */}
              <div className="flex items-center gap-2">
                <FilterDatePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Start Date"
                />
              </div>
              <div className="flex items-center gap-2">
                <FilterDatePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="End Date"
                />
              </div>
             <button
               onClick={clearAllFilters}
               className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
             >
               Clear Filters
             </button>
             
             {/* Customize Columns Button */}
             <button
               onClick={() => {
                 if (gridRef.current?.api) {
                   gridRef.current.api.showColumnChooser();
                 }
               }}
               type="button"
               className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
               aria-label="Customize Columns"
             >
               <Image
                 src="/customize.svg"
                 alt="Customize Columns"
                 width={20}
                 height={20}
                 className="w-5 h-5 text-gray-400"
                 aria-hidden="true"
                 priority={false}
               />
               <span className="text-sm font-medium">Customize Columns</span>
             </button>
           </div>
         </div>

        {/* Table with white background and matching padding */}
        <div className="flex-1 min-h-0 px-2 bg-white relative">
          {isLoadingData && enableServerSideFiltering ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : (
                         <AgGridReact
               ref={gridRef}
                               rowData={enableServerSideFiltering ? 
                  (activeTab !== "status" ? filteredRowData.filter(claim => claim.claimStatus !== 'Submitted') : filteredRowData.filter(claim => claim.claimStatus === 'Submitted')) :
                  (activeTab !== "status" ? filteredRowData.filter(claim => claim.claimStatus !== 'Submitted') : filteredRowData.filter(claim => claim.claimStatus === 'Submitted'))
                }
               columnDefs={activeTab !== "status" ? colDefs : initiatedColDefs}
               defaultColDef={defaultColDef}
               pagination={true}
               paginationPageSize={pageSize}
               onGridReady={onGridReady}
               onPaginationChanged={onPaginationChanged}
               suppressPaginationPanel={true}
               headerHeight={56}
               rowHeight={56}
             />
          )}
        </div>
      </div>

             {/* Pagination - Always show when there's data */}
               {(enableServerSideFiltering ? serverSideData.length > 0 : filteredRowData.length > 0) && (
         <div className="flex items-center justify-between px-6 py-4 bg-[#FBFBFB]">
           <span className="font-geist text-[14px] text-[#333333]">
             Showing {startRow} to {endRow} of {effectiveTotal} entries
           </span>

          <div className="flex items-center space-x-1">
            {/* Previous */}
            <button
              onClick={() => {
                if (enableServerSideFiltering && effectiveCurrentPage > 0) {
                  setCurrentPage(effectiveCurrentPage - 1);
                } else if (!enableServerSideFiltering && gridRef.current?.api) {
                  gridRef.current.api.paginationGoToPreviousPage();
                }
              }}
              disabled={effectiveCurrentPage === 0 || effectiveTotalPages <= 1}
              className={`px-3 py-1 rounded-md border ${effectiveCurrentPage === 0 || effectiveTotalPages <= 1
                ? 'border-[#4B465C14] text-[#6F6B7D] cursor-not-allowed'
                : 'border-gray-300 hover:bg-gray-100 cursor-pointer'
                }`}
            >
              Previous
            </button>

            {/* Page buttons */}
            {effectiveTotalPages > 1 ? (
              pageButtons.map((pg) => {
                let classes = 'w-8 h-8 flex items-center justify-center rounded-md text-[14px] ';
                if (pg === effectiveCurrentPage) {
                  // current page: black
                  classes += 'bg-black text-white border border-black cursor-pointer';
                } else if (pg === effectiveCurrentPage + 1) {
                  // the very next page: grey background
                  classes += 'bg-[#F5F5F5] text-[#333333] border border-black cursor-pointer';
                } else {
                  // all other pages: white
                  classes += 'bg-white text-[#333333] border border-black cursor-pointer';
                }
                return (
                  <button
                    key={pg}
                    onClick={() => {
                      if (enableServerSideFiltering) {
                        setCurrentPage(pg);
                      } else if (gridRef.current?.api) {
                        gridRef.current.api.paginationGoToPage(pg);
                      }
                    }}
                    className={classes}
                  >
                    {pg + 1}
                  </button>
                );
              })
            ) : (
              <span className="px-3 py-1 text-sm text-gray-600">Page 1</span>
            )}

            {/* Next */}
            <button
              onClick={() => {
                if (enableServerSideFiltering && effectiveCurrentPage < effectiveTotalPages - 1) {
                  setCurrentPage(effectiveCurrentPage + 1);
                } else if (!enableServerSideFiltering && gridRef.current?.api) {
                  gridRef.current.api.paginationGoToNextPage();
                }
              }}
              disabled={effectiveCurrentPage === effectiveTotalPages - 1 || effectiveTotalPages <= 1}
              className={`px-3 py-1 rounded-md ${effectiveCurrentPage === effectiveTotalPages - 1 || effectiveTotalPages <= 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white text-[#333333] border border-black cursor-pointer'
                }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {/* --- ACTION DROPDOWN MENU --- */}
      {actionPosition && actionRow && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={closeActionMenu}
          />
          
          {/* Menu */}
          <div
            className="fixed z-[9999] bg-white border border-gray-200 shadow-lg rounded-md py-1"
            style={{
              top: `${actionPosition.top}px`,
              left: `${actionPosition.left}px`,
              width: `${actionWidth}px`,
            }}
          >
            {(actionRow?.claimStatus === "In_review" || actionRow?.claimStatus === "Rejected") &&
              ["Approve", "Reject", "Re-allocate"].map((opt) => (
                <button
                  key={opt}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 transition-colors text-sm"
                  onClick={() => onSelectAction(opt as any)}
                >
                  {opt}
                </button>
              ))}
          </div>
        </>
      )}
      {/* Three Dot menu */}
      {menuPosition && menuRow && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={closeMenu}
          />
          
          {/* Menu */}
          <div
            className="fixed z-[9999] bg-white border border-gray-200 shadow-lg rounded-md py-1 min-w-[128px]"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 transition-colors text-sm"
              onClick={() => {
                handleViewDetails();
                closeMenu();
              }}
            >
              View Details
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer transition-colors text-sm"
              onClick={() => {
                handleDelete();
                closeMenu();
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}

      {/* MUI Alert for error messages */}
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertState.severity}
          variant="filled"
          className="shadow-lg"
        >
          {alertState.message}
        </Alert>
      </Snackbar>

      {/* DELETE Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-[#00000014] bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-[#333]">Delete Claim?</h3>
            <p className="mb-6 text-[#555]">
              Are you sure you want to delete claim{' '}
              <strong>{deleteTarget.claimNumber}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border rounded text-[#555] cursor-pointer hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await authenticatedApiCall(`/intimation/${deleteTarget.id}`, {
                      method: 'DELETE',
                    });

                    // Refresh the page or update the table data
                    window.location.reload();
                  } catch (err: any) {
                    showAlert(`Error deleting claim: ${err.message}`, 'error');
                  } finally {
                    setDeleteTarget(null);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default IntimationListTable;