// ClaimSettlementBarChart.tsx
import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

type Timeframe = 'Daily' | 'Weekly' | 'Monthly'
type VehicleType = '2-Wheeler' | '4-Wheeler'

interface DataItem {
  date: string
  value: number
  timeframe: Timeframe
  vehicleType: VehicleType
}

// filter options
const TIMEFRAMES: Timeframe[] = ['Daily', 'Weekly', 'Monthly']
const VEHICLE_TYPES: VehicleType[] = ['2-Wheeler', '4-Wheeler']

// generate labels "01" through "18"
const DATES = Array.from({ length: 18 }, (_, i) =>
  (i + 1).toString().padStart(2, '0')
)

// mock data for every combo of timeframe × vehicleType × date
const ALL_DATA: DataItem[] = TIMEFRAMES.flatMap((tf) =>
  VEHICLE_TYPES.flatMap((vt) =>
    DATES.map((date) => ({
      date,
      timeframe: tf,
      vehicleType: vt,
      // random 0–120
      value: Math.floor(Math.random() * 121),
    }))
  )
)

const ClaimSettlementBarChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('Daily')
  const [vehicleType, setVehicleType] = useState<VehicleType>('2-Wheeler')

  // pick only the matching slice
  const data = useMemo(
    () =>
      ALL_DATA.filter(
        (d) => d.timeframe === timeframe && d.vehicleType === vehicleType
      ),
    [timeframe, vehicleType]
  )

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E9EDF7',
        borderRadius: 6,
        padding: 20,
        width: '100%',
      }}
    >
      {/* header + filters */}
<div className="flex justify-between items-center mb-4">
  <h2 className="m-0 text-lg font-medium">Overview</h2>
  <div className="flex gap-3">
    {/* Period */}
    <div className="relative w-25 bg-[#FFFFFF] border border-[#EFEFEF] rounded-[6px]">
      <select
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value as Timeframe)}
        className="
          block w-full
          bg-[#FFFFFF]
          border-none
          text-[#858585] text-[11.52px]
          rounded-[6px]
          px-3 py-2
          appearance-none
          focus:outline-none cursor-pointer
        "
      >
        {TIMEFRAMES.map((tf) => (
          <option key={tf} value={tf}>
            {tf}
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

    {/* Vehicle Type */}
    <div className="relative w-30 bg-[#FFFFFF] border border-[#EFEFEF] rounded-[6px]">
      <select
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value as VehicleType)}
        className="
          block w-full
          bg-[#FFFFFF]
          border-none
          text-[#858585] text-[11.52px]
          rounded-[6px]
          px-3 py-2
          appearance-none
          focus:outline-none cursor-pointer
        "
      >
        {VEHICLE_TYPES.map((vt) => (
          <option key={vt} value={vt}>
            {vt}
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
</div>


      {/* chart */}
      <ResponsiveContainer width="100%" height={230}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            label={{
              value: 'Number of Daily',
              position: 'insideBottom',
              dy: 30,
            }}
          />
          <YAxis
            label={{
              value: 'Number of Claims',
              angle: -90,
              position: 'insideLeft',
              dy: 60,
            }}
          />
          <Tooltip />
          <Bar dataKey="value" fill="#00FFA3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ClaimSettlementBarChart
