"use client";

import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Sparklines, SparklinesLine } from "react-sparklines";

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
];
  const barData = [10, 25, 5, 40, 15, 20, 5, 35, 50, 45, 60, 70, 40, 20, 10, 30];

export default function AverageClaimPage() {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs("2020-02-21"));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs("2020-02-21"));

  return (
    <div className="p-6 bg-[#FAFAFA] text-[#3C434A] font-Geist">
      <h2 className="text-xl font-semibold mb-1">Claim Success Rate</h2>
      <p className="text-sm text-[#8C97A7] mb-6">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-[#EFEFEF]">
          <p className="text-[#8C97A7] text-sm">Average Settlement Duration</p>
          <p className="text-2xl font-bold">8.7 Days</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#EFEFEF]">
          <p className="text-[#8C97A7] text-sm">Total Claims Processed</p>
          <p className="text-2xl font-bold">2350</p>
        </div>
        <div className="md:col-span-2 bg-white rounded-xl p-4 border border-[#EFEFEF]">
          <h3 className="text-sm font-medium mb-2">Overview</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={startDate}
            onChange={(newValue) => setStartDate(newValue ? dayjs(newValue) : null)}
            format="DD MMM, YYYY"
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  border: "1px solid #EFEFEF",
                  borderRadius: "10px",
                  width: "100%",
                  '& fieldset': { border: 'none' }
                },
              },
            }}
          />
          <DatePicker
            value={endDate}
            onChange={(newValue) => setEndDate(newValue ? dayjs(newValue) : null)}
            format="DD MMM, YYYY"
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  border: "1px solid #EFEFEF",
                  borderRadius: "10px",
                  width: "100%",
                  '& fieldset': { border: 'none' }
                },
              },
            }}
          />
        </LocalizationProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard label="Intimation to Assignment" value="1.2 Days" />
        <InfoCard label="Assignment to Document Receipt" value="2.1 Days" subtext="2340 claims with document received" />
        <InfoCard label="Assessment Duration" value="4.8 Days" subtext="2310 Assessment completed" />
        <InfoCard label="Repair Approval to Document Receipt" value="0.9 Days" subtext="2260 claims with Repair Document Receipt" />
        <InfoCard label="Vehicle Repair Time" value="5.6 Days" subtext="2270 Vehicles Repaired" />
        <InfoCard label="Vehicle Repair Time" value="1.5 Days" subtext="2250 Claims Approved" />
        <InfoCard label="Final Report Submission" value="1.5 Days" subtext="2250 Report Submission" />
      </div>
    </div>
  );
}

function InfoCard({ label, value, subtext }: { label: string; value: string; subtext?: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-[#EFEFEF]">
      <p className="text-sm text-[#8C97A7]">{label}</p>
      <p className="text-lg font-bold">{value}</p>
      {subtext && <p className="text-xs text-[#8C97A7] mt-1">{subtext}</p>}
    </div>
  );
}
