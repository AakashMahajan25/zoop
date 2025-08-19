// StageWiseBarChart.tsx
import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

type Timeframe = 'Daily' | 'Weekly' | 'Monthly'
type VehicleType = '2-Wheeler' | '4-Wheeler'

interface DataItem {
  stage: string
  averageTime: number
  timeframe: Timeframe
  vehicleType: VehicleType
}

const TIMEFRAMES: Timeframe[] = ['Daily', 'Weekly', 'Monthly']
const VEHICLE_TYPES: VehicleType[] = ['2-Wheeler', '4-Wheeler']

const STAGES = [
  'Intimation to Assignment',
  'Assignment to Document Receipt',
  'Assessment Duration',
  'Repair Approval to Document Receipt',
  'Vehicle Repair Time',
  'Final Report Submission',
  'Vehicle Repair Time',
]

// mock data
const ALL_DATA: DataItem[] = TIMEFRAMES.flatMap((tf) =>
  VEHICLE_TYPES.flatMap((vt) =>
    STAGES.map((stage) => ({
      stage,
      timeframe: tf,
      vehicleType: vt,
      averageTime: parseFloat((Math.random() * 10).toFixed(1)),
    }))
  )
)

// select styling from your sample
const selectClass =
  'border border-[#EFEFEF] px-3 py-2 rounded-md font-geist text-sm text-[#858585] font-normal text-[11.52px] leading-[19.75px]'

// custom tick to render each word on its own line
interface CustomizedAxisTickProps {
  x?: number
  y?: number
  payload?: { value: string }
}
const CustomizedAxisTick: React.FC<Required<CustomizedAxisTickProps>> = ({
  x,
  y,
  payload,
}) => {
  const words = payload.value.split(' ')
  return (
    <g transform={`translate(${x},${y! + 10})`}>
      {words.map((word, index) => (
        <text
          key={index}
          x={0}
          y={index * 14}
          textAnchor="middle"
          fill="#707B81"
          style={{
            fontFamily: 'Geist',
            fontWeight: 600,
            fontSize: '11px',
            letterSpacing: '1%',
            textAlign: 'center',
            lineHeight: '100%',
          }}
        >
          {word}
        </text>
      ))}
    </g>
  )
}

const StageWiseBarChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('Daily')
  const [vehicleType, setVehicleType] = useState<VehicleType>('2-Wheeler')

  const data = useMemo(
    () =>
      ALL_DATA.filter(
        (d) => d.timeframe === timeframe && d.vehicleType === vehicleType
      ).sort((a, b) => STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage)),
    [timeframe, vehicleType]
  )

  return (
    <div
      style={{
        width: '100%',
        padding: 20,
        background: '#FFFFFF',
        borderRadius: 6,
        border: '1px solid #E9EDF7',
      }}
    >
      {/* header + filters */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-medium font-geist m-0">Overview</h2>
        <div className="flex space-x-4">
  {/* Timeframe */}
  <div className="relative w-25">
    <select
      value={timeframe}
      onChange={(e) => setTimeframe(e.target.value as Timeframe)}
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
        focus:outline-none
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
  <div className="relative w-30">
    <select
      value={vehicleType}
      onChange={(e) => setVehicleType(e.target.value as VehicleType)}
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
        focus:outline-none
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

        {/* <div className="flex space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as Timeframe)}
            className={selectClass}
          >
            {TIMEFRAMES.map((tf) => (
              <option key={tf} value={tf}>
                {tf}
              </option>
            ))}
          </select>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value as VehicleType)}
            className={selectClass}
          >
            {VEHICLE_TYPES.map((vt) => (
              <option key={vt} value={vt}>
                {vt}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      {/* chart */}
      <ResponsiveContainer width="100%" height={232}>
        <BarChart
          data={data}
          margin={{
            top: 30,
            right: 30,
            left: 60,
            bottom: 60, // room for multiline labels + X-axis label
          }}
        >
          <XAxis
            dataKey="stage"
            height={80}
            interval={0}
            tick={(props) => (
              <CustomizedAxisTick
                x={props.x}
                y={props.y}
                payload={props.payload as { value: string }}
              />
            )}
            label={{
              value: 'Stage Wise',
              position: 'insideBottom',
              dy: 60,
              fill: '#707B81',
              style: {
                fontFamily: 'Geist',
                fontWeight: 500,
                fontSize: '10px',
                letterSpacing: '1%',
                textAlign: 'center',
                lineHeight: '100%',
              },
            }}
          />
          <YAxis
            label={{
              value: 'Average Time in Days',
              angle: -90,
              position: 'insideLeft',
              dy: 50,
              fill: '#707B81',
              style: {
                fontFamily: 'Geist',
                fontWeight: 500,
                fontSize: '10px',
                letterSpacing: '1%',
                textAlign: 'center',
                lineHeight: '100%',
              },
            }}
          />
          <Tooltip />
          <Bar dataKey="averageTime" fill="#00FFA3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StageWiseBarChart
