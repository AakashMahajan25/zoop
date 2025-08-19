// components/claimsHandler/ClaimsHandlerFinalReport.tsx
import React from 'react';

const ClaimsHandlerFinalReport: React.FC = () => {
  return (
    <div className="p-4">
      <h3 className="text-[20px] font-bold text-[#484848] mb-4">Final Report</h3>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Claim Summary</h4>
          <p className="text-gray-700">Final claim assessment and approval details will appear here.</p>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Approval Status</h4>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span>Pending Review</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Settlement Amount</h4>
          <p className="text-xl font-bold">$0.00</p>
        </div>
        
        <button className="bg-black text-white px-4 py-2 rounded-md mt-4">
          Generate Final Report
        </button>
      </div>
    </div>
  );
};

export default ClaimsHandlerFinalReport;