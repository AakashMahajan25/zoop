// AnalyticsTopLineMetricsTab.tsx
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import AverageClaimSettlementTime from "@/components/adminSection/AverageClaimSettlementTime";
import TotalNoOfClaims from "./TotalNoOfClaims";
import ClaimsAssigned from "./ClaimsAssigned";
import ActiveClaims from "@/components/adminSection/ActiveClaims";
import TotalClaimsProcessed from "@/components/adminSection/TotalClaimsProcessed";
import TotalClaimsChart from "./charts/TotalClaimsChart";

interface Props {
  onDetailChange: (show: boolean) => void;
}


const AnalyticsTopLineMetricsTab: React.FC<Props> = ({ onDetailChange }) => {
  const [dropdowns, setDropdowns] = useState<string[]>(Array(4).fill(""));
  const [hovered, setHovered] = useState<number | null>(null);
  const [steps, setSteps] = useState<string>("home");
  const [selectedCard, setSelectedCard] = useState<string>("Total no. of Claims");

  useEffect(() => {
    onDetailChange(steps === "home");
  }, [steps, onDetailChange]);

  const handleDropdownChange = (index: number, value: string) => {
    const newDropdowns = [...dropdowns];
    newDropdowns[index] = value;
    setDropdowns(newDropdowns);
  };

  const periodOptions = ["Daily", "Weekly", "Monthly"];
  const regionOptions = ["All Regions", "North", "South", "East", "West"];
  const companyOptions = ["All Companies", "Company A", "Company B", "Company C"];
  const vehicleOptions = ["2-Wheeler", "4-Wheeler"];

  const metrics = [
    { title: "Total no. of Claims", value: "1250" },
    { title: "Total Claims Processed", value: "1250" },
    { title: "Average Claim Settlement Time", value: "6 Days" },
    { title: "Claims Assigned", value: "1250" },
    { title: "Fraud Detections", value: "50" },
    { title: "Active Claims", value: "760" },
    { title: "Average Claim Amount", value: "₹3,450" }
  ];


  const ClickableMetricTab = [
    "Total no. of Claims",
    "Total Claims Processed",
    "Average Claim Settlement Time",
    "Claims Assigned",
    "Active Claims"
  ];

  return (
    <div>
      {/* Breadcrumb */}
      {steps !== "home" && (
        <nav className="p-2 flex items-center text-sm mb-4 font-geist">
          <span
            className="cursor-pointer text-[15px] text-[#999999] hover:underline"
            onClick={() => {
              setSteps("home");
              setSelectedCard("Total no. of Claims");
            }}
          >
            Top Line Metrics
          </span>
          <span className="mx-2 text-[#858585]">/</span>
          <span className="text-[#333333] text-[15px] font-medium">
            {selectedCard}
          </span>
        </nav>
      )}

      {/* Home View */}
      {steps === "home" && (
        <>
          {/* Header */}
          <div className="my-2 text-[#333333] mb-8">
            <h2 className="text-[24px] font-medium m-0 font-geist">
              Top Line Metrics
            </h2>
            <p className="text-[18px] text-[#858585] font-light font-geist">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex justify-between items-center gap-4 mb-8">
            {/* Search input */}
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img src="/assets/searchIcon.svg" alt="Search" className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search claims..."
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 bg-[#FFFFFF] focus:outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter dropdowns */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Period */}
              <div className="relative w-35 bg-[#FFFFFF] border border-[#EFEFEF] rounded-[6px]">
                <select
                  value={dropdowns[0]}
                  onChange={(e) => handleDropdownChange(0, e.target.value)}
                  className="block w-full 
                            bg-[#FFFFFF]  
                            border-none 
                            text-[#858585]  text-sm
                            rounded-[6px] 
                            px-3 py-3 
                            appearance-none 
                            focus:outline-none cursor-pointer"
                >
                  {/* <option value="">Select Period</option> */}
                  {periodOptions.map(opt => (
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

              {/* Region */}
              <div className="relative w-35 bg-[#FFFFFF] border border-[#EFEFEF] rounded-[6px]">
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

              {/* Company */}
              <div className="relative w-40 bg-[#FFFFFF] border border-[#EFEFEF] rounded-[6px]">
                <select
                  value={dropdowns[2]}
                  onChange={(e) => handleDropdownChange(2, e.target.value)}
                  className="block w-full 
                            bg-[#FFFFFF] 
                            border-none 
                            text-[#858585]  text-sm
                            rounded-[6px] 
                            px-3 py-3 
                            appearance-none 
                            focus:outline-none cursor-pointer"
                >
                  {/* <option value="">Select Company</option> */}
                  {companyOptions.map(opt => (
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

              {/* Vehicle */}
              <div className="relative w-40 bg-[#FFFFFF] border border-[#EFEFEF] rounded-[6px]">
                {/* <img src="/assets/cycleIcon.svg" alt="cycleIcon" /> */}
                <select
                  value={dropdowns[3]}
                  onChange={(e) => handleDropdownChange(3, e.target.value)}
                  className="block w-full 
                            bg-[#FFFFFF]  
                            border-none 
                            text-[#858585]  text-sm
                            rounded-[6px] 
                            px-3 py-3 
                            appearance-none 
                            focus:outline-none cursor-pointer"
                >
                  {/* <option value="">Select Vehicle</option> */}
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
            </div>
          </div>


          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

          {/* Total Claims Chart */}
          <TotalClaimsChart />
        </>
      )}

      {/* Detail Views */}
      {steps === "AverageClaimSettlementTime" && <AverageClaimSettlementTime />}
      {steps === "TotalNoOfClaims" && <TotalNoOfClaims />}
      {steps === "ClaimsAssigned" && <ClaimsAssigned />}
      {steps === "TotalClaimsProcessed" && <TotalClaimsProcessed />}
      {steps === "ActiveClaims" && <ActiveClaims />}
    </div>
  );
};

export default AnalyticsTopLineMetricsTab;
