"use client";
// React Grid Logic
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
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

export interface AdminListTableProps {
    rowData: ClaimData[];
    pageSize?: number;
    onRowClick?: (row: ClaimData) => void;
    // onActionChange?: (id: number, action: ClaimData['ongoingClaims']) => void;
}

export type ClaimData = {
  id: number;
  vehicleNumber: string;
  insuranceProvider: string;
  claimAmount: number; // Changed to number
  claimStatus: 'Complete' | 'Paid Out' | 'Uploaded' | 'Rejected';
  dateSubmitted: string;
}

// Create new GridExample component
const AdminListTable: React.FC<AdminListTableProps> = ({
    rowData,
    pageSize = 10,
    onRowClick,
    // onActionChange,
}) => {
    const gridRef = useRef<AgGridReact<ClaimData>>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

      // for the dots menu:
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuRow, setMenuRow]         = useState<ClaimData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClaimData | null>(null);
//FOR THE ACTION-DROPDOWN MENU ---
    const [actionAnchor, setActionAnchor] = useState<HTMLElement | null>(null);
  const [actionRow, setActionRow]       = useState<ClaimData | null>(null);
  const [actionWidth, setActionWidth]   = useState<number>(0);

    const onGridReady = useCallback((params: GridReadyEvent) => {
        const api = params.api;
        setTotalPages(api.paginationGetTotalPages());
        setCurrentPage(api.paginationGetCurrentPage());
    }, []);


    const onPaginationChanged = useCallback((params: PaginationChangedEvent) => {
        const api = params.api;
        setCurrentPage(api.paginationGetCurrentPage());
        setTotalPages(api.paginationGetTotalPages());
    }, []);

    const handleRowClick = useCallback((data: ClaimData) => {
        onRowClick?.(data);
    }, [onRowClick]);

     // open the little “▼” menu
  const openActionMenu = (e: React.MouseEvent<HTMLElement>, row: ClaimData) => {
    e.stopPropagation();
    // measure the width of that “button+▼” container so the menu matches it
    const group = (e.currentTarget.closest(
      ".inline-flex"
    ) as HTMLElement | null);
    setActionWidth(group?.getBoundingClientRect().width ?? 0);
    setActionRow(row);
    setActionAnchor(e.currentTarget);
  };
  const closeActionMenu = () => {
    setActionAnchor(null);
    setActionRow(null);
  };
//     const onSelectAction = (newStatus: ClaimData["ongoingClaims"]) => {
//     if (actionRow) {
//       onActionChange?.(actionRow.id, newStatus);
//       handleRowClick({ ...actionRow, ongoingClaims: newStatus });
//     }
//     closeActionMenu();
//   };
     // open the menu for this row
  const openMenu = (e: React.MouseEvent<HTMLElement>, row: ClaimData) => {
    e.stopPropagation();
    setMenuRow(row);
    setMenuAnchor(e.currentTarget);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuRow(null);
  };

  // handle menu actions:
  const handleMoreInfo = () => {
    if (menuRow) handleRowClick(menuRow);
    closeMenu();
  };
  const handleDelete = () => {
    if (menuRow) setDeleteTarget(menuRow);
    closeMenu();
  };

    const [colDefs] = useState<ColDef[]>([
        {
            headerName: 'Vehicle Number',
            field: 'vehicleNumber',
            // maxWidth: 180,
            cellRenderer: (p: ICellRendererParams<ClaimData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span>{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'Insurance Provider',
            field: 'insuranceProvider',
            // maxWidth: 180,
            cellRenderer: (p: ICellRendererParams<ClaimData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span>{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'Claim Amount',
            field: 'claimAmount',
            // maxWidth: 180,
            cellRenderer: (p: ICellRendererParams<ClaimData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span>{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'Claim Status',
            field: 'claimStatus',
            // maxWidth: 180,
            flex: 1,
            cellRenderer: (p: ICellRendererParams<ClaimData>) => {
            const status = p.value!;
            const color =
                status === 'Complete' ? '#0AA7DC' :
                status === 'Paid Out' ? 'green' :
                status === 'Uploaded' ? '#AE00ABEA' :
                'red';
            return (
                <div className="flex items-center px-4 py-2">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }} />
                <span style={{ color }}>{status}</span>
                </div>
            );
            }
        },
        {
            headerName: 'Date Submitted',
            field: 'dateSubmitted',
            // maxWidth: 180,
            cellRenderer: (p: ICellRendererParams<ClaimData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span>{dayjs(p.value).format('DD MMM, YYYY')}</span>
                </div>
            ),
        },
        {
            headerName: 'Actions  ',
            flex: 1,
            cellRenderer: (p: ICellRendererParams<ClaimData>) => (
            <button
                className="inline-flex items-center mt-3 px-3 py-1 rounded text-[#3C434A] hover:bg-gray-50"
                onClick={() => {/* view logic */}}
            >
                <img src="/assets/viewIcon.svg" className="h-5 w-5" alt="View" />
            </button>
            ),
        },
    ]);
    // Apply settings across all columns
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            filter: true,
            resizable: true,
            sortable: true,
            flex: 1,
        };
    }, []);
    const startRow = currentPage * pageSize + 1;
    const endRow = Math.min((currentPage + 1) * pageSize, rowData.length);

    const pageButtons = useMemo(() => {
        const maxB = 5, half = Math.floor(maxB / 2);
        let start = Math.max(0, Math.min(currentPage - half, totalPages - maxB));
        let end = Math.min(totalPages - 1, start + maxB - 1);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [currentPage, totalPages]);
    // Container: Defines the grid's theme & dimensions.
    return (
        <div
            style={{ height: "60dvh" }}
            className="rounded-sm"
        >
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={pageSize}
                onGridReady={onGridReady}
                onPaginationChanged={onPaginationChanged}
                suppressPaginationPanel={true}
                headerHeight={56}
                rowHeight={56}
            />
            {totalPages > 1 && (<div className="flex items-center justify-between px-6 py-4">
                <span className="font-geist text-[14px] text-[#333333]">
                    Showing {startRow} to {endRow} of {rowData.length} entries
                </span>

                <div className="flex items-center space-x-1">
                    {/* Previous */}
                    <button
                        onClick={() => gridRef.current?.api.paginationGoToPreviousPage()}
                        disabled={currentPage === 0}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === 0
                    ? 'border-[#4B465C14] text-[#6F6B7D] cursor-not-allowed'
                    : 'border-gray-300 hover:bg-gray-100 cursor-pointer'
                }`}
                    >
                        Previous
                    </button>

                    {/* Page buttons */}
                    {pageButtons.map((pg) => {
                        let classes = 'w-8 h-8 flex items-center justify-center rounded-md text-[14px] ';
                        if (pg === currentPage) {
                            // current page: black
                            classes += 'bg-black text-white border border-black cursor-pointer';
                        } else if (pg === currentPage + 1) {
                            // the very next page: grey background
                            classes += 'bg-[#F5F5F5] text-[#333333] border border-black cursor-pointer';
                        } else {
                            // all other pages: white
                            classes += 'bg-white text-[#333333] border border-black cursor-pointer';
                        }
                        return (
                            <button
                                key={pg}
                                onClick={() => gridRef.current?.api.paginationGoToPage(pg)}
                                className={classes}
                            >
                                {pg + 1}
                            </button>
                        );
                    })}

                    {/* Next */}
                    <button
                        onClick={() => gridRef.current?.api.paginationGoToNextPage()}
                        disabled={currentPage === totalPages - 1}
                        className={`px-3 py-1 rounded-md ${currentPage === totalPages - 1
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-white text-[#333333] border border-black cursor-pointer'
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>)}
  {/* --- ACTION DROPDOWN MENU --- */}
      {/* <Menu
        anchorEl={actionAnchor}
        open={!!actionAnchor}
        onClose={closeActionMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          style: { width: actionWidth, padding: 0 },
          className: "border border-gray-200 shadow-lg z-50",
          elevation: 0,
        }}
        MenuListProps={{ className: "py-1" }}
      >
        {actionRow?.ongoingClaims === "Pending" &&
          ["Approved", "Rejected"].map((opt) => (
            <button
              key={opt}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => onSelectAction(opt as any)}
            >
              {opt}
            </button>
          ))}
      </Menu> */}
      {/* Three Dot menu */}
      <Menu
  anchorEl={menuAnchor}
  open={!!menuAnchor}
  onClose={closeMenu}
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  transformOrigin={{ vertical: "top",    horizontal: "right" }}
  PaperProps={{
    className:
      "absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg z-50 p-0",
    elevation: 0,
  }}
  MenuListProps={{
    className: "py-1",
  }}
>
  <button
    className="w-full text-left px-4 py-2 hover:bg-gray-100"
    onClick={() => {
      handleMoreInfo();
      closeMenu();
    }}
  >
    More Info
  </button>
  <button
    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
    onClick={() => {
      handleDelete();
      closeMenu();
    }}
  >
    Delete
  </button>
</Menu>


      {/* DELETE Confirmation */}
      {/* {deleteTarget && (
        <div className="fixed inset-0 bg-[#00000014] bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-[#333]"> Delete User?</h3>
            <p className="mb-6 text-[#555]">
                  Are you sure you want to delete user{' '}
                  <strong>{deleteTarget.username}</strong>?
                </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border rounded text-[#555] hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // do your delete logic...
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )} */}
        </div>
    );
};
export default AdminListTable;
