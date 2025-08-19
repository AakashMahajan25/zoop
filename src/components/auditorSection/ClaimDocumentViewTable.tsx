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
  docName: string;
  collectionStatus: string;
  verificationStatus: string;
  uploadedBy: string;
  dueDate: string;
}

export interface AuditorTableProps {
  rowData: RowData[];
  onViewClick?: (docName: string) => void;
}

const ClaimDocumentViewTable: React.FC<AuditorTableProps> = ({
    rowData,
    onViewClick
}) => {
    const gridRef = useRef<AgGridReact<RowData>>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;


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



    const [colDefs] = useState<ColDef[]>([
        {
            headerName: 'Document Name',
            field: 'docName',
            flex:1,
            cellRenderer: (p: ICellRendererParams<RowData, string>) => (
                <div className="tableTextStyle mt-2 text-[16px]">
                    <span className="capitalize">{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'Collection Status',
            field: 'collectionStatus',
            flex:1,
            cellRenderer: (p: ICellRendererParams<RowData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span className="w-[8px] h-[8px] rounded-full bg-[#0AA7DC] mr-2 inline-block" />
                    <span className="capitalize text-[#0AA7DC] text-[16px]">{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'Verification Status',
            field: 'verificationStatus',
            flex:1,
            cellRenderer: (p: ICellRendererParams<RowData>) => {
                const verificationStatus = p.value!;
                return (
                    <div className="flex items-center px-4 py-2 capitalize gap-2 text-[16px]">
                        {verificationStatus !== 'error' && (
                        <img src="/assets/checkIcon.svg" alt="checkIcon" className="h-3" />
                      )}
                      {verificationStatus === 'error' && (
                        <img
                          src="/assets/errorIcon.svg"
                          className="w-5 h-5 text-gray-500"
                          alt="errorIcon"
                        />
                      )}
                      <span>{verificationStatus}</span>
                    </div>
                );
            }
        },
        {
            headerName: 'Uploaded By',
            field: 'uploadedBy',
            flex:1,
            cellRenderer: (p: ICellRendererParams<RowData, number>) => (
                <div className="tableTextStyle mt-2 text-[16px]">
                    <span>{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'Due Date',
            field: 'dueDate',
            cellRenderer: (p: ICellRendererParams<RowData, string>) => (
                <div className="tableTextStyle mt-2 text-[16px]">
                    <span>{dayjs(p.value).format('DD MMM, YYYY')}</span>
                </div>
            ),
        },
        {
            headerName: 'Actions',
            flex:1,
            cellRenderer: (p: ICellRendererParams<RowData>) => (
                <button
                    className="inline-flex items-center mt-3 px-3 py-1 rounded text-[#3C434A] cursor-pointer"
                    onClick={() => onViewClick?.(p.data!.docName)}
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
    // const filteredRows = useMemo(() => {
    //     return rowData.filter(row =>
    //         row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         row.id.toString().includes(searchTerm)
    //     );
    // }, [rowData, searchTerm]);

    

    return (
        <div style={{ height: "60dvh" }} className="rounded-sm">
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
                // onRowClicked={(params) => handleRowClick(params.data)}
            />
            
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4">
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
        </div>
    );
};

export default ClaimDocumentViewTable;