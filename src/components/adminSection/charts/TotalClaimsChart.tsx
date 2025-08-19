import React, { JSX, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
  Label,
  TooltipProps
} from 'recharts';

// base daily data 01–24
const baseDaily = [
  { date: '01', claims: 0 },
  { date: '02', claims: 30 },
  { date: '03', claims: 30 },
  { date: '04', claims: 38 },
  { date: '05', claims: 29 },
  { date: '06', claims: 15 },
  { date: '07', claims: 43 },
  { date: '08', claims: 67 },
  { date: '09', claims: 52 },
  { date: '10', claims: 65 },
  { date: '11', claims: 13 },
  { date: '12', claims: 75 },
  { date: '13', claims: 88 },
  { date: '14', claims: 82 },
  { date: '15', claims: 63 },
  { date: '16', claims: 20 },
  { date: '17', claims: 8  }, // highlight
  { date: '18', claims: 25 },
  { date: '19', claims: 0  },
  { date: '20', claims: 45 },
  { date: '21', claims: 32 },
  { date: '22', claims: 55 },
  { date: '23', claims: 50 },
  { date: '24', claims: 80 },
];

// some weekly & monthly mock
const baseWeekly = [
  { date: 'W1', claims: 120 },
  { date: 'W2', claims: 150 },
  { date: 'W3', claims: 130 },
  { date: 'W4', claims: 170 },
  { date: 'W5', claims: 140 },
];
const baseMonthly = [
  { date: 'Jan', claims: 400 },
  { date: 'Feb', claims: 420 },
  { date: 'Mar', claims: 440 },
  { date: 'Apr', claims: 460 },
  { date: 'May', claims: 480 },
  { date: 'Jun', claims: 500 },
  { date: 'Jul', claims: 520 },
  { date: 'Aug', claims: 540 },
  { date: 'Sep', claims: 560 },
  { date: 'Oct', claims: 580 },
  { date: 'Nov', claims: 600 },
  { date: 'Dec', claims: 620 },
];

// assemble full rawData with all filter combinations
const rawData = [
  // Daily → various vehicles/regions/statuses
  ...baseDaily.map(d => ({ ...d, period: 'Daily',   vehicle: '2-Wheeler', region: 'Maharashtra', status: 'All' })),
  ...baseDaily.map(d => ({ ...d, period: 'Daily',   vehicle: '4-Wheeler', region: 'Maharashtra', status: 'All', claims: d.claims + 10 })),
  ...baseDaily.map(d => ({ ...d, period: 'Daily',   vehicle: '2-Wheeler', region: 'Karnataka',   status: 'All', claims: d.claims + 20 })),
  ...baseDaily.map(d => ({ ...d, period: 'Daily',   vehicle: '2-Wheeler', region: 'Maharashtra', status: 'Complete',   claims: d.claims + 30 })),
  ...baseDaily.map(d => ({ ...d, period: 'Daily',   vehicle: '2-Wheeler', region: 'Maharashtra', status: 'Uploaded',   claims: d.claims + 40 })),
  ...baseDaily.map(d => ({ ...d, period: 'Daily',   vehicle: '2-Wheeler', region: 'Maharashtra', status: 'Rejected',   claims: Math.max(d.claims - 5, 0) })),
  // Weekly / Monthly only for default vehicle/region/status
  ...baseWeekly.map(d => ({ ...d, period: 'Weekly', vehicle: '2-Wheeler', region: 'Maharashtra', status: 'All' })),
  ...baseMonthly.map(d => ({ ...d, period: 'Monthly',vehicle: '2-Wheeler', region: 'Maharashtra', status: 'All' })),
];

function CustomTooltip({
  active,
  payload,
  label
}: TooltipProps<number, string>): JSX.Element | null {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-2 text-center shadow-lg font-geist">
      <div className="text-[16px] font-semibold text-[#3C434A]">{label}</div>
      <div className="text-[12px] text-[#858585]">{`Claims ${payload[0].value}`}</div>
    </div>
  );
}

export default function TotalClaimsChart() {
  const [period, setPeriod]   = useState('Daily');
  const [vehicle, setVehicle] = useState('4-Wheeler');
  const [region, setRegion]   = useState('Maharashtra');
  const [status, setStatus]   = useState('All');

  const periodOptions  = ['Daily', 'Weekly', 'Monthly'];
  const vehicleOptions = ['2-Wheeler', '4-Wheeler', 'All'];
  const regionOptions  = ['Maharashtra', 'Karnataka', 'All'];
  const statusOptions  = ['All', 'Complete', 'Uploaded', 'Rejected'];

  // filter data
  const filteredData = rawData
    .filter(d => d.period  === period)
    .filter(d => vehicle === 'All' ? true : d.vehicle === vehicle)
    .filter(d => region  === 'All' ? true : d.region  === region)
    .filter(d => status  === 'All' ? true : d.status  === status);

  // reference highlight
  const highlightX     = '17';
  const highlightPoint = filteredData.find(d => d.date === highlightX);

  // shared select styling
  const selectClass = "border border-[#EFEFEF] px-3 py-2 rounded-md font-geist text-sm text-[#858585] font-normal text-[11.52px] leading-[19.75px]";

  return (
    <div className="bg-white rounded-lg p-6 border border-[#E9EDF7]">
      <h2 className="text-[20px] font-medium mb-4 font-geist">Total no. of Claims</h2>
{/* 
      <div className="flex justify-end space-x-4 mb-6">
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className={selectClass}
        >
          {periodOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <select
          value={vehicle}
          onChange={e => setVehicle(e.target.value)}
          className={selectClass}
        >
          {vehicleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <select
          value={region}
          onChange={e => setRegion(e.target.value)}
          className={selectClass}
        >
          {regionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className={selectClass}
        >
          {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div> */}
        <div className="flex justify-end space-x-4 mb-6 px-7">
  {/* Period */}
  <div className="relative w-25">
    <select
      value={period}
      onChange={e => setPeriod(e.target.value)}
      className="
        block w-full
        bg-[#FFFFFF]
        border border-[#EFEFEF]
        text-[#858585]
        text-[11.52px]
        rounded-[6px]
        px-3 py-2
        pr-10
        appearance-none
        focus:outline-none cursor-pointer
      "
    >
      {periodOptions.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
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

  {/* Vehicle */}
  <div className="relative w-30">
    <select
      value={vehicle}
      onChange={e => setVehicle(e.target.value)}
      className="
        block w-full
        bg-[#FFFFFF]
        border border-[#EFEFEF]
        text-[#858585]
        text-[11.52px]
        rounded-[6px]
        px-4 py-2
        pr-10
        appearance-none
        focus:outline-none cursor-pointer
      "
    >
      {vehicleOptions.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
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

  {/* Region */}
  <div className="relative w-35">
    <select
      value={region}
      onChange={e => setRegion(e.target.value)}
      className="
        block w-full
        bg-[#FFFFFF]
        border border-[#EFEFEF]
        text-[#858585]
        text-[11.52px]
        rounded-[6px]
        px-4 py-2
        pr-10
        appearance-none
        focus:outline-none cursor-pointer
      "
    >
      {regionOptions.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
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

  {/* Status */}
  <div className="relative w-20">
    <select
      value={status}
      onChange={e => setStatus(e.target.value)}
      className="
        block w-full
        bg-[#FFFFFF]
        border border-[#EFEFEF]
        text-[#858585]
        text-[11.52px]
        rounded-[6px]
        px-4 py-2
        pr-10
        appearance-none
        focus:outline-none cursor-pointer
      "
    >
      {statusOptions.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
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
</div>



      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 0, bottom: 15 }}
        >
          <CartesianGrid stroke="#F3F3F3" />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            label={{
              value: 'Number of Daily',
              position: 'bottom',
              offset: 0,
              fontSize: 12,
              textAnchor: 'middle'
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: 'Number of Claims',
              angle: -90,
              position: 'insideLeft',
              fontSize: 12,
              textAnchor: 'middle',
              dy: 50, 
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          {highlightPoint && (
            <>
              <ReferenceLine x={highlightX} stroke="#787C82" strokeDasharray="4 4">
                <Label value={`08 April ${highlightX}`} position="top" fill="#000" fontSize={12}/>
              </ReferenceLine>
              <ReferenceDot
                x={highlightX}
                y={highlightPoint.claims}
                r={4}
                fill="#FFFFFF"
                stroke="#787C82"
                strokeWidth={2}
              />
            </>
          )}

          <Area type="linear" dataKey="claims" fill="#EFFFF8" stroke="none" />
          <Line type="linear" dataKey="claims" stroke="#21FF91" strokeWidth={2} dot={false}/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
