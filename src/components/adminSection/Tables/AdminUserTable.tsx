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

export interface AdminUserTableProps {
    rowData: RowData[];
    pageSize?: number;
    onRowClick?: (row: RowData) => void;
    onActionChange?: (id: number, action: RowData['userStatus']) => void;
}

export type RowData = {
  id: number,
  email: string,
  username: string,
  role: string,
  department: string,
  responsibility: string,
  zone: string,
  experience: number,
  profileCompleted: boolean,
  userStatus: 'Approved' | 'Pending' | 'Remove' | 'Rejected';
  rejectionReason: string | null,
  dueDate: string,
  lastUpdated: string,
  caseCount: number
};

// Create new GridExample component
const AdminUserTable: React.FC<AdminUserTableProps> = ({
    rowData,
    pageSize = 10,
    onRowClick,
    onActionChange,
}) => {
    const gridRef = useRef<AgGridReact<RowData>>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

      // for the dots menu:
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuRow, setMenuRow]         = useState<RowData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RowData | null>(null);
//FOR THE ACTION-DROPDOWN MENU ---
    const [actionAnchor, setActionAnchor] = useState<HTMLElement | null>(null);
  const [actionRow, setActionRow]       = useState<RowData | null>(null);
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

    const handleRowClick = useCallback((data: RowData) => {
        onRowClick?.(data);
    }, [onRowClick]);

     // open the little “▼” menu
  const openActionMenu = (e: React.MouseEvent<HTMLElement>, row: RowData) => {
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
  
  const onSelectAction = (newStatus: RowData["userStatus"]) => {
  if (!actionRow) {
    closeActionMenu();
    return;
  }
handleRowClick(actionRow)
  // if (newStatus === "Approved") {
  //   // Directly update status for approvals
  //   onActionChange?.(actionRow.id, newStatus);
  // } else if (newStatus === "Rejected") {
  //   // Just show details for rejections (don't update status)
  //   handleRowClick(actionRow);
  // }
  closeActionMenu();
};

     // open the menu for this row
  const openMenu = (e: React.MouseEvent<HTMLElement>, row: RowData) => {
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
            headerName: 'Email',
            field: 'email',
            minWidth: 200,
            cellRenderer: (p: ICellRendererParams<RowData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span>{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'User Name',
            field: 'username',
            cellRenderer: (p: ICellRendererParams<RowData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span>{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'Role',
            field: 'role',
            cellRenderer: (p: ICellRendererParams<RowData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span>{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'Ongoing Claims',
            field: 'caseCount',
            filter: 'agNumberColumnFilter',
            cellRenderer: (p: ICellRendererParams<RowData, number>) => (
                <div
                    className="flex items-center mt-4 font-geist font-medium text-[16px] leading-[24px] cursor-pointer"
                    style={{ color: '#3B03FF' }}
                //   onClick={e => { e.stopPropagation(); handleRowClick(p.data!); }}
                >
                    <span className="w-2 h-2 rounded-full bg-[#3B03FF] mr-2 inline-block" />
                    {p.value} Cases
                </div>
            ),
        },
        {
            headerName: 'Due Date',
            field: 'dueDate',
            cellRenderer: (p: ICellRendererParams<RowData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span>{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'Last Updated',
            field: 'lastUpdated',
            cellRenderer: (p: ICellRendererParams<RowData, string>) => (
                <div className="tableTextStyle flex items-center mt-2">
                    <span className="w-2 h-2 rounded-full mr-2 inline-block" style={{ background: 'var(--Grey-Pallette-Grey-500, #71717A)' }} />
                    {p.value}
                </div>
            ),
        },
        {
            headerName: 'Status',
            field: 'userStatus',
            cellRenderer: (p: ICellRendererParams<RowData, RowData['userStatus']>) => {
              const colorMap: Record<RowData['userStatus'], string> = {
                Approved: '#15803D',
                Pending: '#D97706',
                Remove: '#FF2B2F',
                Rejected: '#71717A',
              };

              return (
                <div
                  className="flex items-center mt-4 font-geist font-medium text-[16px] leading-[24px]"
                  //@ts-ignore
                  style={{ color: colorMap[p.value] || '#3B03FF' }}
                >
                  <span
                    className="w-2 h-2 rounded-full mr-2 inline-block"
                    //@ts-ignore
                    style={{ backgroundColor: colorMap[p.value] || '#3B03FF' }}
                  />
                  {p.value}
                </div>
              );
            },
          },
    {
  headerName: 'Action',
  field: 'userStatus',
  cellRenderer: (p: ICellRendererParams<RowData, string>) => {
    const { userStatus } = p.data!;

    const colorMap: Record<string, string> = {
      Approved: '#15803D',
      Pending: '#D97706',
      Remove: '#FF2B2F',
      Rejected: '#858585',
    };

    const labelMap: Record<string, string> = {
      Approved: 'Approve',
      Rejected: 'Reject',
      Remove: 'Remove',
      Pending: 'Pending',
    };

    const statusActionMap: Record<string, string[]> = {
      Approved: ['Remove'],
      Pending: ['Approved', 'Rejected'],
      Remove: ['Approved', 'Rejected'],
      Rejected: [],
    };

    const availableActions = statusActionMap[userStatus] || [];

    return (
      <div className="flex items-center justify-between mt-2">
        {userStatus === 'Rejected' ? (
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 border rounded text-sm font-medium"
              style={{ color: colorMap['Rejected'], opacity: 0.6 }}
            >
              Rejected
            </span>
            <img
              src="/assets/verticalDots.svg"
              alt="More options"
              className="cursor-pointer"
              onClick={(e) => openMenu(e, p.data!)}
            />
          </div>
        ) : (
          <div className="inline-flex rounded-md overflow-hidden border border-[#D4D4D8]">
            {/* Primary Action Button */}
            <button
              className="px-3 py-1 font-geist text-[14px] font-medium leading-[24px]"
              style={{
                color: colorMap[availableActions[0]],
                fontWeight: 500,
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                  // Show details for other actions
                  handleRowClick(p.data!);
              }}
            >
              {labelMap[availableActions[0]]}
            </button>

            {/* Dropdown for additional actions */}
            {availableActions.length > 1 && (
              <button
                className="px-2 py-1 flex items-center justify-center cursor-pointer"
                style={{ color: colorMap[availableActions[0]] }}
                onClick={(e) => openActionMenu(e, p.data!)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
  cellClass: "actions-button-cell",
}

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
            style={{ height: "55dvh" }}
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
      <Menu
        anchorEl={actionAnchor}
        open={!!actionAnchor}
        onClose={closeActionMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          style: { width: actionWidth, padding: 0, fontSize: '14px' },
          className: "border border-gray-200 shadow-lg z-50",
          elevation: 0,
        }}
        MenuListProps={{ className: "py-1" }}
      >
        {actionRow?.userStatus === "Pending" &&
          ["Approved", "Rejected"].map((opt) => (
            <button
              key={opt}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectAction(opt as any)}
            >
              {opt}
            </button>
          ))}
        {/* {actionRow?.userStatus === "Approved" &&
          ["Remove"].map((opt) => (
            <button
              key={opt}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => onSelectAction(opt as any)}
            >
              {opt}
            </button>
          ))} */}
      </Menu>
      {/* Three Dot menu */}
      <Menu
  anchorEl={menuAnchor}
  open={!!menuAnchor}
  onClose={closeMenu}
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  transformOrigin={{ vertical: "top",    horizontal: "right" }}
  PaperProps={{
    style: {fontSize: '14px' },
    className:
      "absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg z-50 p-0",
    elevation: 0,
  }}
  MenuListProps={{
    className: "py-1",
  }}
>
  <button
    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
    onClick={() => {
      handleMoreInfo();
      closeMenu();
    }}
  >
    More Info
  </button>
  <button
    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
    onClick={() => {
      handleDelete();
      closeMenu();
    }}
  >
    Delete
  </button>
</Menu>


      {/* DELETE Confirmation */}
      {deleteTarget && (
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
      )}
        </div>
    );
};
export default AdminUserTable;
