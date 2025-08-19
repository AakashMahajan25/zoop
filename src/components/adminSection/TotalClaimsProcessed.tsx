import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Claim, initialClaimsData } from '@/app/jsondata/adminJsonData';
import ClaimsProcessedTable from './Tables/GenericClaimsTable';

const TotalClaimsProcessed: React.FC = () => {
  const [claimsData] = useState<Claim[]>(initialClaimsData.filter((data) => data.claimStatus === 'Assessment Pending'));

  return (
    <div className="p-2 font-geist">
      <div className="py-1 space-y-4 text-[#333333] font-geist bg-[#FBFBFB] mb-6">
        <h2 className="text-[24px] font-medium m-0 font-geist">Total Claims Processed</h2>
      </div>
      <ClaimsProcessedTable rowData={claimsData} />
    </div>
  );
};

export default TotalClaimsProcessed;
