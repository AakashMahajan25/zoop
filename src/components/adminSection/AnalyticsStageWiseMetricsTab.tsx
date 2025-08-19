import React, { useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import Image from 'next/image';
import StageWiseBarChart from "./charts/StageWiseBarChart";

export default function AnalyticsStageWiseMetricsTab() {
  const [dropdowns, setDropdowns] = useState<string[]>(["Daily", "2-Wheeler"]);

  const handleDropdownChange = (idx: number, value: string) => {
    const next = [...dropdowns];
    next[idx] = value;
    setDropdowns(next);
  };

  // base stage data
  const baseStageData = [
    { stage: 'Intimation to Assignment',            value: 1.0 },
    { stage: 'Assignment to\nDocument Receipt',     value: 2.3 },
    { stage: 'Assessment Duration',                 value: 4.6 },
    { stage: 'Repair Approval to\nDocument Receipt',value: 0.2 },
    { stage: 'Vehicle Repair Time',                 value: 5.0 },
    { stage: 'Final Report\nSubmission',             value: 1.0 },
    { stage: 'Vehicle Repair Time',                 value: 1.2 }
  ];

  // mocks for other filters
  const allData: Record<string, typeof baseStageData> = {
    "Daily-2-Wheeler":   baseStageData,
    "Daily-4-Wheeler":   baseStageData.map(d => ({ ...d, value: d.value + 1 })),
    "Daily-All":         baseStageData.map(d => ({ ...d, value: d.value * 0.8 })),
    "Weekly-2-Wheeler":  baseStageData.map(d => ({ ...d, value: d.value * 0.5 })),
    "Weekly-4-Wheeler":  baseStageData.map(d => ({ ...d, value: d.value * 0.6 })),
    "Monthly-2-Wheeler": baseStageData.map(d => ({ ...d, value: d.value * 0.3 })),
    "Monthly-4-Wheeler": baseStageData.map(d => ({ ...d, value: d.value * 0.4 })),
    "Monthly-All":       baseStageData.map(d => ({ ...d, value: d.value * 0.2 })),
  };
  const key = `${dropdowns[0]}-${dropdowns[1]}`;
  const filteredData = allData[key] || [];

  // chart settings
  const chartSetting = {
    xAxis: [{
      dataKey: 'stage',
      scaleType: 'band',
      label: 'Stage-Wise',
      labelProps: {
        position: 'bottom',
        textAnchor: 'middle',
        dy: 40
      },
      tickInterval: () => true,      // force every tick
      tickPlacement: 'middle',
      tickLabelProps: {
        angle: 0,
        textAnchor: 'middle',
        dy: -10,
        style: {
          fontSize: 12,
          whiteSpace: 'pre-wrap',     // honor our \n
          lineHeight: '1.2em',
        },
      }
    }],
    yAxis: [{
      label: 'Average Time in Days',
      labelProps: {
        angle: -90,
        position: 'insideLeft',
        textAnchor: 'middle'
      }
    }],
    series: [{
      dataKey: 'value',
      color: '#21FF91',
      barSize: 32,
      borderRadius: 4
    }],
    legend: false,
    height: 300,
    margin: { top: 20, right: 30, left: 60, bottom: 140 }  // room for 2-lines
  };

  const selectClass =
    "border border-[#E9EDF7] bg-white rounded-md px-3 py-2 text-[11.52px] font-geist font-normal leading-[19.75px] text-[#333333]";

  return (
    <div className="mb-8">
      <div className="text-[#333333] mb-8">
        <h2 className="text-[24px] font-medium mb-1">Stage-Wise Metrics</h2>
        <p className="text-[#858585] text-[18px]">
          Average duration at each stage of the claims process.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT CARDS */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {[
            ["8.7 Days", "Average Settlement Duration"],
            ["2350",     "Total Claims Processed"]
          ].map(([val, label], i) => (
            <div key={i} className="border border-[#E9EDF7] bg-white rounded-[6px] shadow-[0_0_2px_0_#3333331A] p-6">
              <Image src="/assets/fileIcon.svg" alt="icon" width={48} height={45}/>
              {/* <div className="w-12 h-12 flex items-center justify-center border border-[#FFC268] rounded-full mb-4">
                <Image src="/assets/fileIcon.svg" alt="icon" width={24} height={24}/>
              </div> */}
              <p className="text-[24px] font-semibold text-[#3C434A]">{val}</p>
              <p className="text-[16px] text-[#A7AAAD]">{label}</p>
            </div>
          ))}
        </div>

        {/* RIGHT CHART */}
        <StageWiseBarChart />
      </div>
    </div>
  );
}
