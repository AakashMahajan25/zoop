'use client';
import React from 'react';

const FinanceTotalBill = () => {
  const entries = [
    {
      id: 1,
      particulars: 'Front Bumper',
      qty: 1,
      action: 'Repaired',
      coverage: 'Yes',
      estimate: {
        partPrice: 11000,
        labourRR: 1200,
        labourRepair: 0,
        paint: 1500,
        depValue: 12330,
      },
      bill: {
        partPrice: 11200,
        labourRR: 1200,
        labourRepair: 0,
        paint: 1500,
        depValue: 12510,
      },
    },
    {
      id: 2,
      particulars: 'Front Bumper',
      qty: 1,
      action: 'Repaired',
      coverage: 'Yes',
      estimate: {
        partPrice: 11000,
        labourRR: 1200,
        labourRepair: 0,
        paint: 1500,
        depValue: 12330,
      },
      bill: {
        partPrice: 11200,
        labourRR: 1200,
        labourRepair: 0,
        paint: 1500,
        depValue: 12510,
      },
    },
    {
      id: 3,
      particulars: 'Front Bumper',
      qty: 1,
      action: 'Repaired',
      coverage: 'Yes',
      estimate: {
        partPrice: 11000,
        labourRR: 1200,
        labourRepair: 0,
        paint: 1500,
        depValue: 12330,
      },
      bill: {
        partPrice: 11200,
        labourRR: 1200,
        labourRepair: 0,
        paint: 1500,
        depValue: 12510,
      },
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {entries.map((entry) => (
        <div key={entry.id} className="flex flex-col gap-4 md:flex-row md:justify-between">
          <div className="w-full md:w-1/3">
            <div className="font-medium text-[#000000] mb-2">{entry.id}</div>
            <div className="text-sm space-y-1 border border-[#EFEFEF] rounded p-4 pb-20">
              <div className="mb-2">Particulars<span className="float-right">{entry.particulars}</span></div>
              <div className="mb-2">Qty<span className="float-right">{entry.qty}</span></div>
              <div className="mb-2">Action<span className="float-right">{entry.action}</span></div>
              <div>Coverage<span className="float-right">{entry.coverage}</span></div>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <div className="font-medium font-semibold mb-2 text-[#000000]">Workshop Estimate</div>
            <div className="text-sm space-y-1 border border-[#EFEFEF] rounded p-4 ">
              <div className="flex justify-between"><span>Part Price</span><span>{entry.estimate.partPrice.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Labour (R/R)</span><span>{entry.estimate.labourRR.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Labour Repair</span><span>{entry.estimate.labourRepair.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Paint</span><span>{entry.estimate.paint.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Dep. Value</span><span className='flex flex-col'>{entry.estimate.depValue.toLocaleString()} <span className="text-xs text-gray-500">(10%)</span></span></div>
              <hr className="my-2 text-[#E5E5E5]" />
              <div className="flex justify-between"><span>Total Cost:</span><span>Rs.{(entry.estimate.partPrice + entry.estimate.labourRR + entry.estimate.paint).toLocaleString()}</span></div>
            </div>
          </div>

          {/* Right Card: Total Bill */}
          <div className=" w-full md:w-1/3">
            <div className="font-medium font-semibold mb-2 text-[#000000]">Total bill</div>
            <div className="text-sm space-y-1 border border-[#EFEFEF] rounded p-4">
              <div className="flex justify-between"><span>Part Price</span><span>{entry.bill.partPrice.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Labour (R/R)</span><span>{entry.bill.labourRR.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Labour Repair</span><span>{entry.bill.labourRepair.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Paint</span><span>{entry.bill.paint.toLocaleString()}</span></div>
              <div className="flex justify-between"><span >Dep. Value</span><span className='flex flex-col'>{entry.bill.depValue.toLocaleString()} <span className="text-xs text-gray-500">(10%)</span></span></div>
              <hr className="my-2 text-[#E5E5E5]" />
              <div className="flex justify-between"><span>Total Cost:</span><span>Rs.{(entry.bill.partPrice + entry.bill.labourRR + entry.bill.paint).toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      ))}
     <div>
  <div className="font-medium font-semibold mb-2 text-[#000000]">Total bill</div>
  <div className="text-sm space-y-3 border border-[#EFEFEF] rounded p-4">
    <div className="flex justify-between">
      <span>Total Workshop Estimate:</span>
      <span>Rs. 11,000</span>
    </div>
    <div className="flex justify-between">
      <span>Total Billed Amount:</span>
      <span>Rs. 1,200</span>
    </div>
    <div className="flex justify-between">
      <span>Total Approved Amount:</span>
      <span>Rs. 0</span>
    </div>
    <div className="flex justify-between">
      <span>GST (18%):</span>
      <span>Rs. 2,500</span>
    </div>
    <hr className="my-2 text-[#E5E5E5]" />
    <div className="flex justify-between">
      <span className='font-semibold'>Final Approved Amount:</span>
      <span>Rs. 14,700</span>
    </div>
  </div>
</div>

          
    </div>
  );
};

export default FinanceTotalBill;
