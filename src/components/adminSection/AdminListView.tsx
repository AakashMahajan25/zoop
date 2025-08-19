import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { allColumnsOfListView, claimsData } from '@/app/jsondata/adminJsonData';
import AdminListTable from './Tables/AdminListTable';


export default function AdminListView() {
  const [activeTab, setActiveTab] = useState('complete');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    Object.fromEntries(allColumnsOfListView.map(col => [col, true]))
  );
  const [tempVisibleColumns, setTempVisibleColumns] = useState({ ...visibleColumns });

  const rowsPerPage = 10;

  const filteredData = claimsData.filter(claim => {
    if (activeTab === 'complete') {
      return claim.claimStatus === 'Complete' || claim.claimStatus === 'Paid Out';
    } else if (activeTab === 'uploaded') {
      return claim.claimStatus === 'Uploaded';
    } else if (activeTab === 'rejected') {
      return claim.claimStatus === 'Rejected';
    }
    return true;
  });

  const searchedData = filteredData.filter(claim =>
    claim.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.insuranceProvider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  // const pageCount = Math.ceil(searchedData.length / rowsPerPage);
  // const paginatedData = searchedData.slice(
  //   currentPage * rowsPerPage,
  //   currentPage * rowsPerPage + rowsPerPage
  // );
  // const startEntry = currentPage * rowsPerPage + 1;
  // const endEntry = Math.min((currentPage + 1) * rowsPerPage, searchedData.length);

  const resetColumns = () => {
    const defaultColumns = Object.fromEntries(allColumnsOfListView.map(col => [col, true]));
    setTempVisibleColumns(defaultColumns);
  };

  const saveColumns = () => {
    setVisibleColumns(tempVisibleColumns);
    setShowColumnSelector(false);
  };


  return (
    <div className="p-4 px-7 py-4 space-y-4 text-[#333333] font-geist bg-[#FBFBFB]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[15px] text-[#333333]">List View</h2>
      </div>

      <div className="mb-4 border-b border-[#F3F3F3]">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('complete')}
            className={`py-2 px-1 border-b-2 font-medium text-[16px] cursor-pointer ${activeTab === 'complete'
                ? 'border-[#21FF91] text-[#3A6048]'
                : 'border-transparent text-[#858585] hover:text-[#858585] hover:border-[#858585]'
              }`}
          >
            Approved Claims
          </button>
          <button
            onClick={() => setActiveTab('uploaded')}
            className={`py-2 px-1 border-b-2 font-medium text-[16px] cursor-pointer ${activeTab === 'uploaded'
                ? 'border-[#21FF91] text-[#3A6048]'
                : 'border-transparent text-[#858585] hover:text-[#858585] hover:border-[#858585]'
              }`}
          >
            Completed Claims
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`py-2 px-1 border-b-2 font-medium text-[16px] cursor-pointer ${activeTab === 'rejected'
                ? 'border-[#21FF91] text-[#3A6048]'
                : 'border-transparent text-[#858585] hover:text-[#858585] hover:border-[#858585]'
              }`}
          >
            Rejected Claims
          </button>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <AdminListTable 
        rowData={searchedData}
        />
      </div>
    </div>
  );
}
