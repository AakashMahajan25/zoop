'use client';
import * as React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Box, Button, Dialog, Tabs, Tab, Checkbox } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs, { Dayjs } from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import { sampleData, allColumns, statusColors, UserData } from '@/app/jsondata/adminJsonData';
import { RowData } from './Tables/AdminUserTable';
import AdminTable from './Tables/AdminUserTable';
import axios, { AxiosError } from 'axios'
import { AdminUser, approveAdminUser, getAdminUsers, rejectAdminUser, removeAdminUser } from '@/utils/api';

// interface UserData {
//   caseCount: number;
//   id: number;
//   email: string;
//   username: string;
//   role: string;
//   ongoingClaims: 'Pending' | 'Approved' | 'Rejected' | 'Remove';
//   dueDate: string;
//   lastUpload: string;
// }

export default function AdminClaimsSection() {
  // const [rows, setRows] = React.useState<UserData[] >(sampleData);
  // replace your UserData state with RowData[]:
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState<AdminUser[]>([]);
  const [error, setError] = React.useState<string>('');
  const [selectedRow, setSelectedRow] = React.useState<RowData | null>(null);
  const [selectedCaseData, setSelectedCaseData] = React.useState<RowData | null>(null);
  const [currentTab, setCurrentTab] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showDropdown, setShowDropdown] = React.useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState<string>("");
  const [showReasonInput, setShowReasonInput] = React.useState(false);
  const pageSize = 10;
  const [startDate, setStartDate] = React.useState<Date | null>(dayjs('2025-05-01').toDate());
  const [endDate, setEndDate] = React.useState<Date | null>(dayjs('2025-12-31').toDate());
  const [showColumnSelector, setShowColumnSelector] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const [visibleColumns, setVisibleColumns] = React.useState(
    Object.fromEntries(allColumns.map(col => [col, true]))
  );
  const [tempVisibleColumns, setTempVisibleColumns] = React.useState({ ...visibleColumns });

  const onPageChange = (page: number) => {
    console.log("User changed to page:", page);
  };

  React.useEffect(() => {
    setLoading(true);
    const fetchUserList = async () => {
      try {
        const response = await getAdminUsers();
        setRows(response);
        console.log(response)
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error('Failed to fetch user list:', axiosError);
        if (axiosError.response) {
          setError(`Error: ${axiosError.response.status} - ${axiosError.response.statusText}`);
        } else if (axiosError.request) {
          setError('No response received from server (possibly CORS or network issue)');
        } else {
          setError('An unexpected error occurred');
        }
      }
    };
    fetchUserList();
    setLoading(false)
  }, [])

  const handlePageChange = (page: number) => {
    if (page < 1 || page > lastPage) return;
    setCurrentPage(page);
    onPageChange(page);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setCurrentPage(1); // Reset to first page on tab change
  };

  const handleRowClick = (row: RowData) => {
    setSelectedRow(row);
    setShowDropdown(null);
  };

  const handleCloseDialog = () => {
    setSelectedRow(null);
  };

  // Approve user (simple, no reason needed)
  const handleApproveUser = async (userId: number) => {
    if (!selectedRow) return;

    try {
      const response = await approveAdminUser(userId)

      if (response) {
        setRows(prev =>
          prev.map(user =>
            user.id === selectedRow?.id
              ? { ...user, userStatus: "Approved" }
              : user
          )
        );
        toast.success("User approved successfully");
      } else {
        toast.error("⚠️ Approval failed");
        console.error("Approval failed:");
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      toast.error("Approve request failed")
      console.error("Approve request failed", axiosError);
    } finally {
      handleCloseDialog();
    }
  };

  // Reject user (needs reason)
  const handleRejectUser = async (userId: number, reason: string) => {
    if (!selectedRow) return;

    try {
      const response = await rejectAdminUser(userId, reason);

      if (response) {
        setRows(prev =>
          prev.map(user =>
            user.id === selectedRow?.id
              ? { ...user, userStatus: "Rejected", rejectionReason: reason }
              : user
          )
        );
        toast.success("User Rejected Successfully");
      } else {
        toast.error("Rejection failed")
        console.error("Rejection failed:", response || "Unknown error");
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      toast.error("Reject Request Failed")
      console.error("Reject request failed", axiosError);
    } finally {
      handleCloseDialog();
    }
  };

  const tabLabelsWithCounts = React.useMemo(() => {
    const allCount = rows.length;
    const pendingCount = rows.filter(row => row.userStatus === 'Pending').length;
    const approvedCount = rows.filter(row => row.userStatus === 'Approved').length;
    const rejectedCount = rows.filter(row => row.userStatus === 'Rejected').length;

    return [
      { label: 'All', count: allCount },
      { label: 'Pending', count: pendingCount },
      { label: 'Approved', count: approvedCount },
      { label: 'Rejected', count: rejectedCount },
    ];
  }, [rows]);

  // Define filteredRows first
  const filteredRows = React.useMemo(() => {
    let filtered = rows;

    // ✅ filter by current tab (Pending / Approved / Rejected)
    if (currentTab !== 0) {
      const status = tabLabelsWithCounts[currentTab]?.label as
        | "Pending"
        | "Approved"
        | "Rejected"
        | undefined;
      if (status) {
        filtered = filtered.filter(row => row.userStatus === status);
      }
    }

    // ✅ filter by search (email or username)
    if (searchTerm) {
      filtered = filtered.filter(
        row =>
          row.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // ✅ filter by date range
    if (startDate || endDate) {
      filtered = filtered.filter(row => {
        // row.lastUpdated is "DDMMMYYYY" string → parse to Date
        let rowDate: Date | null = null;
        try {
          // Example: "21Feb2020" → "21 Feb 2020"
          const parsed = row.lastUpdated.replace(/(\d{2})([A-Za-z]{3})(\d{4})/, "$1 $2 $3");
          rowDate = new Date(parsed);
        } catch (e) {
          rowDate = null;
        }

        if (!rowDate) return false;
        if (startDate && rowDate < startDate) return false;
        if (endDate && rowDate > endDate) return false;
        return true;
      });
    }

    return filtered;
  }, [rows, currentTab, searchTerm, startDate, endDate, tabLabelsWithCounts]);

  // Define dependent calculations after filteredRows
  const totalCount = filteredRows.length; // Dynamic count based on filtered rows
  const lastPage = Math.ceil(totalCount / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const getPageNumbers = () => {
    if (lastPage <= 7) {
      return [...Array(lastPage).keys()].map((x) => x + 1);
    }

    const pages: (number | string)[] = [1];
    if (currentPage > 3) pages.push("...");

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(lastPage - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (currentPage < lastPage - 2) pages.push("...");
    pages.push(lastPage);

    return pages;
  };

  const paginatedRows = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, currentPage, pageSize]);

  const resetColumns = () => {
    const defaultColumns = Object.fromEntries(allColumns.map(col => [col, true]));
    setTempVisibleColumns(defaultColumns);
  };

  const saveColumns = () => {
    setVisibleColumns(tempVisibleColumns);
    setShowColumnSelector(false);
  };

  const handleCaseClick = (row: RowData) => {
    setSelectedCaseData(row);
    setShowPopup(true);
  };

  const handleRemoveUser = async (userId: number) => {
    try {
      const confirmDelete = confirm("Are you sure you want to remove this user?");
      if (!confirmDelete) return;
  
      const response = await removeAdminUser(userId);
      console.log("Delete API response:", response);
  
      if (response.success) {
        setRows(prev => prev.filter(user => user.id !== userId));
        setSelectedRow(null);
      } else {
        console.error("Removal failed:", response.message || "Unknown error");
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error removing user:", axiosError.message);
    } finally {
      setShowDropdown(null);
      handleCloseDialog();
    }
  };
  
  
  

  const toggleDropdown = (id: number) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  //    const rowData: RowData[] = rows.map(u => ({
  //    id: u.id.toString(),
  //    email: u.email,
  //    username: u.username,
  //    role: u.role,
  //    caseCount: u.caseCount,
  //    dueDate: u.dueDate,
  //    lastUpload: u.lastUpload,
  //    ongoingClaims: u.ongoingClaims,
  //  }))

  return (
    <div className="p-4 px-7 py-4 space-y-4 text-[#333333] font-geist bg-[#FBFBFB]">
      <h2 className="text-[24px] font-medium m-0 font-geist">Approval Requests</h2>
      <p className="text-[18px] text-[#858585] font-light font-geist">Monitor and process claims efficiently</p>

      <div className="border-b border-[#EFEFEFE5]">
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: { backgroundColor: '#21FF91' },
          }}
          sx={{
            fontFamily: 'Geist',
          }}
        >
          {tabLabelsWithCounts.map(({ label, count }) => (
            <Tab
              key={label}
              label={
                <span className="py-2 px-6" style={{ fontFamily: 'Geist' }}>
                  {label}{' '}
                  <span
                    className={`ml-1 text-[16px] py-1 px-2 rounded-md ${label === 'Pending'
                      ? 'text-[#F59E0B] bg-[#F59E0B1A]'
                      : label === 'Approved'
                        ? 'text-[#10B981] bg-[#10B9811A]'
                        : label === 'Rejected'
                          ? 'text-[#EF4444] bg-[#EF44441A]'
                          : 'text-[#618CF0] bg-[#618CF01A]'
                      }`}
                  >
                    {count}
                  </span>
                </span>
              }
              sx={{
                textTransform: 'none',
                color: '#858585',
                fontSize: '16px',
                fontFamily: 'Geist',
                '&.Mui-selected': {
                  color: '#3A6048',
                },
              }}
            />
          ))}
        </Tabs>
      </div>

      <div className="flex items-center justify-between mb-4">
        {/* 🔍 Search input (left) */}
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search name & ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 📅 Date range inputs (right) */}
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={startDate ? dayjs(startDate).format("YYYY-MM-DD") : ""}
            onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
            className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={endDate ? dayjs(endDate).format("YYYY-MM-DD") : ""}
            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
            className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {!loading && (<AdminTable
          rowData={filteredRows}
          onRowClick={handleRowClick}
          onActionChange={(id, newStatus) => {
            setRows(rs =>
              rs.map(r => (r.id === id ? { ...r, userStatus: newStatus } : r))
            )
          }}
        />)}
      </div>

      {showPopup && selectedCaseData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Case Details</h2>
            <p>{selectedCaseData.caseCount ?? 0} ongoing claims</p>
            <button onClick={() => setShowPopup(false)} className="mt-4 text-blue-600 hover:underline">
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── PENDING MODAL ───────────────────────── */}
      {selectedRow?.userStatus === 'Pending' && (
        <div className="fixed inset-0 bg-[#00000014] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            {/* header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: statusColors['Pending'] }}
                />
                <h3 className="text-[20px]" style={{ color: statusColors['Pending'] }}>
                  Pending Approval
                </h3>
              </div>
              <button onClick={handleCloseDialog} className="text-gray-500 hover:text-gray-700">
                <CloseIcon />
              </button>
            </div>
            {/* body */}
            <p className="text-[#04030866]">
              Claim #{selectedRow.id} — {selectedRow.username}
            </p>
            {/* actions */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => handleRejectUser(selectedRow.id, 'reject')}
                className="px-8 py-1 border border-[#EA5455] text-[#EA5455] rounded hover:bg-[#FFEBEB]"
              >
                Reject
              </button>
              <button
                onClick={() => handleApproveUser(selectedRow.id)}
                className="px-8 py-1 border border-[#21FF91] text-[#066137] rounded hover:bg-[#F0FEF3]"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── APPROVED MODAL ─────────────────────── */}
      {selectedRow?.userStatus === 'Approved' && (
        <div className="fixed inset-0 bg-[#00000014] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            {/* header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: statusColors['Approved'] }}
                />
                <h3 className="text-[20px]" style={{ color: statusColors['Approved'] }}>
                  Approved
                </h3>
              </div>
              <button onClick={handleCloseDialog} className="text-gray-500 hover:text-gray-700">
                <CloseIcon />
              </button>
            </div>
            {/* body */}
            <p className="text-[#04030866]">
              Claim #{selectedRow.id} — {selectedRow.username}
            </p>
            {/* remove button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => handleRemoveUser(selectedRow.id)}
                className="px-8 py-1 border border-[#FF5E5E] text-[#FF5E5E] rounded hover:bg-[#FFEAEA]"
              >
                Remove User
              </button>
            </div>
          </div>
        </div>
      )}


      <Dialog
        open={Boolean(selectedRow)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            padding: '24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            width: 450,
            height: 550,
            fontFamily: 'Geist',
          },
        }}
      >
        {selectedRow && (
          <div className="space-y-6 font-geist">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: statusColors[selectedRow.userStatus] || '#ccc',
                  }}
                />
                <span
                  className="text-[20px]"
                  style={{
                    color: statusColors[selectedRow.userStatus] || '#FF9F43',
                  }}
                >
                  {selectedRow.userStatus === 'Approved'
                    ? 'Active'
                    : selectedRow.userStatus}
                </span>
              </div>
              <button
                onClick={handleCloseDialog}
                className="text-gray-500 hover:text-gray-700"
                aria-label="close"
              >
                <CloseIcon />
              </button>
            </div>

            {/* User Header */}
            <h3 className="text-[24.24px] text-[#858585]">
              <span className="pr-2">#{selectedRow.id}</span>
              {selectedRow.username ?? 'N/A'}
            </h3>

            {/* User Info Section */}
            <div className="space-y-4 text-[#858585]">
              <div>
                <p className="text-[22px] text-[#04030899]">Email Address</p>
                <p className="text-[#04030866] text-[19.39px]">
                  {selectedRow.email ?? 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Role', value: selectedRow.role },
                  { label: 'Department', value: selectedRow.department },
                  { label: 'Responsibility', value: selectedRow.responsibility },
                  { label: 'Experience', value: selectedRow.experience },
                  { label: 'Zone', value: selectedRow.zone },
                  { label: 'Last Updated', value: selectedRow.lastUpdated },
                  { label: 'Due Date', value: selectedRow.dueDate },
                  { label: 'Cases Assigned', value: selectedRow.caseCount },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="text-[22px] text-[#04030899]">{field.label}</p>
                    <p className="text-[#04030866] text-[19.39px]">
                      {field.value ?? 'N/A'}
                    </p>
                  </div>
                ))}

                {selectedRow.userStatus === 'Rejected' && (
                  <div className="col-span-2">
                    <p className="text-[22px] text-[#04030899]">Reason</p>
                    <p className="text-[#04030866] text-[19.39px]">
                      {selectedRow.rejectionReason ?? 'No reason provided'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className={`flex ${selectedRow.userStatus === 'Pending'
                ? 'justify-between'
                : 'justify-center'
                } pt-4`}
            >
              {selectedRow.userStatus === 'Pending' ? (
                <>
                  <button
                    onClick={() => handleApproveUser(selectedRow.id)}
                    className="px-8 py-1 hover:bg-[#21FF91] text-[#066137] border border-[#21FF91] rounded transition-colors"
                  >
                    Approve
                  </button>
                  {showReasonInput ? (
                    <div className="flex flex-col gap-3 w-full">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter rejection reason"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setShowReasonInput(false)}
                          className="px-4 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            handleRejectUser(selectedRow.id, rejectionReason);
                            setShowReasonInput(false);
                          }}
                          disabled={!rejectionReason.trim()}
                          className="px-6 py-1 bg-[#FF5E5E] text-white rounded hover:bg-[#e04c4c] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Confirm Reject
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowReasonInput(true)}
                      className="px-8 py-1 hover:bg-[#FF5E5E] hover:text-[#FFFFFF] text-[#EA5455] border border-[#EA5455] rounded transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </>
              ) : selectedRow.userStatus === 'Approved' ? (
                <button
                  onClick={() => handleRemoveUser(selectedRow.id)}
                  className="px-28 py-1 hover:bg-[#FF5E5E] hover:text-[#FFFFFF] border border-[#FF5E5E] text-[#FF5E5E] rounded transition-colors mx-8"
                >
                  Remove User
                </button>
              ) : (
                <button
                  disabled
                  className="px-36 py-1 mx-8 bg-gray-200 text-gray-500 rounded cursor-not-allowed"
                >
                  Rejected
                </button>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
