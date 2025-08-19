import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Claim, initialClaimsData } from '@/app/jsondata/adminJsonData';
import ClaimsProcessedTable from './Tables/GenericClaimsTable';

const TotalNoOfClaims: React.FC = () => {
  const [claimsData] = useState<Claim[]>(initialClaimsData);

  return (
    <div className="p-2 font-geist">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[24px] font-medium m-0 font-geist">Total Number of Claims</h2>
      </div>

      <ClaimsProcessedTable rowData={claimsData} />
    </div>
  );
};

export default TotalNoOfClaims;