"use client";
// React Grid Logic
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
// Theme
import {
    ClientSideRowModelModule,
    ColDef,
    ModuleRegistry,
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
    ClientSideRowModelModule,
    RichSelectModule,
    AdvancedFilterModule,
    ColumnMenuModule,
    ContextMenuModule,
]);

interface RowData {
  id: number;
  name: string;
  quantity: number;
  insuranceProvider: string;
  claimHandler: string;
  status: string;
  amountApproved: number;
  fraudFlag: boolean;
}

export interface AuditorTableProps {
  setSelectedRow: (row: RowData | null) => void;
  viewDetailModal: (open: boolean) => void;
  searchTerm: string;
  rowData: RowData[];
}

const AgGridAuditorTable: React.FC<AuditorTableProps> = ({
    rowData,
    setSelectedRow,
    viewDetailModal,
    searchTerm,
}) => {
    const gridRef = useRef<AgGridReact<RowData>>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    // for the dots menu:
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [menuRow, setMenuRow] = useState<RowData | null>(null);

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
        setSelectedRow(data);
        viewDetailModal(true);
    }, [setSelectedRow, viewDetailModal]);

    const openMenu = (e: React.MouseEvent<HTMLElement>, row: RowData) => {
        e.stopPropagation();
        setMenuRow(row);
        setMenuAnchor(e.currentTarget);
    };

    const closeMenu = () => {
        setMenuAnchor(null);
        setMenuRow(null);
    };

    const getStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            estimateapproved: '#FF9F43',
            assessmentPending: '#AE00ABEA',
            draft: '#FF9F43',
            completed:"#28C76F",
            repaircompleted: '#3B03FF',
            finalReportSent: '#2D9095',
            dischargedapproved: '#1C0B58',
            reAllocate: '#3B03FF',
            assessmentactive:"#28C76F",
        };
        return statusColors[status] || 'black';
    };

          const STATUS_LABELS: Record<string, string> = {
        'estimateapproved':   'Estimate Approved',
        'assessmentPending':  'Assessment Pending',
        'draft':              'Draft',
        'completed' : 'Completed',
        'repaircompleted':    'Repair Completed',
        'finalReportSent':    'Final Report Sent',
        'dischargedapproved': 'Discharged Approved',
        'reAllocate':         'Re-allocate',
        'assessmentactive':   'Assessment Active',
};

    const [colDefs] = useState<ColDef[]>([
        {
            headerName: 'Insurance Provider',
            field: 'insuranceProvider',
            flex:1,
            cellRenderer: (p: ICellRendererParams<RowData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span className="capitalize">{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'Claim Handler',
            field: 'claimHandler',
            flex:1,
            cellRenderer: (p: ICellRendererParams<RowData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span className="capitalize">{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'Status',
            field: 'status',
            flex:1,
            cellRenderer: (p: ICellRendererParams<RowData>) => {
                const status = p.value!;
                const color = getStatusColor(status);
                return (
                    <div className="flex items-center px-4 py-2">
                        <span className="text-2xl mr-2" style={{ color, lineHeight: '0' }}>●</span>
                         <span style={{ color }} className="capitalize">{STATUS_LABELS[status]}</span>
                    </div>
                );
            }
        },
        {
            headerName: 'Amount Approved',
            field: 'amountApproved',
            flex:1,
            cellRenderer: (p: ICellRendererParams<RowData, number>) => (
                <div className="tableTextStyle mt-2">
                    <span>{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'Fraud Flag',
            field: 'fraudFlag',
            flex:1,
            cellRenderer: (p: ICellRendererParams<RowData, boolean>) => (
                <div className="tableTextStyle mt-2 capitalize">
                    <span>{p.value ? 'Yes' : 'No'}</span>
                </div>
            ),
        },
        {
            headerName: 'Actions',
            flex:1,
            cellRenderer: (p: ICellRendererParams<RowData>) => (
                <button
                    className="inline-flex items-center mt-3 px-3 py-1 rounded text-[#3C434A] cursor-pointer"
                    onClick={(e) => openMenu(e, p.data!)}
                >
                    <img src="/assets/viewIcon.svg" className="h-5 w-5" alt="Actions" />
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

    // Filter rows based on search term
    const filteredRows = useMemo(() => {
        return rowData.filter(row =>
            row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.id.toString().includes(searchTerm)
        );
    }, [rowData, searchTerm]);

    

    return (
        <div style={{ height: "60dvh" }} className="rounded-sm">
            <AgGridReact
                ref={gridRef}
                rowData={filteredRows}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={pageSize}
                onGridReady={onGridReady}
                onPaginationChanged={onPaginationChanged}
                suppressPaginationPanel={true}
                headerHeight={56}
                rowHeight={56}
                onRowClicked={(params) => handleRowClick(params.data)}
            />
            
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4">
                    <span className="font-geist text-[14px] text-[#333333]">
                        Showing {startRow} to {endRow} of {filteredRows.length} entries
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
                                classes += 'bg-black text-white border border-black cursor-pointer';
                            } else if (pg === currentPage + 1) {
                                classes += 'bg-[#F5F5F5] text-[#333333] border border-black cursor-pointer';
                            } else {
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
                            className={`px-3 py-1 rounded-md ${
                                currentPage === totalPages - 1
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-white text-[#333333] border border-black cursor-pointer'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Three Dot menu */}
            <Menu
                anchorEl={menuAnchor}
                open={!!menuAnchor}
                onClose={closeMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    className: "absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg z-50 p-0",
                    elevation: 0,
                }}
                MenuListProps={{
                    className: "py-1",
                }}
            >
                <MenuItem onClick={() => {
                    if (menuRow) handleRowClick(menuRow);
                    closeMenu();
                }}>
                    View Details
                </MenuItem>
            </Menu>
        </div>
    );
};

export default AgGridAuditorTable;