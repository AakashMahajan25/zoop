'use client'
import { NextPage } from 'next'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Area, PieChart, Pie, Cell, Legend,
  AreaChart
} from 'recharts'
import { useState } from 'react'
import Head from 'next/head'

type StatCard = { label: string; value: number; color: string }
const stats: StatCard[] = [
  { label: 'Unassigned', value: 4, color: 'bg-orange-100 text-orange-600' },
  { label: 'Missing Doc', value: 3, color: 'bg-gray-100 text-gray-600' },
  { label: 'In Review', value: 47, color: 'bg-purple-100 text-purple-600' },
  { label: 'In Progress', value: 15, color: 'bg-red-100 text-red-600' },
]

const lineData = [
  { month: 'Jun', claims: 0 },
  { month: 'Jul', claims: 20 },
  { month: 'Aug', claims: 35 },
  { month: 'Sep', claims: 25 },
  { month: 'Oct', claims: 45 },
  { month: 'Nov', claims: 15 },
  { month: 'Dec', claims: 60 },
]

const pieData = [
  { name: 'Category 1', value: 52 },
  { name: 'Category 2', value: 32 },
  { name: 'Category 3', value: 20 },
]

const COLORS = ['#00FFA3', '#000000', '#6B7280']

type Claim = {
  id: string, 
  ins: string, 
  type: string,
  created: string, 
  updated: string,
  status: 'Pending' | 'In Progress' | 'Rejected',
  handler?: string
}

const InitialDashboard: NextPage = () => {
  const [lineRange, setLineRange] = useState<'Jun,2020'|'Dec,2020'>('Dec,2020')
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(null)
  const [claims, setClaims] = useState<Claim[]>(Array(5).fill(0).map((_, i) => ({
    id: `CL-${Math.floor(100000 + Math.random() * 900000)}`,
    ins: `MH${Math.floor(10 + Math.random() * 90)}AB${Math.floor(1000 + Math.random() * 9000)}`,
    type: ['Theft', 'Accident', 'Natural Disaster'][i % 3],
    created: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    updated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: ['Pending','In Progress','Rejected'][i % 3] as any,
    handler: i % 3 === 1 ? 'John Doe' : undefined
  })))
  const [assigning, setAssigning] = useState<string | null>(null)

  // Calculate claim counts for stat cards
  const dueTodayClaims = claims.filter(claim => {
    const today = new Date().toLocaleDateString('en-US')
    return claim.created === today
  }).length

  const draftClaims = claims.filter(claim => claim.status === 'Pending').length
  const reallocateClaims = claims.filter(claim => claim.status === 'Rejected').length
  const pastDueClaims = claims.filter(claim => {
    const createdDate = new Date(claim.created)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return createdDate < sevenDaysAgo && claim.status !== 'Rejected'
  }).length

  const handleAssign = (claimId: string) => {
    setAssigning(claimId)
    // Simulate API call
    setTimeout(() => {
      setClaims(prev => prev.map(claim => 
        claim.id === claimId 
          ? { ...claim, handler: 'John Doe', status: 'In Progress' } 
          : claim
      ))
      setAssigning(null)
    }, 1000)
  }

const renderLabel = ({ percent, x, y }: any) => (
  <text
    x={x}
    y={y}
    fill="#8C97A7"
    textAnchor="middle"
    dominantBaseline="central"
    fontSize={12}
  >
    {(percent * 100).toFixed(0)}%
  </text>
);

  const handleUnassign = (claimId: string) => {
    setAssigning(claimId)
    // Simulate API call
    setTimeout(() => {
      setClaims(prev => prev.map(claim => 
        claim.id === claimId 
          ? { ...claim, handler: undefined, status: 'Pending' } 
          : claim
      ))
      setAssigning(null)
    }, 1000)
  }

  const handleStatusFilterClick = (filterType: string) => {
    setActiveStatusFilter(activeStatusFilter === filterType ? null : filterType)
  }

  return (
    <>
      <Head>
        <title>Claims Dashboard</title>
      </Head>
      <div className="md:p-4 space-y-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-[24px] md:text-2xl font-medium text-[#5C5C5C]">Claims Detection Overview</h1>
          <p className="text-[18px] md:text-base text-[#858585]">Monitor and process claims efficiently</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div
            onClick={() => handleStatusFilterClick('dueToday')}
            className={`bg-white rounded-lg p-4 border ${
              activeStatusFilter === 'dueToday' ? 'border-[#FF9F43]' : 'border-gray-200'
            } cursor-pointer hover:shadow-md transition-shadow relative`}
            role="button"
            aria-label="Filter by due today claims"
          >
            <div className="relative z-10">
              <p className="text-[24px] text-[#3C434A]">{dueTodayClaims}</p>
              <p className="text-[#A7AAAD] text-[16px]">Unassigned</p>
            </div>
              <img
                src="/assets/fileIcon.svg"
                alt=""
                className="w-12 h-12 absolute top-2 right-2"
              />
          </div>

          {/* Draft */}
          <div
            onClick={() => handleStatusFilterClick('draft')}
            className={`bg-white rounded-lg p-4 border ${
              activeStatusFilter === 'draft' ? 'border-[#787C82]' : 'border-gray-200'
            } cursor-pointer hover:shadow-md transition-shadow relative`}
            role="button"
            aria-label="Filter by draft claims"
          >
            <div className="relative z-10">
              <p className="text-[24px] text-[#3C434A]">{draftClaims}</p>
              <p className="text-[#A7AAAD] text-[16px]">Draft</p>
            </div>
            <img
                src="/assets/fileIconGray.svg"
                alt=""
                className="w-12 h-12 absolute top-2 right-2"
              />
          </div>

          {/* Re-allocate */}
          <div
            onClick={() => handleStatusFilterClick('reallocate')}
            className={`bg-white rounded-lg p-4 border ${
              activeStatusFilter === 'reallocate' ? 'border-[#6235FF]' : 'border-gray-200'
            } cursor-pointer hover:shadow-md transition-shadow relative`}
            role="button"
            aria-label="Filter by re-allocate claims"
          >
            <div className="relative z-10">
              <p className="text-[24px] text-[#3C434A]">{reallocateClaims}</p>
              <p className="text-[#A7AAAD] text-[16px]">Re-allocate</p>
            </div>
            <img
                src="/assets/fileBlue.svg"
                alt=""
                className="w-12 h-12 absolute top-2 right-2"
              />
          </div>

          {/* Past Due Date */}
          <div
            onClick={() => handleStatusFilterClick('pastDue')}
            className={`bg-white rounded-lg p-4 border ${
              activeStatusFilter === 'pastDue' ? 'border-[#EA5455]' : 'border-gray-200'
            } cursor-pointer hover:shadow-md transition-shadow relative`}
            role="button"
            aria-label="Filter by past due claims"
          >
            <div className="relative z-10">
              <p className="text-[24px] font-bold text-[#3C434A]">{pastDueClaims}</p>
              <p className="text-[#A7AAAD] text-[16px]">Past Due Date</p>
            </div>
            <img
                src="/assets/fileRed.svg"
                alt=""
                className="w-12 h-12 absolute top-2 right-2"
              />
          </div>
        </div>

        {/* Charts - Responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Line chart */}
          <div className="bg-white p-3 md:p-4 rounded-md border border-[#E9EDF7] col-span-1 lg:col-span-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-[20px] text-[#212227] md:text-base font-medium">Claims Overview</h2>
              <div className='flex gap-4'>
                <select
                className="border border-[#EFEFEF] text-[#858585] rounded px-2 py-1 text-xs md:text-sm"
                onChange={e => setLineRange(e.target.value as any)}
                value={lineRange}
              >
                <option value="Dec,2020">Dec,2020</option>
                <option value="Jun,2020">Jun,2020</option>
              </select>
              <select
                className="border border-[#EFEFEF] text-[#858585] rounded px-2 py-1 text-xs md:text-sm"
                onChange={e => setLineRange(e.target.value as any)}
                value={lineRange}
              >
                <option value="Dec,2020">Dec,2020</option>
                <option value="Jun,2020">Jun,2020</option>
              </select>
              </div>
            </div>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <AreaChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="claims" stroke="#10B981" fill="rgba(16,185,129,0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie chart */}
          <div className="bg-white col-span-2 p-3 md:p-4 rounded-md border border-[#E9EDF7]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-[20px] text-[#222529] md:text-base font-medium">Claim Progress</h2>
              <select className="border border-[#EFEFEF] text-[#858585] rounded px-2 py-1 text-xs md:text-sm" defaultValue="Jun,2020">
                <option value="Jun,2020">Jun,2020</option>
              </select>
            </div>
            <div className="flex items-center">
      {/* Left: Donut chart */}
      <div className="w-[215px] h-[250px]">
        <ResponsiveContainer>
          <PieChart>
  <Pie
    data={pieData}
    innerRadius={70}
    outerRadius={90}
    dataKey="value"
    labelLine={false}
    label={renderLabel}
  >
    {pieData.map((_, index) => (
      <Cell key={index} fill={COLORS[index]} />
    ))}
  </Pie>
</PieChart>

        </ResponsiveContainer>
      </div>

      {/* Right: Labels + Percentage */}
      <div className="ml-6 space-y-3">
        {pieData.map((entry, index) => (
          <div key={entry.name} className="flex items-center space-x-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-sm text-gray-700">{entry.name}</span>
            <span className="ml-auto font-semibold text-sm text-black">
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
          </div>
        </div>

        {/* Table - Responsive with overflow */}
        <div className="bg-white p-3 md:p-4 rounded-lg overflow-x-auto">
          <table className="w-full text-left min-w-[800px] md:min-w-0">
            <thead className="bg-[#F8F8F8] px-2">
              <tr className="text-[14px] text-[#858585] font-normal md:text-sm">
                {['Claim No','Insurance','Type','Created','Updated','Status','Actions'].map(h => (
                  <th key={h} className="py-2 pr-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className='text-[16px] text-[#5C5C5C]'>
              {claims.map((row) => (
                <tr key={row.id} className="border-b border-[#EFEFEFE5] hover:bg-gray-50">
                  <td className="py-3 pr-2 text-xs md:text-sm">{row.id}</td>
                  <td className="pr-2 text-xs md:text-sm">{row.ins}</td>
                  <td className="pr-2 text-xs md:text-sm">{row.type}</td>
                  <td className="pr-2 text-xs md:text-sm">{row.created}</td>
                  <td className="pr-2 text-xs md:text-sm">{row.updated}</td>
                  <td className="pr-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        row.status === 'Pending'
                          ? 'text-orange-600'
                          : row.status === 'In Progress'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                    {row.status}
                    </span>
                  </td>
                  <td className="pr-2 text-[#000000]">
                    {row.handler ? (
                      <button 
                        onClick={() => handleUnassign(row.id)}
                        disabled={assigning === row.id}
                        className="text-xs md:text-sm px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        {assigning === row.id ? 'Processing...' : 'Unassign'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleAssign(row.id)}
                        disabled={assigning === row.id}
                        className="text-xs md:text-sm px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        {assigning === row.id ? 'Assigning...' : 'Assign +'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default InitialDashboard