'use client';

import React, { useState } from 'react';

// Type Definitions
type Part = {
  particulars: string;
  coverage: string;
  workshopEst: number;
  assessedEst: number;
  billedEst: number;
  salvage: number;
};

type Labour = {
  job: string;
  labourEst?: number;
  workshopEst?: number;
  assessedLabour: number;
  billedLabour: number;
  gstAmount: number;
  finalAmount: number;
};

type Paint = {
  description: string;
  estimated: number;
  assessed: number;
  billed: number;
  depreciation: number;
  taxable: number;
};

type SortDirection = 'asc' | 'desc';

type TableTypes = 'part' | 'labour' | 'labourRepair' | 'paint';

type SortConfig = {
  table: TableTypes;
  key: string;
  direction: SortDirection;
};

type ColumnConfig<T> = {
  key: keyof T;
  label: string;
  align?: 'left' | 'right';
};

type SummaryItem = {
  label: string;
  value: number;
};

const ClaimFullDetails = () => {
  // State for all data tables
  const [parts, setParts] = useState<Part[]>([
    {
      particulars: 'Front Bumper',
      coverage: 'Yes',
      workshopEst: 12000,
      assessedEst: 11500,
      billedEst: 11800,
      salvage: 0
    },
    {
      particulars: 'Headlight Assembly',
      coverage: 'Yes',
      workshopEst: 12000,
      assessedEst: 11500,
      billedEst: 11800,
      salvage: 0
    },
    {
      particulars: 'Hood',
      coverage: 'Yes',
      workshopEst: 12000,
      assessedEst: 11500,
      billedEst: 11800,
      salvage: 0
    },
    {
      particulars: 'Radiator',
      coverage: 'Yes',
      workshopEst: 12000,
      assessedEst: 11500,
      billedEst: 11800,
      salvage: 0
    },
    {
      particulars: 'Side Mirror (Right)',
      coverage: 'No',
      workshopEst: 12000,
      assessedEst: 0,
      billedEst: 0,
      salvage: 0
    },
  ]);

  const [labour, setLabour] = useState<Labour[]>([
    {
      job: 'Front Bumper R&R',
      labourEst: 2500,
      assessedLabour: 1,
      billedLabour: 2500,
      gstAmount: 345.00,
      finalAmount: 340.80
    },
    {
      job: 'Headlight Assembly R&R',
      labourEst: 1800,
      assessedLabour: 1.5,
      billedLabour: 2700,
      gstAmount: 372.60,
      finalAmount: 3072.60
    },
    {
      job: 'Hood R&R',
      labourEst: 2200,
      assessedLabour: 0.5,
      billedLabour: 1100,
      gstAmount: 151.80,
      finalAmount: 1251.80
    }
  ]);

  const [labourRepair, setLabourRepair] = useState<Labour[]>([{
    job: 'Front Fender Repair',
    workshopEst: 2200,
    assessedLabour: 0.5,
    billedLabour: 1100,
    gstAmount: 151.80,
    finalAmount: 1251.80
  }]);

  const [paint, setPaint] = useState<Paint[]>([
    {
      description: 'Front Bumper R&R',
      estimated: 4500,
      assessed: 4200,
      billed: 4300,
      depreciation: 10,
      taxable: 3870,
    },
    {
      description: 'Hood Painting',
      estimated: 4500,
      assessed: 4200,
      billed: 4300,
      depreciation: 10,
      taxable: 3870,
    }
  ]);

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Sorting functionality
  const sortHelper = <T extends Record<string, any>>(
    data: T[],
    key: keyof T,
    direction: SortDirection
  ): T[] => {
    return [...data].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  const sortTable = (table: TableTypes, key: string) => {
    let direction: SortDirection = 'asc';
    if (sortConfig?.table === table && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    const newSortConfig = { table, key, direction };
    setSortConfig(newSortConfig);

    switch (table) {
      case 'part':
        setParts(sortHelper(parts, key as keyof Part, direction));
        break;
      case 'labour':
        setLabour(sortHelper(labour, key as keyof Labour, direction));
        break;
      case 'labourRepair':
        setLabourRepair(sortHelper(labourRepair, key as keyof Labour, direction));
        break;
      case 'paint':
        setPaint(sortHelper(paint, key as keyof Paint, direction));
        break;
    }
  };

  const getArrow = (table: TableTypes, key: string) => {
    const isActive = sortConfig?.table === table && sortConfig?.key === key;
    const direction = sortConfig?.direction;

    return (
      <div className="flex flex-col items-center ml-1">
        <svg
          className={`w-5 h-3 ${isActive && direction === 'asc' ? 'text-black' : 'text-[#C0C0C0]'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        <svg
          className={`w-5 h-3 ${isActive && direction === 'desc' ? 'text-black' : 'text-[#C0C0C0]'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    );
  };

  // Reusable table component
  const renderTable = <T extends Record<string, any>>({
    title,
    data,
    tableType,
    columns,
  }: {
    title: string;
    data: T[];
    tableType: TableTypes;
    columns: ColumnConfig<T>[];
  }) => {
    const getTotal = (key: keyof T): number => {
      return data.reduce((sum, row) => {
        const value = row[key];
        return typeof value === 'number' ? sum + value : sum;
      }, 0);
    };

    return (
      <div className="overflow-hidden">
        <h2 className="text-lg font-semibold py-3">{title}</h2>
        <table className="w-full text-sm border border-[#EFEFEF] rounded-md">
          <thead className="bg-[#FBFBFB] text-[#858585] text-[13px]">
            <tr>
              {columns.map(({ key, label }) => (
                <th
                  key={String(key)}
                  onClick={() => sortTable(tableType, String(key))}
                  className={`p-3 cursor-pointer whitespace-nowrap select-none`}
                >
                  <div className="flex items-center gap-2">
                    {label}
                    {String(key) === 'salvage' && tableType === 'part' ? (
                      <span className="text-xs">%</span>
                    ) : (
                      getArrow(tableType, String(key))
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="text-[#5C5C5C] text-[14px] hover:bg-gray-50">
                {columns.map(({ key }) => (
                  <td key={String(key)} className={`p-3`}>
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-[#EFEFEFE5] font-semibold text-[#333333]">
              {columns.map(({ key }, idx) => {
                if (idx === 0) {
                  return (
                    <td key="total-label" className="p-3">
                      Total
                    </td>
                  );
                } else if (idx >= columns.length - 3) {
                  return (
                    <td key={String(key)} className="p-3">
                      {getTotal(key).toFixed(2)}
                    </td>
                  );
                } else {
                  return <td key={String(key)} className="p-3"></td>;
                }
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // Summary data
  const leftData: SummaryItem[] = [
    { label: 'Parts Assessment Total', value: 40305.26 },
    { label: 'Labour + Paint Total', value: 18514.20 },
    { label: 'Less: Compulsory Excess', value: 4500 },
    { label: 'Less: Voluntary Excess', value: 0 },
    { label: 'Less: Salvage', value: 1780.0 },
  ];

  const rightData: SummaryItem[] = [
    { label: 'Depreciated Amount (Parts)', value: 40305.26 },
    { label: 'Depreciated Amount (Paint)', value: 18514.20 },
    { label: 'Surveyor Fees', value: 4500 },
    { label: 'Non-Standard Deductions', value: 0 },
    { label: 'Settlement Percentage', value: 1780.0 },
  ];

  return (
    <div className="px-3 space-y-10 text-[#4B465C] text-sm">
      {/* Insurance & Policy Details */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Insurance & Policy Details</h2>
        <div className="grid grid-cols-5 gap-4 pb-6">
          <div>
            <h2 className="mb-1 text-[#858585]">Insurer Name</h2>
            <p className="text-[#474747]">Secure Insurance Co.</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Policy Number</h2>
            <p className="text-[#474747]">0000000000</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Policy Start Date</h2>
            <p className="text-[#474747]">27 03 2023</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Policy End Date</h2>
            <p className="text-[#474747]">27 03 2023</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Issuing Office</h2>
            <p className="text-[#474747]">Mumbai Central</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">IDV</h2>
            <p className="text-[#474747]">980000</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Deputing Office</h2>
            <p className="text-[#474747]">Mumbai West</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Policy Type</h2>
            <p className="text-[#474747]">Comprehensive Auto Insurance</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Claim Number</h2>
            <p className="text-[#474747]">0000000000</p>
          </div>
        </div>
      </section>

      {/* Insured Details */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Insured Details</h2>
        <div className="w-1/2 grid grid-cols-3 gap-4 pb-6">
          <div>
            <h2 className="mb-1 text-[#858585]">Insured's Name</h2>
            <p className="text-[#474747]">Secure Insurance Co.</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Contact Number</h2>
            <p className="text-[#474747]">0000000000</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Email</h2>
            <p className="text-[#474747]">insured@example.com</p>
          </div>
          <div className="col-span-2">
            <h2 className="mb-1 text-[#858585]">Address</h2>
            <p className="text-[#474747] p-4 rounded h-20 border border-[#E5E5E5]">123 Main St, Mumbai, Maharashtra 400001</p>
          </div>
        </div>
      </section>

      {/* Vehicle Particulars */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Vehicle Particulars</h2>
        <div className="grid grid-cols-5 gap-4 pb-6">
          <div>
            <h2 className="mb-1 text-[#858585]">Registered Number</h2>
            <p className="text-[#474747]">MH02AB1234</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Body Type</h2>
            <p className="text-[#474747]">Sedan</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Date of Registration</h2>
            <p className="text-[#474747]">27 03 2023</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Class of Vehicle (Use)</h2>
            <p className="text-[#474747]">Private Vehicle</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Chassis Number</h2>
            <p className="text-[#474747]">CH12345678901234</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Type of Permit</h2>
            <p className="text-[#474747]">Personal</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Engine Number</h2>
            <p className="text-[#474747]">EN98765432101</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Passenger Capacity</h2>
            <p className="text-[#474747]">4</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Make</h2>
            <p className="text-[#474747]">Toyota Camry</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Tax Paid Up To</h2>
            <p className="text-[#474747]">04 03 2023</p>
          </div>
        </div>
      </section>

      {/* Driver Particulars */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Driver Particulars</h2>
        <div className="grid grid-cols-5 gap-4 pb-6">
          <div>
            <h2 className="mb-1 text-[#858585]">Driver Name</h2>
            <p className="text-[#474747]">John Doe</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Issuing Authority</h2>
            <p className="text-[#474747]">RTO Mumbai</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Driving License Number</h2>
            <p className="text-[#474747]">DL12345678901234</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">License Type</h2>
            <p className="text-[#474747]">LMV</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Date of Issue</h2>
            <p className="text-[#474747]">04 03 2023</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Valid Up To</h2>
            <p className="text-[#474747]">04 03 2023</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Badge Number</h2>
            <p className="text-[#474747]">B12345</p>
          </div>
        </div>
      </section>

      {/* Accident & Police Report */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Accident & Police Report Details</h2>
        <div className="grid grid-cols-5 gap-4 pb-6">
          <div>
            <h2 className="mb-1 text-[#858585]">Date of Accident</h2>
            <p className="text-[#474747]">04 03 2023</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Time of Accident</h2>
            <p className="text-[#474747]">04:30 pm</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Date of Survey</h2>
            <p className="text-[#474747]">04 03 2023</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Time of Survey</h2>
            <p className="text-[#474747]">04:30 pm</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Place of Survey</h2>
            <p className="text-[#474747]">Auto Fix Garage, Mumbai</p>
          </div>
          <div className="col-span-2">
            <h2 className="mb-1 text-[#858585]">Cause of Loss</h2>
            <p className="text-[#474747] p-4 rounded h-20 border border-[#E5E5E5]">Collision with another vehicle at intersection</p>
          </div>
          <div className='py-7'>
            <h2 className="mb-1 text-[#858585]">Date of Deputation</h2>
            <p className="text-[#474747]">04 03 2023</p>
          </div>
          <div className='py-7'>
            <h2 className="mb-1 text-[#858585]">Reported to Police</h2>
            <p className="text-[#474747]">Yes</p>
          </div>
          <div className='py-7'>
            <h2 className="mb-1 text-[#858585]">Police Station</h2>
            <p className="text-[#474747]">Highway Police Station</p>
          </div>
          <div>
            <h2 className="mb-1 text-[#858585]">Station Diary Entry No.</h2>
            <p className="text-[#474747]">HD-2023/456</p>
          </div>
        </div>
      </section>

      {/* Assessment of Loss Overview */}
      <section className="">
        <h2 className="text-lg font-semibold mb-6 text-[#333333]">Assessment of Loss Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-[#000000]">
          <div>
            <h3 className="text-md font-semibold mb-4 text-[#000000]">Key Policy Details</h3>
            <div className='border border-[#EFEFEF] rounded p-4'>
              <div className="flex justify-between py-2 text-sm">
                <span>Insurer Name</span>
                <span className="font-medium">Safe Insure Co</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>Policy Number</span>
                <span className="font-medium">0000000000</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>Date of Loss</span>
                <span className="font-medium">04/03/2023</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>Policy Start Date</span>
                <span className="font-medium">04/03/2023</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>Policy End Date</span>
                <span className="font-medium">04/03/2023</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-4 text-[#000000]">Key Claim Details</h3>
            <div className='border border-[#EFEFEF] rounded p-4'>
              <div className="flex justify-between py-3 text-sm">
                <span>Claim Number</span>
                <span className="font-medium">0000000000</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span>Vehicle Number</span>
                <span className="font-medium">MH02AB1234</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span>Claim Date</span>
                <span className="font-medium">04/03/2023</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span>Vehicle Age</span>
                <span className="font-medium">6 years</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-4 text-[#000000]">GST & Depreciation Settings</h3>
            <div className="border border-[#EFEFEF] rounded p-4">
              <div className="flex justify-between py-2 text-sm">
                <span>GST Applicable</span>
                <span className="font-medium">Yes</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>GST Rate (%)</span>
                <span className="font-medium">18%</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>CGST Rate (%)</span>
                <span className="font-medium">9%</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>SGST Rate (%)</span>
                <span className="font-medium">9%</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>Depreciation (%)</span>
                <span className="font-medium">15%</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Tables Section */}
      <section className="space-y-8">
        {renderTable({
          title: 'Parts Assessment Table',
          data: parts,
          tableType: 'part',
          columns: [
            { key: 'particulars', label: 'Particulars' },
            { key: 'coverage', label: 'Coverage' },
            { key: 'workshopEst', label: 'Workshop Est.', align: 'right' },
            { key: 'assessedEst', label: 'Assessed Est.', align: 'right' },
            { key: 'billedEst', label: 'Billed Est.', align: 'right' },
            { key: 'salvage', label: 'Salvage', align: 'right' },
          ],
        })}

        {renderTable({
          title: 'Labour Charges Table',
          data: labour,
          tableType: 'labour',
          columns: [
            { key: 'job', label: 'Job' },
            { key: 'labourEst', label: 'Labour Est.', align: 'right' },
            { key: 'assessedLabour', label: 'Assessed Labour', align: 'right' },
            { key: 'billedLabour', label: 'Billed Labour', align: 'right' },
            { key: 'gstAmount', label: 'GST Amount', align: 'right' },
            { key: 'finalAmount', label: 'Final Amount', align: 'right' },
          ],
        })}

        {renderTable({
          title: 'Labour Repair Table',
          data: labourRepair,
          tableType: 'labourRepair',
          columns: [
            { key: 'job', label: 'Job' },
            { key: 'workshopEst', label: 'Workshop Est.', align: 'right' },
            { key: 'assessedLabour', label: 'Assessed Est', align: 'right' },
            { key: 'billedLabour', label: 'Billed Est', align: 'right' },
            { key: 'gstAmount', label: 'GST Amount', align: 'right' },
            { key: 'finalAmount', label: 'Final Amount', align: 'right' },
          ],
        })}

        {/* Paint Table */}
        <div className="overflow-hidden">
          <h2 className="text-lg font-semibold mb-4">Paint Charges Table</h2>
          <table className="w-full text-sm border border-[#EFEFEF] rounded-md">
            <thead className="bg-[#FBFBFB] text-[#858585] text-[13px]">
              <tr>
                <th
                  onClick={() => sortTable('paint', 'description')}
                  className="p-3 text-left cursor-pointer whitespace-nowrap select-none"
                >
                  <div className="flex items-center gap-2">
                    Description
                    {getArrow('paint', 'description')}
                  </div>
                </th>
                <th
                  onClick={() => sortTable('paint', 'estimated')}
                  className="p-3 cursor-pointer whitespace-nowrap select-none"
                >
                  <div className="flex items-center gap-2">
                    Est. Paint
                    {getArrow('paint', 'estimated')}
                  </div>
                </th>
                <th
                  onClick={() => sortTable('paint', 'assessed')}
                  className="p-3 cursor-pointer whitespace-nowrap select-none"
                >
                  <div className="flex items-center gap-2">
                    Assessed Paint
                    {getArrow('paint', 'assessed')}
                  </div>
                </th>
                <th
                  onClick={() => sortTable('paint', 'billed')}
                  className="p-3 cursor-pointer whitespace-nowrap select-none"
                >
                  <div className="flex items-center gap-2">
                    Billed Paint
                    {getArrow('paint', 'billed')}
                  </div>
                </th>
                <th
                  onClick={() => sortTable('paint', 'depreciation')}
                  className="p-3 cursor-pointer whitespace-nowrap select-none"
                >
                  <div className="flex items-center gap-2">
                    Depr. %
                    {getArrow('paint', 'depreciation')}
                  </div>
                </th>
                <th
                  onClick={() => sortTable('paint', 'taxable')}
                  className="p-3 cursor-pointer whitespace-nowrap select-none"
                >
                  <div className="flex items-center gap-2">
                    Taxable Amt
                    {getArrow('paint', 'taxable')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paint.map((item, index) => (
                <tr key={index} className="text-[#5C5C5C] text-[14px] hover:bg-gray-50">
                  <td className="p-3">{item.description}</td>
                  <td className="p-3">
                    <input
                      value={item.estimated}
                      disabled
                      className='border border-[#E5E5E5] rounded p-1 w-20'
                    />
                  </td>
                  <td className="p-3">{item.assessed}</td>
                  <td className="p-3">{item.billed}</td>
                  <td className="p-3">{item.depreciation}%</td>
                  <td className="p-3">{item.taxable.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-[#EFEFEFE5] font-semibold text-[#333333]">
                <td className="p-3">Total</td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3">
                  {paint.reduce((sum, item) => sum + item.taxable, 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Settlement Summary */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Settlement Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#000000]">
          {[leftData, rightData].map((section, idx) => (
            <div key={idx} className="border border-[#EFEFEF] rounded p-4">
              {section.map((item, i) => (
                <div key={i} className="flex justify-between py-3 text-sm">
                  <span className="">{item.label}</span>
                  <span className="text-right font-medium">
                    ₹{Number(item.value).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClaimFullDetails;