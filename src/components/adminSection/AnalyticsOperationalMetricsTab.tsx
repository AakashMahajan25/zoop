import React, { useState } from "react";
import { Sparklines, SparklinesLine } from 'react-sparklines';
import StarIcon from "@mui/icons-material/Star";
import { Button } from "@mui/material";
import { FilterSelect } from "../FilterSelect";

const AnalyticsOperationalMetricsTab = () => {
  const [dropdownValue, setDropdownValue] = useState("");
  const [state, setState] = useState("MH");
  const barData = [10, 25, 5, 40, 15, 20, 5, 35, 50, 45, 60, 70, 40, 20, 10, 30];

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDropdownValue(e.target.value);
  };

  const operationalMetrics = [
    {
      title: "Average Assessment Time",
      value: "1.5 Days",
      description: "Time from assignment → assessment submission"
    },
    {
      title: "Average Assessment Time",
      value: "4.2 Days",
      description: "Time from repair approval → discharge copy"
    },
    {
      title: "Average Assessment Time",
      value: "1.5 Days",
      description: "Average Workshop Repair Time → From repair approval to repaired docs/photos received by handler."
    },
    {
      title: "Average Assessment Time",
      value: "1.5 Days",
      description: "Time from final report → insurer approval"
    }
  ];

  const options=[
                  { value: '30', label: 'Last 30 Days' },
                  { value: '60', label: 'Last 60 Days' },
                  // …
                ];
  const stateOptions = [
                  { value: 'MH', label: 'Maharashtra' },
                  { value: 'DL', label: 'Delhi' },
  ]

  return (
    <div className="mb-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[24px] font-medium">Operational Metrics</h2>
            <div className="relative w-32">
      <select
        className="
          block w-full 
          bg-[#FFFFFF] 
          border border-[#EFEFEF] 
          text-[#858585] 
          text-[11.52px]
          rounded-[9px] 
          px-4 py-2 
          pr-10 
          appearance-none 
          focus:outline-none
          leading-[1.2]
        "
                value={dropdownValue}
                onChange={handleDropdownChange}
      >
        {/* <option value="" disabled>
          Time Period
        </option> */}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <span className="pointer-events-none absolute top-[15px] transform -translate-y-1/2 right-3 flex items-center">
        <svg
          className="w-3 h-3 text-[#858585]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>

        {/* <select
          value={dropdownValue}
          onChange={handleDropdownChange}
          className="min-w-[120px] border border-[#EFEFEF] px-3 py-2 rounded-[9px] text-[11.52px] text-[#858585] outline-none"
        >
          <option value="">Last 30 days</option>
          <option value="Last 60 days">Last 60 days</option>
          <option value="Last 90 days">Last 90 days</option>
        </select> */}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {operationalMetrics.map((metric, index) => (
          <div key={index} className="p-4 rounded-[6px] shadow-[0_0_2px_0_#3333331A] bg-white flex flex-col gap-y-1">
            <span className="text-[15.6px] text-[#A7AAAD]">{metric.title}</span>
            <span className="text-[24px] font-bold text-[#3C434A]">{metric.value}</span>
            <span className="text-[15.6px] text-[#A7AAAD]">{metric.description}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3 rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-4 flex flex-col bg-white">
          <div className="flex justify-between mb-4">
            <h2 className="text-left text-[24px] text-[#3C434A] font-semibold">Top Workshops</h2>
                        <div className="relative w-32">
      <select
        className="
          block w-full 
          bg-[#FFFFFF] 
          border border-[#EFEFEF] 
          text-[#858585] 
          text-[11.52px]
          rounded-[9px] 
          px-4 py-2 
          pr-10 
          appearance-none 
          focus:outline-none
          leading-[1.2]
        "
              value={state}
              onChange={(e)=> setState(e?.target?.value)}
      >
        {stateOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <span className="pointer-events-none absolute right-3 top-[15px] transform -translate-y-1/2">
        <svg
          className="w-3 h-3 text-[#858585]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
          </div>

          <div className="flex flex-col items-center gap-6 p-4">
            <div className="flex justify-center gap-4 px-1 py-2 rounded-lg">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#EE4037] rounded-full"></span>
                <span className="text-sm text-gray-600">2.8 Days</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#0AA7DC] rounded-full"></span>
                <span className="text-sm text-gray-600">3.8 Days</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#F59121] rounded-full"></span>
                <span className="text-sm text-gray-600">4.8 Days</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#652F8D] rounded-full"></span>
                <span className="text-sm text-gray-600">7.8 Days</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#21FF91] rounded-full"></span>
                <span className="text-sm text-gray-600">6.8 Days</span>
              </div>
            </div>

            <div className="relative w-[300px] h-[300px]">
              <div className="absolute left-10 top-24 w-40 h-40 bg-[#EE4037] rounded-full flex items-center justify-center text-[#FFFFFF] text-[8px] font-medium">Autofix</div>
              <div className="absolute left-[134px] top-[28px] w-20 h-20 bg-[#0AA7DC] rounded-full flex items-center justify-center text-[#FFFFFF] text-[8px]">Quick Repair</div>
              <div className="absolute left-[188px] top-[85px] w-20 h-20 bg-[#F59121] rounded-full flex items-center justify-center text-[#FFFFFF] text-[8px]">Quick Repair</div>
              <div className="absolute left-[199px] top-[165px] w-15 h-15 bg-[#652F8D] rounded-full flex items-center justify-center text-[#FFFFFF] text-[8px]">Quick Repair</div>
              <div className="absolute left-[255px] top-[130px] w-20 h-20 bg-[#21FF91] rounded-full flex items-center justify-center text-[#FFFFFF] text-[8px]">Quick Repair</div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-4 bg-white">
          <h2 className="text-[#A7AAAD] text-[16px]">Active Claims</h2>
          <h2 className="text-[#3C434A] text-[24px] font-semibold">126</h2>
          <div className="pt-10 mt-24">
            <div>
                        <Sparklines data={barData} width={600} height={100}>
                          <SparklinesLine
                            color="#21FF91"
                            style={{ fill: '#EFFFF8', fillOpacity: 0.8, strokeWidth: 2 }}
                          />
                        </Sparklines>
                      </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-[6px] shadow-[0_0_2px_0_#3333331A] bg-white space-y-4">
        <div className="flex justify-between text-[16px]">
          <h1 className="text-[24px] pb-2 text-[#3C434A] font-semibold">Top Workshops</h1>
          <p className="text-[#A7AAAD]">Avg Repair Time</p>
        </div>

        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-start border-b border-[#EFEFEFE5]">
            <div className="space-y-1 mb-4">
              <p className="text-[#5C5C5C] text-[16px]">Autofix</p>
            </div>
            <p className="text-[#5C5C5C] text-[16px]">May 29, 2025</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-4 bg-white">
        <div className="flex items-center gap-2">
          <p className="text-[16px] text-[#A7AAAD]">CSAT Score (TBD)</p>
          <span className="text-[#3C434A] text-[24px] font-semibold">4.6</span>
          <StarIcon className="text-yellow-500" />
          <StarIcon className="text-yellow-500" />
          <StarIcon className="text-yellow-500" />
        </div>
        <Button
          sx={{
            color: '#A7AAAD',
            fontSize: '16px',
            fontFamily: 'Geist'
          }}>
          More Details →
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsOperationalMetricsTab;