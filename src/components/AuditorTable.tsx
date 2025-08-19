'use client'
import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';

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

interface AuditorTableProps {
  setSelectedRow: (row: RowData | null) => void;
  viewDetailModal: (open: boolean) => void;
  searchTerm: string;
}

const AuditorTable: React.FC<AuditorTableProps> = ({ setSelectedRow, viewDetailModal, searchTerm }) => {
  const rows: RowData[] = useMemo(() => [
    {
      id: 1,
      name: 'John Doe',
      quantity: 10000,
      insuranceProvider: 'LIC',
      claimHandler: 'Handler A',
      status: 'approved',
      amountApproved: 7500,
      fraudFlag: false,
    },
    {
      id: 2,
      name: 'Jane Smith',
      quantity: 12000,
      insuranceProvider: 'HDFC Ergo',
      claimHandler: 'Handler B',
      status: 'assessmentPending',
      amountApproved: 0,
      fraudFlag: true,
    },
    {
      id: 3,
      name: 'Robert Johnson',
      quantity: 8000,
      insuranceProvider: 'ICICI Lombard',
      claimHandler: 'Handler C',
      status: 'draft',
      amountApproved: 0,
      fraudFlag: false,
    },
    {
      id: 4,
      name: 'Sarah Williams',
      quantity: 15000,
      insuranceProvider: 'Bajaj Allianz',
      claimHandler: 'Handler D',
      status: 'complete',
      amountApproved: 12000,
      fraudFlag: false,
    },
    {
      id: 5,
      name: 'Michael Brown',
      quantity: 9000,
      insuranceProvider: 'New India Assurance',
      claimHandler: 'Handler E',
      status: 'finalReportSent',
      amountApproved: 8500,
      fraudFlag: true,
    },
    {
      id: 6,
      name: 'Emily Davis',
      quantity: 11000,
      insuranceProvider: 'United India',
      claimHandler: 'Handler F',
      status: 'discharged',
      amountApproved: 9500,
      fraudFlag: false,
    },
    {
      id: 7,
      name: 'David Wilson',
      quantity: 13000,
      insuranceProvider: 'Oriental Insurance',
      claimHandler: 'Handler G',
      status: 'reAllocate',
      amountApproved: 0,
      fraudFlag: true,
    },
  ], []);

  const [sortField, setSortField] = useState<keyof RowData>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (field: keyof RowData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredRows = useMemo(() => {
    return rows.filter(row =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.id.toString().includes(searchTerm)
    );
  }, [rows, searchTerm]);

  const totalCount = filteredRows.length;
  const pageSize = 10;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);
  const lastPage = Math.ceil(totalCount / pageSize);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortField, sortDirection]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > lastPage) return;
    setCurrentPage(page);
  };

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage]);

  const handleRowClick = (row: RowData) => {
    setSelectedRow(row);
    viewDetailModal(true);
  };

  const showOptions = (row: RowData, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Showing options for row:', row);
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      approved: '#28C76F',
      assessmentPending: '#AE00ABEA',
      draft: '#FF9F43',
      complete: 'green',
      finalReportSent: '#2D9095',
      discharged: '#1C0B58',
      reAllocate: '#3B03FF',
    };
    return statusColors[status] || 'black';
  };

  const getPageNumbers = () => {
    if (lastPage <= 7) {
      return [...Array(lastPage).keys()].map(x => x + 1);
    }
    const pages: (number | string)[] = [1];
    if (currentPage > 3) pages.push('...');
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(lastPage - 1, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (currentPage < lastPage - 2) pages.push('...');
    pages.push(lastPage);
    return pages;
  };

  return (
    <>
      <Box sx={{ overflowX: 'auto', marginInline: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #EFEFEFE5' }}>
          <thead>
            <tr style={{
              backgroundColor: '#FBFBFB',
              display: 'table-row',
              color: '#858585',
              fontSize: '14px',
              fontWeight: 400,
            }}>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'table-cell',
                width: '80px'
              }} onClick={() => handleSort('id')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  ID
                  {sortField === 'id' && (
                    sortDirection === 'asc'
                      ? <img src='../assets/leftArrow.svg' alt="asc" style={{ transform: 'rotate(90deg)', width: '12px', height: '12px' }} />
                      : <img src='../assets/leftArrow.svg' alt="desc" style={{ transform: 'rotate(270deg)', width: '12px', height: '12px' }} />
                  )}
                </div>
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'table-cell',
                width: '150px'
              }} onClick={() => handleSort('name')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Name
                  {sortField === 'name' && (
                    sortDirection === 'asc'
                      ? <img src='../assets/leftArrow.svg' alt="asc" style={{ transform: 'rotate(90deg)', width: '12px', height: '12px' }} />
                      : <img src='../assets/leftArrow.svg' alt="desc" style={{ transform: 'rotate(270deg)', width: '12px', height: '12px' }} />
                  )}
                </div>
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'table-cell',
                width: '120px'
              }} onClick={() => handleSort('quantity')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Quantity
                  {sortField === 'quantity' && (
                    sortDirection === 'asc'
                      ? <img src='../assets/leftArrow.svg' alt="asc" style={{ transform: 'rotate(90deg)', width: '12px', height: '12px' }} />
                      : <img src='../assets/leftArrow.svg' alt="desc" style={{ transform: 'rotate(270deg)', width: '12px', height: '12px' }} />
                  )}
                </div>
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'table-cell',
                width: '200px'
              }} onClick={() => handleSort('insuranceProvider')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Insurance Provider
                  {sortField === 'insuranceProvider' && (
                    sortDirection === 'asc'
                      ? <img src='../assets/leftArrow.svg' alt="asc" style={{ transform: 'rotate(90deg)', width: '12px', height: '12px' }} />
                      : <img src='../assets/leftArrow.svg' alt="desc" style={{ transform: 'rotate(270deg)', width: '12px', height: '12px' }} />
                  )}
                </div>
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'table-cell',
                width: '150px'
              }} onClick={() => handleSort('claimHandler')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Claim Handler
                  {sortField === 'claimHandler' && (
                    sortDirection === 'asc'
                      ? <img src='../assets/leftArrow.svg' alt="asc" style={{ transform: 'rotate(90deg)', width: '12px', height: '12px' }} />
                      : <img src='../assets/leftArrow.svg' alt="desc" style={{ transform: 'rotate(270deg)', width: '12px', height: '12px' }} />
                  )}
                </div>
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'table-cell',
                width: '150px'
              }} onClick={() => handleSort('status')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Status
                  {sortField === 'status' && (
                    sortDirection === 'asc'
                      ? <img src='../assets/leftArrow.svg' alt="asc" style={{ transform: 'rotate(90deg)', width: '12px', height: '12px' }} />
                      : <img src='../assets/leftArrow.svg' alt="desc" style={{ transform: 'rotate(270deg)', width: '12px', height: '12px' }} />
                  )}
                </div>
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'table-cell',
                width: '150px'
              }} onClick={() => handleSort('amountApproved')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Amount Approved
                  {sortField === 'amountApproved' && (
                    sortDirection === 'asc'
                      ? <img src='../assets/leftArrow.svg' alt="asc" style={{ transform: 'rotate(90deg)', width: '12px', height: '12px' }} />
                      : <img src='../assets/leftArrow.svg' alt="desc" style={{ transform: 'rotate(270deg)', width: '12px', height: '12px' }} />
                  )}
                </div>
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'table-cell',
                width: '120px'
              }} onClick={() => handleSort('fraudFlag')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Fraud Flag
                  {sortField === 'fraudFlag' && (
                    sortDirection === 'asc'
                      ? <img src='../assets/leftArrow.svg' alt="asc" style={{ transform: 'rotate(90deg)', width: '12px', height: '12px' }} />
                      : <img src='../assets/leftArrow.svg' alt="desc" style={{ transform: 'rotate(270deg)', width: '12px', height: '12px' }} />
                  )}
                </div>
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                display: 'table-cell',
                width: '120px'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='text-[16px] text-[#5C5C5C]'>
            {paginatedRows.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row)}
                style={{
                  cursor: 'pointer',
                  borderBottom: '1px solid #EFEFEF'
                }}
                className="hover:bg-[#f9f9f9]"
              >
                <td className="capitalize p-[12px]">{row.id}</td>
                <td className="capitalize p-[12px]">{row.name}</td>
                <td className="capitalize p-[12px]">{row.quantity}</td>
                <td className="capitalize p-[12px]">{row.insuranceProvider}</td>
                <td className="capitalize p-[12px]">{row.claimHandler}</td>
                <td style={{ padding: '10px', color: getStatusColor(row.status) }} className="flex items-center gap-2 capitalize">
                  <span
                    className="text-2xl"
                    style={{ color: getStatusColor(row.status), lineHeight: '0' }}
                  >
                    ●
                  </span>
                  <span>{row.status}</span>
                </td>
                <td className="capitalize p-[12px]">{row.amountApproved}</td>
                <td className="capitalize p-[12px]">{row.fraudFlag ? 'Yes' : 'No'}</td>
                <td className="capitalize p-[12px]">
                  <button
                    onClick={(e) => showOptions(row, e)}
                    className='border border-[#7F7F7F] rounded-md p-[2px]'
                  >
                    <img src="/assets/verticalDots.svg" alt="Filter" className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200">
        <div className="text-[13px] text-[#858585]">
          Showing <span className="">{startItem}</span> to{" "}
          <span className="">{endItem}</span> of{" "}
          <span className="">{totalCount}</span> entries
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border ${currentPage === 1
              ? "cursor-not-allowed border-[#4B465C14] text-[#6F6B7D]"
              : "border-[#4B465C14] hover:bg-gray-100"
              }`}
          >
            Previous
          </button>
          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span key={`dots-${idx}`} className="px-2 text-gray-500 select-none">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(Number(page))}
                className={`px-3 py-1 rounded-md border ${page === currentPage
                  ? "bg-[#000000] text-[#FFFFFF] border-[#000000]"
                  : "border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
            className={`px-3 py-1 rounded-md border ${currentPage === lastPage
              ? "cursor-not-allowed border-gray-300 text-gray-400"
              : "border-gray-300 hover:bg-gray-100"
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AuditorTable;