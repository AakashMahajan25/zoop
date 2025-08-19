'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import AuditorTable from '../AuditorTable';
import ClaimsDetails from '@/components/ClaimsDetails';
import IncreaseIcon from '@/assets/IncreaseIcon.svg';
import IncreaseIcon2 from '@/assets/IncreaseIcon2.svg';
import AgGridAuditorTable from './AgGridAuditorTable';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import ActiveClaims from '../adminSection/ActiveClaims';
import AverageClaimSettlementTime from '../adminSection/AverageClaimSettlementTime';
import ClaimsAssigned from '../adminSection/ClaimsAssigned';
import TotalClaimsProcessed from '../adminSection/TotalClaimsProcessed';
import TotalNoOfClaims from '../adminSection/TotalNoOfClaims';

interface RowData {
  id: number;
  name: string;
  quantity: number;
  insuranceProvider: string;
  claimHandler: string;
  status: string;
  amountApproved: number;
  fraudFlag: boolean;
}

const Auditor: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [trend, setTrend] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('');
  const [insuranceCompany, setInsuranceCompany] = useState<string>('');
  const [claimType, setClaimType] = useState<string>('');
  const [claimHandler, setClaimHandler] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [hovered, setHovered] = useState<number | null>(null);
  const [steps, setSteps] = useState<string>("home");

  const handleViewDetailModal = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) setSelectedRow(null);
  };

  const metrics = [
    { title: "Total no. of Claims", value: "1250" },
    { title: "Total Claims Processed", value: "1250" },
    { title: "Average Claim Settlement Time", value: "6 Days" },
    { title: "Claims Assigned", value: "1250" },
    { title: "Fraud Detections", value: "50" },
    { title: "Total Amount Approved", value: "760" },
    { title: "Average Claim Amount", value: "₹3,450" },
    { title: "Invoices Processed", value: "3,450" }
  ];
  const ClickableMetricTab = [
    "Total no. of Claims",
    "Total Claims Processed",
    "Claims Assigned",
    "Average Claim Settlement Time"
  ];

  const dummyRowData = [
    {
      id: 1,
      name: 'John Doe',
      quantity: 10000,
      insuranceProvider: 'LIC',
      claimHandler: 'Handler A',
      status: 'estimateapproved',
      amountApproved: 7500,
      fraudFlag: false,
    },
    {
      id: 2,
      name: 'Jane Smith',
      quantity: 12000,
      insuranceProvider: 'HDFC Ergo',
      claimHandler: 'Handler B',
      status: 'assessmentPending',
      amountApproved: 0,
      fraudFlag: true,
    },
    {
      id: 3,
      name: 'Robert Johnson',
      quantity: 8000,
      insuranceProvider: 'ICICI Lombard',
      claimHandler: 'Handler C',
      status: 'draft',
      amountApproved: 0,
      fraudFlag: false,
    },
    {
      id: 4,
      name: 'Sarah Williams',
      quantity: 15000,
      insuranceProvider: 'Bajaj Allianz',
      claimHandler: 'Handler D',
      status: 'completed',
      amountApproved: 12000,
      fraudFlag: false,
    },
    {
      id: 5,
      name: 'Michael Brown',
      quantity: 9000,
      insuranceProvider: 'New India Assurance',
      claimHandler: 'Handler E',
      status: 'finalReportSent',
      amountApproved: 8500,
      fraudFlag: true,
    },
    {
      id: 6,
      name: 'Emily Davis',
      quantity: 11000,
      insuranceProvider: 'United India',
      claimHandler: 'Handler F',
      status: 'dischargedapproved',
      amountApproved: 9500,
      fraudFlag: false,
    },
    {
      id: 7,
      name: 'David Wilson',
      quantity: 13000,
      insuranceProvider: 'Oriental Insurance',
      claimHandler: 'Handler G',
      status: 'reAllocate',
      amountApproved: 0,
      fraudFlag: true,
    },
    {
      id: 8,
      name: 'Lisa Taylor',
      quantity: 7500,
      insuranceProvider: 'Star Health',
      claimHandler: 'Handler H',
      status: 'assessmentactive',
      amountApproved: 7000,
      fraudFlag: false,
    },
  ];


  return (
    <>
      {!isModalOpen ? (
        <div className="bg-[#FBFBFB]">
          {/* Breadcrumb */}
          {steps !== "home" ? (
            <nav className="px-6 py-6 flex items-center text-sm font-geist">
              <span
                className="cursor-pointer text-[15px] text-[#999999] hover:underline"
                onClick={() => {
                  setSteps("home");
                  setSelectedCard("");
                }}
              >
                Top Line Metrics
              </span>
              <span className="mx-2 text-[#858585]">/</span>
              <span className="text-[#333333] text-[15px] font-medium">
                {selectedCard}
              </span>
            </nav>
          ) : (<>
            <div className="my-8 px-6 text-[#333333]">
              <h1 className="text-[24px] font-semibold mb-2 text-[#5C5C5C]">Top‑Line Metrics Dashboard</h1>
              <p className="text-[#858585] text-[18px]">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
            </div>

            <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {metrics.map((metric, index) => {
                const isClickable = ClickableMetricTab.includes(metric.title);
                const isSelected = metric.title === selectedCard;
                return (
                  <div
                    key={index}
                    className={`
                    bg-white rounded-[6px] shadow-[0_0_2px_0_#3333331A]
                    ${isSelected ? 'border border-[#21FF91]' : 'none'}
                    py-6 px-4 relative
                    ${isClickable ? 'hover:border-[#21FF91] cursor-pointer' : ''}
                  `}
                    onMouseEnter={() => isClickable && setHovered(index)}
                    onMouseLeave={() => isClickable && setHovered(null)}
                    onClick={() => {
                      if (!isClickable) return;
                      setSelectedCard(metric.title);
                      switch (metric.title) {
                        case "Average Claim Settlement Time":
                          setSteps("AverageClaimSettlementTime"); break;
                        case "Total no. of Claims":
                          setSteps("TotalNoOfClaims"); break;
                        case "Claims Assigned":
                          setSteps("ClaimsAssigned"); break;
                        case "Total Claims Processed":
                          setSteps("TotalClaimsProcessed"); break;
                        case "Active Claims":
                          setSteps("ActiveClaims"); break;
                      }
                    }}
                  >
                    {isClickable && (
                      <div className="absolute top-4 right-4">
                        {(isSelected) ? (
                          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 2.75H4.58333C4.0971 2.75 3.63079 2.94315 3.28697 3.28697C2.94315 3.63079 2.75 4.0971 2.75 4.58333V17.4167C2.75 17.9029 2.94315 18.3692 3.28697 18.713C3.63079 19.0568 4.0971 19.25 4.58333 19.25H17.4167C17.9029 19.25 18.3692 19.0568 18.713 18.713C19.0568 18.3692 19.25 17.9029 19.25 17.4167V11" stroke="#21FF91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12.8333 13.7493H8.25V9.16602" stroke="#21FF91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.6641 2.75H19.2474V7.33333" stroke="#21FF91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.25 2.75L8.25 13.75" stroke="#21FF91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 2.75H4.58333C4.0971 2.75 3.63079 2.94315 3.28697 3.28697C2.94315 3.63079 2.75 4.0971 2.75 4.58333V17.4167C2.75 17.9029 2.94315 18.3692 3.28697 18.713C3.63079 19.0568 4.0971 19.25 4.58333 19.25H17.4167C17.9029 19.25 18.3692 19.0568 18.713 18.713C19.0568 18.3692 19.25 17.9029 19.25 17.4167V11" stroke="#787C82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12.8333 13.7493H8.25V9.16602" stroke="#787C82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.6641 2.75H19.2474V7.33333" stroke="#787C82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.25 2.75L8.25 13.75" stroke="#787C82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    )}
                    <div className="text-[#A7AAAD] text-[15.6px] mb-1 font-normal">
                      {metric.title}
                    </div>
                    <div className="text-[24px] text-[#3C434A] font-semibold">
                      {metric.value}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className='px-6'>
              <AgGridAuditorTable
                setSelectedRow={setSelectedRow}
                viewDetailModal={handleViewDetailModal}
                searchTerm={searchTerm}
                rowData={dummyRowData}
              />
            </div>
          </>)}
          {/* Detail Views */}
           <div className='px-6'>
          {steps === "AverageClaimSettlementTime" && <AverageClaimSettlementTime />}
          {steps === "TotalNoOfClaims" && <TotalNoOfClaims />}
          {steps === "ClaimsAssigned" && <ClaimsAssigned />}
          {steps === "TotalClaimsProcessed" && <TotalClaimsProcessed />}
          {steps === "ActiveClaims" && <ActiveClaims />}
          </div>
        </div>
      ) : (
        <ClaimsDetails
          selectedRow={selectedRow}
          onClose={() => handleViewDetailModal(false)}
        />
      )}
    </>
  );
};

export default Auditor;