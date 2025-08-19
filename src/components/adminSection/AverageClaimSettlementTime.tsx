'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"; import dayjs from 'dayjs';
// import DatePicker from 'react-datepicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';
import ClaimSettlementBarChart from './charts/ClaimSettlementBarChart';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

export default function AverageClaimSettlementTime() {
  const [filters, setFilters] = useState({
    duration: 'Daily',
    vehicleType: '2-Wheeler',
    startDate: dayjs('2020-02-01'),
    endDate: dayjs('2020-02-21'),
    search: '',
  });
  const [dropdowns, setDropdowns] = useState<string[]>(Array(4).fill(""));
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  //  const [startDate, setStartDate] = useState<Date | null>(new Date('2025-01-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const handleChange = (key: string, value: string | PickerValue) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const data = [
    { date: "01", value: 12 },
    { date: "02", value: 34 },
    { date: "03", value: 8 },
    { date: "04", value: 64 },
    { date: "05", value: 18 },
    { date: "06", value: 22 },
    { date: "07", value: 10 },
    { date: "08", value: 72 },
    { date: "09", value: 38 },
    { date: "10", value: 80 },
    { date: "11", value: 90 },
    { date: "12", value: 110 },
    { date: "13", value: 76 },
    { date: "14", value: 52 },
    { date: "15", value: 24 },
    { date: "16", value: 40 },
    { date: "17", value: 34 },
    { date: "18", value: 45 },
  ]; const metrics = [
    { title: 'Average Settlement Duration', value: '8.7 Days', icon: '/assets/clockIcon.svg' },
    { title: 'Total Claims Processed', value: '2350', icon: '/assets/docIcon.svg' },
  ];

  const steps = [
    { title: 'Intimation to Assignment', value: '1.2 Days', count: 'Claim Assigned' },
    { title: 'Assignment to Document Receipt | 2340', value: '2.1 Days', count: '2340 claims with document received' },
    { title: 'Assessment Duration | 2310', value: '4.8 Days', count: '2310 Assessment completed' },
    { title: 'Repair Approval to Document Receipt | 2290', value: '0.9 Days', count: '2260 claims with Repair Document Receipt' },
    { title: 'Vehicle Repair Time | 2270', value: '5.6 Days', count: '2270 Vehicles Repaired' },
    { title: 'Vehicle Repair Time | 2260', value: '1.5 Days', count: '2250 Claims Approved' },
    { title: 'Final Report Submission | 2250', value: '1.5 Days', count: '2250 Report Submission' },
  ];
  const handleDropdownChange = (index: number, value: string) => {
    const newDropdowns = [...dropdowns];
    newDropdowns[index] = value;
    setDropdowns(newDropdowns);
  };

  const periodOptions = ["Daily", "Weekly", "Monthly"];
  const regionOptions = ["All Regions", "North", "South", "East", "West"];
  const companyOptions = ["All Companies", "Company A", "Company B", "Company C"];
  const vehicleOptions = ["2-Wheeler", "4-Wheeler"];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="p-2 font-Geist">
        <h2 className="text-[24px] font-medium mb-1 text-[#3C434A]">Average Claim Settlement Time</h2>
        <p className="text-[#858585] text-[16px] mb-6">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Left side - 1/3 width (cards in rows) */}
          <div className="space-y-4">
            {[
              ["8.7 Days", "Average Settlement Duration"],
              ["2350", "Total Claims Processed"]
            ].map(([val, label], i) => (
              <div key={i} className="rounded-[6px] shadow-[0_0_2px_0_#3333331A] bg-white p-6">
                <Image src="/assets/fileIcon.svg" alt="icon" width={48} height={45} />
                {/* <div className="w-12 h-12 flex items-center justify-center border border-[#FFC268] rounded-full mb-4">
                    <Image src="/assets/fileIcon.svg" alt="icon" width={24} height={24}/>
                  </div> */}
                <p className="text-[24px] font-semibold text-[#3C434A]">{val}</p>
                <p className="text-[16px] text-[#A7AAAD]">{label}</p>
              </div>
            ))}
          </div>

          {/* Right side - 2/3 width (overview chart) */}
          <div className="lg:col-span-2">
            <ClaimSettlementBarChart />
          </div>

        </div>

 

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 mt-6 gap-4">
          {/* FIXED QUOTE ON CLASSNAME ABOVE */}
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img src="/assets/searchIcon.svg" alt="Search" className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search claims..."
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Vehicle selector with cycle icon */}
  <div className="relative w-30 bg-[#FFFFFF] border border-[#EFEFEF] rounded-[6px]">
    {/* <img
      src="/assets/cycleIcon.svg"
      alt="cycleIcon"
      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
    /> */}
    <select
      value={dropdowns[3]}
      onChange={e => handleDropdownChange(3, e.target.value)}
      className="
        block w-full 
        bg-[#FFFFFF]  
        border-none 
        text-[#858585]  text-sm
        rounded-[6px] 
        px-3 py-3 
        appearance-none 
        focus:outline-none cursor-pointer
      "
    >
      {vehicleOptions.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg
        className="w-4 h-4 text-[#858585]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  </div>

  {/* Region selector */}
  <div className="relative w-30 bg-[#FFFFFF] border border-[#EFEFEF] rounded-[6px]">
    <select
      value={dropdowns[1]}
      onChange={e => handleDropdownChange(1, e.target.value)}
      className="
        block w-full 
        bg-[#FFFFFF] 
        border-none 
        text-[#858585]  text-sm
        rounded-[6px] 
        px-3 py-3 
        appearance-none 
        focus:outline-none cursor-pointer
      "
    >
      {regionOptions.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg
        className="w-4 h-4 text-[#858585]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  </div>
            <div className="flex items-center gap-4">
              <div className="flex rounded-md bg-[#FFFFFF] border border-[#EFEFEF]">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    //@ts-ignore
                    id="startDate"
                    value={startDate ? dayjs(startDate) : null}
                    // onChange={(d: Dayjs | null) => {
                    //   setStartDate(d ? d.toDate() : null);
                    // }}
                    inputFormat="MMM d, yyyy"
                    slotProps={{
                      textField: {
                        id: "startDate",
                        variant: "outlined",
                        size: "small",
                        className: "bg-[#FFFFFF] text-[#858585] w-42 border-none",
                        required: true,
                        placeholder: "Select start date",
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div className=" rounded-md bg-[#FFFFFF] border border-[#EFEFEF]">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    //@ts-ignore
                    id="startDate"
                    value={startDate ? dayjs(startDate) : null}
                    // onChange={(d: Dayjs | null) => {
                    //   setStartDate(d ? d.toDate() : null);
                    // }}
                    inputFormat="MMM d, yyyy"
                    slotProps={{
                      textField: {
                        id: "endDate",
                        variant: "outlined",
                        size: "small",
                        className: "bg-[#FFFFFF] text-[#858585] w-42 border-none",
                        required: true,
                        placeholder: "Select End date",
                      },
                    }}
                  />
                </LocalizationProvider>
                {/* <img src="/assets/calendar.svg" alt="calendar" className="h-5 w-5 mr-2" />
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="MMM d, yyyy"
                        className="text-[#858585] w-28 outline-none"
                      /> */}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="rounded-[6px] shadow-[0_0_2px_0_#3333331A] bg-white p-4">
              <p className="text-[#A7AAAD] text-sm mb-1">{step.title}</p>
              <p className="text-[#3C434A] text-xl font-semibold mb-1">{step.value}</p>
              <p className="text-[#A7AAAD] text-sm">{step.count}</p>
            </div>
          ))}
        </div>
      </div>
    </LocalizationProvider>
  );
}
