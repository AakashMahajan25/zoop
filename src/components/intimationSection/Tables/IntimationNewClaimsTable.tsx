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
import { NewClaimsRowData } from "@/app/jsondata/intimationJsonData";
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

export interface IntimationNewClaimsTableProps {
    rowData: NewClaimsRowData[];
    pageSize?: number;
}



// Create new GridExample component
const IntimationNewClaimsTable: React.FC<IntimationNewClaimsTableProps> = ({
    rowData,
    pageSize = 10,
}) => {

    const [colDefs] = useState<ColDef[]>([
        {
            headerName: 'Subject',
            field: 'subject',
            minWidth: 200,
            cellRenderer: (p: ICellRendererParams<NewClaimsRowData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span>{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'From',
            field: 'from',
            cellRenderer: (p: ICellRendererParams<NewClaimsRowData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span>{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'To',
            field: 'to',
            cellRenderer: (p: ICellRendererParams<NewClaimsRowData, string>) => (
                <div className="tableTextStyle mt-2">
                    <span>{p.value}</span>
                </div>
            ),
        },
        {
            headerName: 'Due Date',
            field: 'dueDate',
            cellRenderer: (p: ICellRendererParams<NewClaimsRowData, string>) => (
                            <div className="tableTextStyle mt-2">
                                <span>{dayjs(p.value).format('DD MMM, YYYY')}</span>
                            </div>
                        ),
        },
        {
            headerName: 'Time',
            field: 'time',
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
    // Container: Defines the grid's theme & dimensions.
    return (
        <div
            style={{ height: "85dvh" }}
            className="rounded-sm"
        >
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                suppressPaginationPanel={true}
                headerHeight={56}
                rowHeight={56}
            />
        </div>
    );
};
export default IntimationNewClaimsTable;
