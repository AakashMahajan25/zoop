'use client'
import React, { useState } from "react";
import TopLineMetricsTab from "@/components/adminSection/AnalyticsTopLineMetricsTab";
import StageWiseMetricsTab from "@/components/adminSection/AnalyticsStageWiseMetricsTab";
import OperationalMetricsTab from "@/components/adminSection/AnalyticsOperationalMetricsTab";

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  // new: control visibility of the top‐level tab bar
  const [showTabs, setShowTabs] = useState<boolean>(true);

  return (
    <div className="p-4 px-7 py-4 space-y-4 text-[#333333] font-geist bg-[#FBFBFB]">
      {/* only render these when showTabs is true */}
      {showTabs && (
        <div className="flex space-x-8 py-4">
          {["Top Line Metrics", "Stage-Wise Metrics", "Operational Metrics"].map((tab, i) => (
            <div
              key={i}
              onClick={() => {
                setActiveTab(i);
              }}
              className={`pb-2 cursor-pointer text-[16px] py-2 px-6 ${
                activeTab === i
                  ? "border-b-2 border-[#21FF91] text-[#3A6048] font-medium"
                  : "text-[#858585]"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
      )}

      {/* pass the setter into the TopLine tab so it can hide/show */}
      {activeTab === 0 && (
        <TopLineMetricsTab onDetailChange={setShowTabs} />
      )}
      {activeTab === 1 && <StageWiseMetricsTab />}
      {activeTab === 2 && <OperationalMetricsTab />}
    </div>
  );
};

export default Analytics;
