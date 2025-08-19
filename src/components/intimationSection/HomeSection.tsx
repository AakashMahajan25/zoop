import { useMemo, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import fileIcon from '../assets/fileIcon.svg';
import fileIconGray from '../assets/fileIconGray.svg';
import upload from '../assets/upload.svg';
import alarm from '../assets/alarm.svg';
import photoGroup from '../assets/photoGroup.svg';
import removefile from '../assets/remove-file.svg';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from "@mui/material";
import { columns, rows, newClaimsRows } from '@/app/jsondata/intimationJsonData'
import IntimationNewClaimsTable from "./Tables/IntimationNewClaimsTable";
import { FilterSelect } from "../FilterSelect";
import React from "react";
import { RowData, Top10ClaimHandlerTable } from "./Tables/Top10ClaimHandlerTable";
// import HandlerStatsTable from "./HandlerStatsTable";

export default function HomeSection() {
  const [timePeriod, setTimePeriod] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [claimsHandlers, setClaimsHandler] = useState<string>("");

  const [time, setTime] = React.useState('')
  const [vehicle, setVehicle] = React.useState('')
  // const [state, setState] = React.useState('')
  const [handler, setHandler] = React.useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

const sortedHandlerRows = useMemo(() => {
  if (!sortConfig) return rows;
  const { key, direction } = sortConfig;

  // helper: "1h 12m" → 72, "39m" → 39
  const parseDuration = (s: string): number => {
    let total = 0;
    const h = s.match(/(\d+)\s*h/);
    const m = s.match(/(\d+)\s*m/);
    if (h) total += parseInt(h[1], 10) * 60;
    if (m) total += parseInt(m[1], 10);
    return total;
  };

  return [...rows].sort((a, b) => {
    const aVal = a[key as keyof RowData];
    const bVal = b[key as keyof RowData];

    // special‐case avgTime
    if (key === "avgTime" && typeof aVal === "string" && typeof bVal === "string") {
      const aMin = parseDuration(aVal);
      const bMin = parseDuration(bVal);
      return direction === "asc" ? aMin - bMin : bMin - aMin;
    }

    // numeric columns
    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    // string columns
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    if (aStr < bStr) return direction === "asc" ? -1 : 1;
    if (aStr > bStr) return direction === "asc" ? 1 : -1;
    return 0;
  });
}, [rows, sortConfig]);


  // Sorting handler
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "asc" };
      }
      return {
        key,
        direction: prev.direction === "asc" ? "desc" : "asc",
      };
    });
  };

  const getArrow = (key: string) => {
    const isActive = sortConfig?.key === key;
    const dir = sortConfig?.direction;
    return (
      <div className="flex flex-col items-center ml-1">
        <svg
          className={`w-5 h-3 ${isActive && dir === "asc" ? "text-black" : "text-[#C0C0C0]"
            }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        <svg
          className={`w-5 h-3 ${isActive && dir === "desc" ? "text-black" : "text-[#C0C0C0]"
            }`}
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

  return (
    <div className="p-4 p-4 px-7 py-4 space-y-4 text-[#333333] font-geist bg-[#FBFBFB]">
      <h2 className="text-[24px] font-medium text-[#333333] mb-6">Intimation Dashboard</h2>

      <div className="flex gap-4 mb-6 ">
        <FilterSelect
          placeholder="Time Period"
          value={time}
          onChange={e => setTime(e.target.value)}
          options={[
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
            // …
          ]}
        />
        <FilterSelect
          placeholder="Vehicle Type"
          value={vehicle}
          onChange={e => setVehicle(e.target.value)}
          options={[
            { value: 'car', label: 'Car' },
            { value: 'truck', label: 'Truck' },
          ]}
        />
        <FilterSelect
          placeholder="States"
          value={state}
          onChange={e => setState(e.target.value)}
          options={[
            { value: 'mh', label: 'Maharashtra' },
            { value: 'ka', label: 'Karnataka' },
          ]}
        />
        <FilterSelect
          placeholder="Claim Handlers"
          value={handler}
          onChange={e => setHandler(e.target.value)}
          options={[
            { value: 'john', label: 'John Doe' },
            { value: 'jane', label: 'Jane Smith' },
          ]}
        />
      </div>

      {/* Filters Row */}

      {/* Stats Cards */}
      <div className="grid grid-cols-12 gap-4 w-full mb-6">
        {/* First Card – spans 3 of 12 columns */}
        <div className="col-span-3 bg-white rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-4 relative min-h-[120px]">
          <p className="text-[#A7AAAD] text-[10px] font-medium uppercase tracking-wider">Today</p>
          <p className="text-[28px] font-bold text-[#333333] mt-1">45</p>
          <div className="flex items-center gap-1 mt-2">
            <p className="text-[#A7AAAD] text-sm">Claims Assigned</p>
            <div className="group relative">
              <InfoOutlinedIcon className="text-[#A7AAAD] cursor-pointer" fontSize="small" />
              <span className="absolute left-5 top-0 w-[160px] bg-[#333333] text-white text-xs px-2 py-2 rounded hidden group-hover:block z-10">
                Includes all settled claims today
              </span>
            </div>
          </div>
          <div className="absolute right-4 top-4">
            <img src="../assets/fileIcon.svg" alt="fileIcon" className="h-14 w-14" />
          </div>
        </div>

        {/* Second Card – spans 3 of 12 columns */}
        <div className="col-span-3 bg-white rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-4 relative min-h-[120px]">
          <p className="text-[#A7AAAD] text-[10px] font-medium uppercase tracking-wider">Today</p>
          <p className="text-[28px] font-bold text-[#333333] mt-1">57 minutes</p>
          <div className="flex items-center gap-1 mt-2">
            <p className="text-[#A7AAAD] text-sm">Avg Assignment time</p>
            <div className="group relative">
              <InfoOutlinedIcon className="text-[#A7AAAD] cursor-pointer" fontSize="small" />
              <span className="absolute left-5 top-0 w-[160px] bg-[#333333] text-white text-xs px-2 py-2 rounded hidden group-hover:block z-10">
                Includes all settled claims today
              </span>
            </div>
          </div>
          <div className="absolute right-4 top-4">
            <img src="../assets/fileIconGray.svg" alt="fileIconGray" className="h-14 w-14" />
          </div>
        </div>

        {/* Empty space – spans remaining 6 columns */}
        <div className="col-span-6" />
      </div>
      <div className="border border-[#EFEFEFE5]"></div>
      <div className="flex gap-6">
        <div className="w-1/2">
          <h3 className="text-[20px] font-bold mb-6 text-[#3D3D3D]">Top 10 Claim Handlers</h3>
          <div>
            <div>
              <Top10ClaimHandlerTable rows={sortedHandlerRows} handleSort={handleSort} getArrow={getArrow} />
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <h3 className="text-xl font-bold mb-6 text-[#333333]">Latest Updates (24 hrs)</h3>
          <div className="border border-[#EFEFEF] rounded-lg bg-[#FFFFFF] py-1">
            <div className="p-4 flex justify-between items-start">
              <div>
                <p className="font-semibold">Autocare Workshop</p>
                <p className="text-sm text-gray-500">Workshop uploaded repair estimate</p>
                <div className="flex gap-3 py-2"><img src='../assets/upload.svg' alt="upload" className="w-4 h-4 mt-1" /><p className="text-[#A7AAAD]">MH-04-AB-1234</p></div>
              </div>
              <div className="text-center">
                <p className="font-semibold">10 : 45</p>
                <button className="mt-2 border border-[#0AA7DC] text-[#0AA7DC] px-3 py-2 rounded text-sm">
                  Document
                </button>
              </div>
            </div>
            <div className="border border-[#EFEFEF] rounded-lg p-4 flex justify-between items-start">
              <div>
                <p className="font-semibold">Autocare Workshop</p>
                <p className="text-sm text-gray-500">Workshop uploaded repair estimate</p>
                <div className="flex gap-3 py-2"><img src='../assets/alarm.svg' alt="alarm" className="w-4 h-4 mt-1" /><p className="text-[#A7AAAD]">MH-04-AB-1234</p></div>
              </div>
              <div className="text-center">
                <p className="font-semibold">10 : 45</p>
                <button className="mt-2 border border-[#FFD21E] text-[#FFD21E] px-3 py-2 rounded text-sm">
                  Document
                </button>
              </div>
            </div>
            <div className="border border-[#EFEFEF] rounded-lg p-4 flex justify-between items-start">
              <div>
                <p className="font-semibold">Autocare Workshop</p>
                <p className="text-sm text-gray-500">Workshop uploaded repair estimate</p>
                <div className="flex gap-3 py-2"><img src='../assets/photoGroup.svg' alt="photoGroup" className="w-4 h-4 mt-1" /><p className="text-[#A7AAAD]">MH-04-AB-1234</p></div>
              </div>
              <div className="text-center">
                <p className="font-semibold">10 : 45</p>
                <button className="mt-2 border border-[#28C76F] text-[#28C76F] px-3 py-2 rounded text-sm">
                  Document
                </button>
              </div>
            </div>
            <div className="border border-[#EFEFEF] rounded-lg p-4 flex justify-between items-start">
              <div>
                <p className="font-semibold">Autocare Workshop</p>
                <p className="text-sm text-gray-500">Workshop uploaded repair estimate</p>
                <div className="flex gap-3 py-1"><img src='../assets/remove-file.svg' alt="removefile" className="w-4 h-4 mt-1" /><p className="text-[#A7AAAD]">MH-04-AB-1234</p></div>
              </div>
              <div className="text-center">
                <p className="font-semibold">10 : 45</p>
                <button className="mt-2 border border-[#9747FF] text-[#9747FF] px-3 py-2 rounded text-sm">
                  Document
                </button>
              </div>
            </div>
            <div className="p-4 flex justify-between items-start">
              <div>
                <p className="font-semibold">Autocare Workshop</p>
                <p className="text-sm text-gray-500">Workshop uploaded repair estimate</p>
                <div className="flex gap-3 py-1"><img src='../assets/upload.svg' alt="upload" className="w-4 h-4 mt-1" /><p className="text-[#A7AAAD]">MH-04-AB-1234</p></div>
              </div>
              <div className="text-center">
                <p className="font-semibold">10 : 45</p>
                <button className="mt-2 border border-[#0AA7DC] text-[#0AA7DC] px-3 py-2 rounded text-sm">
                  Document
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-6">New Claims</h3>
        <div className="">
          <IntimationNewClaimsTable rowData={newClaimsRows} />
        </div>
      </div>
    </div>
  );
}