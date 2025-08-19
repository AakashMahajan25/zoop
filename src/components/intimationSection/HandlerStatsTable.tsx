// // HandlerStatsTable.tsx
// "use client";

// import React, { useMemo } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import {
//   ModuleRegistry,
//   ClientSideRowModelModule,
//   AllCommunityModule,
//   ColDef
// } from 'ag-grid-community';

// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

// // register the community modules we need
// ModuleRegistry.registerModules([
//   ClientSideRowModelModule,
//   AllCommunityModule,
// ]);

// interface HandlerStats {
//   handlerName: string;
//   claimsAssigned: number;
//   avgAssignmentTime: string;
// }

// const sampleData: HandlerStats[] = [
//   { handlerName: 'David Brown',   claimsAssigned:  7, avgAssignmentTime: '39m'   },
//   { handlerName: 'Alex Taylor',   claimsAssigned:  9, avgAssignmentTime: '42m'   },
//   { handlerName: 'Sarah Johnson', claimsAssigned: 12, avgAssignmentTime: '45m'   },
//   { handlerName: 'Tom Martinez',  claimsAssigned:  6, avgAssignmentTime: '55m'   },
//   { handlerName: 'Emily Davis',   claimsAssigned: 10, avgAssignmentTime: '58m'   },
//   { handlerName: 'Alex Taylor',   claimsAssigned:  2, avgAssignmentTime: '1h 05m'},
//   { handlerName: 'Emily Davis',   claimsAssigned:  3, avgAssignmentTime: '1h 10m'},
//   { handlerName: 'John Doe',      claimsAssigned: 15, avgAssignmentTime: '1h 15m'},
//   { handlerName: 'Sarah Johnson', claimsAssigned: 10, avgAssignmentTime: '1h 20m'},
//   { handlerName: 'Tom Martinez',  claimsAssigned: 13, avgAssignmentTime: '1h 30m'},
// ];

// export default function HandlerStatsTable() {
//   const columnDefs = useMemo<ColDef<HandlerStats>[]>(() => [
//     {
//       headerName: 'Handler Name',
//       field: 'handlerName',
//       flex: 1,
//       cellClass: 'tableTextStyle mt-2',
//     },
//     {
//       headerName: 'Claims Assigned',
//       field: 'claimsAssigned',
//       flex: 1,
//       type: 'numericColumn',
//       cellClass: 'tableTextStyle mt-2',
//     },
//     {
//       headerName: 'Avg Assignment Time',
//       field: 'avgAssignmentTime',
//       flex: 1,
//       cellClass: 'tableTextStyle mt-2',
//     },
//   ], []);

//   const defaultColDef = useMemo<ColDef>(() => ({
//     sortable: true,
//     resizable: true,
//     flex: 1,
//   }), []);

//   return (
//     <div
//       className="ag-theme-alpine rounded-sm"
//       style={{ width: '100%', height: '400px' }}
//     >
//       <AgGridReact<HandlerStats>
//         rowData={sampleData}
//         columnDefs={columnDefs}
//         defaultColDef={defaultColDef}
//         // plain sortable table—no pagination, no row-click selection
//         pagination={false}
//         suppressPaginationPanel={true}
//         suppressMenuHide={true}
//         headerHeight={56}
//         rowHeight={56}
//       />
//     </div>
//   );
// }
