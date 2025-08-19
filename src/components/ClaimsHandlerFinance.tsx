import { useState, useMemo } from 'react';
import Image from 'next/image';
import FinanceTotalBill from './claimsHandler/FinanceTotalBill';

interface Part {
  id: number;
  name: string;
  material: string;
  action: string;
  vehicleAge: string;
  depreciation: string;
  price: number;
  coverage: 'Yes' | 'No';
  estNo: string;
  estAmount: number;
}

interface Product {
  id: number;
  name: string;
  amount: number;
}

type SortablePartKeys = keyof Omit<Part, 'id'>;

type TableTypes = 'parts' | 'garage' | 'estAmount' | 'estNo' | 'coverage' | 'name' | 'coverage' | 'material';

interface SortConfig {
  table: TableTypes;
  key: string;
  direction: 'asc' | 'desc';
}
interface GarageEstimateItem {
  id: number;
  action: string;
  part: string;
  labourRR: {
    estNo: string;
    estAmt: number;
    assessedAmt: number;
  };
  labourRepair: {
    estNo: string;
    estAmt: number;
    assessedAmt: number;
  };
}

export default function ClaimsHandlerFinance() {
  const [activeTab, setActiveTab] = useState<'estimate' | 'bill'>('estimate');
  const [zoom, setZoom] = useState(1);
  const initialExcesses = [1000, 1000, 1000];
  const [approvalModal, setAprrovalMOdal] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const [parts, setParts] = useState<Part[]>([
    {
      id: 1,
      name: 'Front Bumper',
      material: 'OEM',
      action: 'Replace',
      vehicleAge: '0-2 years',
      depreciation: '0%',
      price: 350,
      coverage: 'Yes',
      estNo: 'EST001',
      estAmount: 350
    },
    {
      id: 2,
      name: 'Headlight',
      material: 'Aftermarket',
      action: 'Repair',
      vehicleAge: '3-5 years',
      depreciation: '10%',
      price: 200,
      coverage: 'Yes',
      estNo: 'EST002',
      estAmount: 180
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'PARTS @LIST', amount: 8500.00 },
    { id: 2, name: 'LESS : DEPRN.', amount: -4250.00 },
    { id: 3, name: 'NET PARTS AMOUNT', amount: 4250.00 },
    { id: 4, name: 'CGST', amount: 0.00 },
    { id: 5, name: 'SGST', amount: 0.00 }
  ]);

  const [newPart, setNewPart] = useState<Omit<Part, 'id' | 'estAmount'>>({
    name: '',
    material: 'OEM',
    action: 'Replace',
    vehicleAge: '0-2 years',
    depreciation: '0%',
    price: 0,
    coverage: 'Yes',
    estNo: ''
  });

  const [excesses, setExcesses] = useState<number[]>(initialExcesses);
  const [selectedAddon, setSelectedAddon] = useState('NO ADD ON');
  const [settlementPct, setSettlementPct] = useState(100);
  const [nonStandardDeduction, setNonStandardDeduction] = useState(0);
  const [damageDetails, setDamageDetails] = useState('');
  // Sample data matching the image
  const [estimates, setEstimates] = useState<GarageEstimateItem[]>([
  {
    "id": 1,
    "action": "Repair",
    "part": "Fender",
    "labourRR": {
      "estNo": "EST001",
      "estAmt": 4500,
      "assessedAmt": 4500
    },
    "labourRepair": {
      "estNo": "EST001",
      "estAmt": 4500,
      "assessedAmt": 4500
    }
  },
  {
    "id": 2,
    "action": "Replace",
    "part": "Bumper",
    "labourRR": {
      "estNo": "EST002",
      "estAmt": 3200,
      "assessedAmt": 3200
    },
    "labourRepair": {
      "estNo": "EST002",
      "estAmt": 3200,
      "assessedAmt": 3200
    }
  }
]);
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    return acc[part];
  }, obj);
};

const sortedEstimates = useMemo(() => {
  const sortableItems = [...estimates];
  if (sortConfig?.table === 'garage') {
    sortableItems.sort((a, b) => {
      const aVal = getNestedValue(a, sortConfig.key);
      const bVal = getNestedValue(b, sortConfig.key);

      if (aVal === undefined || bVal === undefined) return 0;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }
  return sortableItems;
}, [estimates, sortConfig]);

const requestSort = (table: TableTypes, key: string) => {
  let direction: 'asc' | 'desc' = 'asc';
  if (sortConfig?.table === table && sortConfig?.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }
  setSortConfig({ table, key, direction });
};

  const totalLabourRR = useMemo(
    () => estimates.reduce((sum, item) => sum + item.labourRR.estAmt, 0),
    [estimates]
  );

  const totalLabourRepair = useMemo(
    () => estimates.reduce((sum, item) => sum + item.labourRepair.estAmt, 0),
    [estimates]
  );

  // Sorting logic
const sortedParts = useMemo(() => {
  const sortable = [...parts];
  if (sortConfig?.table === 'parts') {
    sortable.sort((a, b) => {
      const aVal = a[sortConfig.key as keyof Part];
      const bVal = b[sortConfig.key as keyof Part];
      
      if (aVal === undefined || bVal === undefined) return 0;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc'
          ? aVal - bVal
          : bVal - aVal;
      }
      return 0;
    });
  }
  return sortable;
}, [parts, sortConfig]);

  const sortTable = (tableKey: TableTypes, key: string) => {
    if (sortConfig?.table === tableKey && sortConfig?.key === key) {
      setSortConfig({
        ...sortConfig,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortConfig({ table: tableKey, key, direction: 'asc' });
    }
  };

 const getArrow = (key: string, table: TableTypes) => {
  const isActive = sortConfig?.table === table && sortConfig?.key === key;
  const direction = sortConfig?.direction;

  return (
    <div className="flex flex-col items-center ml-1">
      <svg
        className={`w-5 h-3 ${isActive && direction === 'asc' ? 'text-black' : 'text-[#C0C0C0]'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
      <svg
        className={`w-5 h-3 ${isActive && direction === 'desc' ? 'text-black' : 'text-[#C0C0C0]'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
};

  const handlePartChange = (id: number, field: keyof Part, value: string) => {
    setParts((prev) =>
      prev.map((part) =>
        part.id === id ? { 
          ...part, 
          [field]: value,
          ...(field === 'price' || field === 'depreciation' ? {
            estAmount: field === 'price' 
              ? parseFloat(value) * (1 - parseFloat(part.depreciation.replace('%', '')) / 100)
              : part.price * (1 - parseFloat(value.replace('%', '')) / 100)
          } : {})
        } : part
      )
    );
  };

  const handleAddPart = () => {
    if (!newPart.name.trim()) return;
    
    const estAmount = newPart.price * (1 - parseFloat(newPart.depreciation.replace('%', '')) / 100);
    setParts([...parts, {
      ...newPart,
      id: parts.length + 1,
      estAmount
    }]);
    setNewPart({
      name: '',
      material: 'OEM',
      action: 'Replace',
      vehicleAge: '0-2 years',
      depreciation: '0%',
      price: 0,
      coverage: 'Yes',
      estNo: ''
    });
  };

  const handleFullscreen = () => {
    const img = document.getElementById("estimateImage");
    if (img?.requestFullscreen) {
      img.requestFullscreen();
    }
  };

  const totalPartsAmount = useMemo(() => 
    sortedParts.reduce((sum, part) => sum + part.estAmount, 0), 
    [sortedParts]
  );

  const totalProductsAmount = useMemo(() => 
    products.reduce((sum, product) => sum + product.amount, 0), 
    [products]
  );

  const handleExcessChange = (idx: number, value: number) => {
    const newArr = [...excesses];
    newArr[idx] = value;
    setExcesses(newArr);
  };

  // compute totals
  const insurerLiabilities = [4250, 1298, 0, 0];
  const insuredShares = [0, 0, 0, 0];

  const totalLiability = insurerLiabilities.reduce((a, b) => a + b, 0);
  const totalDeduct = excesses.reduce((a, b) => a + b, 0);
  const netSettlement = totalLiability - totalDeduct;
  const totalSettlementAmount = ((settlementPct / 100) * netSettlement) - nonStandardDeduction;

  return (
    <div className="">
      <div className='flex' style={{justifyContent: "space-between"}}>
        <div className="flex flex-row gap-6 py-2 mb-4 border border-[#F0F0F1] w-full sm:w-76 justify-center">
          <button
            className={`px-3 py-2 rounded-md transition font-medium ${
              activeTab === 'estimate'
                ? 'bg-[#21FF91] text-[#000000]'
                : 'text-[#787C82] hover:text-[#000000] hover:bg-[#21FF91] cursor-pointer'
            }`}
            onClick={() => setActiveTab('estimate')}
          >
            Estimate Cost
          </button>
          <button
            className={`px-3 py-2 rounded-md transition font-medium ${
              activeTab === 'bill'
                ? 'bg-[#21FF91] text-[#000000]'
                : 'text-[#787C82] hover:text-[#000000] hover:bg-[#21FF91] cursor-pointer'
            }`}
            onClick={() => setActiveTab('bill')}
          >
            Total Bill
          </button>
        </div>
        <div>
          <button
            className="cursor-pointer border border-black px-2 py-2 rounded radius-[6px] text-[14px]"
          >
            View Uploaded Bill
          </button>
        </div>
      </div>

      {activeTab === 'estimate' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-[#EFEFEF] bg-[#EFEFEF] p-4">
              <div className="relative h-84 overflow-hidden my-6">
                <Image
                  id="estimateImage"
                  src="/assets/docImg2.svg"
                  alt="Vehicle Damage"
                  width={800}
                  height={800}
                  className="object-contain"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                />
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                  className="px-3 py-1 bg-white border border-gray-300 rounded cursor-pointer"
                >
                  <Image src="/assets/zoomOutIcon.svg" alt="Zoom Out" width={24} height={24} />
                </button>
                <button
                  onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                  className="px-3 py-1 bg-white border border-gray-300 rounded cursor-pointer"
                >
                  <Image src="/assets/zoominIcon.svg" alt="Zoom In" width={24} height={24} />
                </button>
                <button
                  onClick={handleFullscreen}
                  className="px-3 py-1 bg-white border border-gray-300 rounded cursor-pointer"
                >
                  <Image src="/assets/fullScreenZoomIcon.svg" alt="Fullscreen" width={24} height={24} />
                </button>
              </div>
            </div>

            <div className="">
              <h3 className="text-[#000000] text-md font-semibold mb-4">Additional</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-[#333] mb-4">Part Name</p>
                  <p className="text-md font-medium text-black capitalize mb-4">Exceeding 10 years</p>
                </div>
                <div>
                  <p className="text-sm text-[#333] mb-4">Action</p>
                  <p className="text-md font-medium text-black capitalize">Repair</p>
                </div>
                <div>
                  <p className="text-sm text-[#333] mb-4">Material</p>
                  <p className="text-md font-medium text-black capitalize">Repair</p>
                </div>
              </div>

              <h3 className="text-md text-[#000000] font-medium font-semibold mb-4">Depreciation</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-[#333333] mb-4">Select Age of Vehicle</label>
                  <p className="text-md font-medium text-black capitalize">Exceeding 10 years</p>
                </div>
                <div>
                  <label className="block text-sm text-[#333333] mb-4">Depreciation %</label>
                  <p className="text-md font-medium text-black capitalize">50%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Parts Summary Table */}
          <div className="overflow-hidden mb-8">
            <h3 className="text-[14px] font-semibold text-[#000000] mb-4">Parts Summary</h3>
            <table className="w-full text-sm border border-[#EFEFEF] rounded-md">
              <thead className="bg-[#FBFBFB] text-[#858585] text-[13px]">
                <tr>
                  <th onClick={() => requestSort('parts', 'action')} className="p-3 text-left cursor-pointer select-none">
                    <div className="flex items-center gap-2">Action Required {getArrow('action', 'parts')}</div>
                    </th>
                  <th onClick={() => sortTable('parts', 'material')} className="p-3 cursor-pointer">
                    <div className="flex items-center gap-2">Material {getArrow('parts', 'material')}</div>
                  </th>
                  <th onClick={() => sortTable('parts', 'name')} className="p-3 cursor-pointer">
                    <div className="flex items-center gap-2">Vehicle Part {getArrow('parts', 'name')}</div>
                  </th>
                  <th onClick={() => sortTable('parts', 'coverage')} className="p-3 cursor-pointer">
                    <div className="flex items-center gap-2">Coverage {getArrow('parts', 'coverage')}</div>
                  </th>
                  <th onClick={() => sortTable('parts', 'estNo')} className="p-3 cursor-pointer">
                    <div className="flex items-center gap-2">Est No. {getArrow('parts', 'estNo')}</div>
                  </th>
                  <th onClick={() => sortTable('parts', 'estAmount')} className="p-3 cursor-pointer">
                    <div className="flex items-center gap-2">Est Amt {getArrow('parts', 'estAmount')}</div>
                  </th>
                  <th className="p-3">Bill No</th>
                  <th className="p-3">Bill Amt</th>
                </tr>
              </thead>
              <tbody>
                {sortedParts.map((part, index) => (
                  <tr key={index} className="text-[#5C5C5C] text-[14px] hover:bg-gray-50">
                    <td className="p-3">Repair</td>
                    <td className="p-3">{part.material}</td>
                    <td className="p-3">{part.name}</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">{part.estNo}</td>
                    <td className="p-3">₹{part.estAmount.toFixed(2)}</td>
                    <td className="p-3">₹{part.estAmount.toFixed(2)}</td>
                    <td className="p-3">₹{part.estAmount.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-[#EFEFEFE5] font-semibold text-[#333333]">
                  <td className="p-3">Total</td>
                  <td colSpan={4}></td>
                  <td className="p-3">₹{totalPartsAmount.toFixed(2)}</td>
                  <td className="p-3">₹{totalPartsAmount.toFixed(2)}</td>
                  <td className="p-3">₹{totalPartsAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Garage Estimate Table */}
        <div className="overflow-hidden mb-8">
      <h3 className="text-[14px] font-semibold text-[#000000] mb-4">
        Garage Estimate
      </h3>
      <table className="w-full text-sm border border-[#EFEFEF] rounded-md">
  <thead className="bg-[#FBFBFB] text-[#858585] text-[13px]">
    <tr>
      <th
        rowSpan={2}
        className="p-3 text-left cursor-pointer"
        onClick={() => requestSort('garage', 'action')}
      >
        <div className="flex items-center gap-1">
          Action Required {getArrow('action', 'garage')}
        </div>
      </th>

      <th
        rowSpan={2}
        className="p-3 text-left cursor-pointer"
        onClick={() => requestSort('garage', 'part')}
      >
        <div className="flex items-center gap-1">
          Vehicle Part {getArrow('part', 'garage')}
        </div>
      </th>

      <th colSpan={3} className="p-3 text-center">
        Labour R/R
      </th>
      <th colSpan={3} className="p-3 text-center">
        Labour Repair
      </th>
    </tr>
    <tr>
      {/* Labour R/R sub-headers */}
      <th
        className="p-3 cursor-pointer"
        onClick={() => requestSort('garage', 'labourRR.estNo')}
      >
        <div className="flex items-center gap-1">
          Est No. {getArrow('labourRR.estNo', 'garage')}
        </div>
      </th>
      <th
        className="p-3 cursor-pointer"
        onClick={() => requestSort('garage', 'labourRR.estAmt')}
      >
        <div className="flex items-center gap-1">
          Est Amt {getArrow('labourRR.estAmt', 'garage')}
        </div>
      </th>
      <th
        className="p-3 cursor-pointer"
        onClick={() => requestSort('garage', 'labourRR.assessedAmt')}
      >
        <div className="flex items-center gap-1">
          Assessed Amt {getArrow('labourRR.assessedAmt', 'garage')}
        </div>
      </th>

      {/* Labour Repair sub-headers */}
      <th
        className="p-3 cursor-pointer"
        onClick={() => requestSort('garage', 'labourRepair.estNo')}
      >
        <div className="flex items-center gap-1">
          Est No. {getArrow('labourRepair.estNo', 'garage')}
        </div>
      </th>
      <th
        className="p-3 cursor-pointer"
        onClick={() => requestSort('garage', 'labourRepair.estAmt')}
      >
        <div className="flex items-center gap-1">
          Est Amt {getArrow('labourRepair.estAmt', 'garage')}
        </div>
      </th>
      <th
        className="p-3 cursor-pointer"
        onClick={() => requestSort('garage', 'labourRepair.assessedAmt')}
      >
        <div className="flex items-center gap-1">
          Assessed Amt {getArrow('labourRepair.assessedAmt', 'garage')}
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    {sortedEstimates.map((estimate, index) => (
      <tr
        key={estimate.id}
        className="text-[#5C5C5C] text-[14px] hover:bg-gray-50"
      >
        <td className="p-3">{estimate.action}</td>
        <td className="p-3">{estimate.part}</td>

        {/* Labour R/R columns */}
        <td className="p-3">{estimate.labourRR.estNo}</td>
        <td className="p-3">₹{estimate.labourRR.estAmt.toFixed(2)}</td>
        <td className="p-3">₹{estimate.labourRR.assessedAmt.toFixed(2)}</td>

        {/* Labour Repair columns */}
        <td className="p-3">{estimate.labourRepair.estNo}</td>
        <td className="p-3">₹{estimate.labourRepair.estAmt.toFixed(2)}</td>
        <td className="p-3">₹{estimate.labourRepair.assessedAmt.toFixed(2)}</td>
      </tr>
    ))}
    <tr className="bg-[#EFEFEFE5] font-semibold text-[#333333]">
      <td className="p-3">Total Cost</td>
      <td className="p-3"></td>

      {/* Labour R/R totals */}
      <td className="p-3"></td>
      <td className="p-3">₹{totalLabourRR.toFixed(2)}</td>
      <td className="p-3">₹{totalLabourRR.toFixed(2)}</td>

      {/* Labour Repair totals */}
      <td className="p-3"></td>
      <td className="p-3">₹{totalLabourRepair.toFixed(2)}</td>
      <td className="p-3">₹{totalLabourRepair.toFixed(2)}</td>
    </tr>
  </tbody>
</table>

    </div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Products & Services - 1/3 Width */}
            <div className="w-full md:w-1/3 rounded-lg">
              <h3 className="text-[14px] font-semibold text-[#000000] mb-4">Parts Calculation</h3>
              <table className="w-full border border-[#EFEFEF] text-left text-[#000000] text-[14px]">
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-2 py-2">{product.name}</td>
                      <td className="px-2 py-2 text-right">₹{product.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#F6F6F6] text-[14px]">
                  <tr>
                    <td className="px-2 py-2">TOTAL PARTS AMOUNT</td>
                    <td className="px-2 py-2 text-right">₹{totalProductsAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Additional Charges - 2/3 Width */}
            <div className="w-full md:w-2/3">
              <h3 className="text-[14px] font-semibold text-[#000000] mb-4">Labour Calculation</h3>
              <table className="w-full border border-[#EFEFEF]">
                <thead>
                  <tr className="bg-gray-50 text-left text-[14px] font-medium text-[#000000]">
                    <th className="px-4 py-2">Labour Calculation</th>
                    <th className="px-4 py-2">Remove & Refit</th>
                    <th className="px-4 py-2">Repair</th>
                    <th className="px-4 py-2">Paint</th>
                    <th className="px-4 py-2">Total Labour</th>
                  </tr>
                </thead>
                <tbody className="text-[#000000] text-[14px]">
                  <tr>
                    <td className="px-4 py-2">Amount</td>
                    <td className="px-4 py-2">1100.00</td>
                    <td className="px-4 py-2">00</td>
                    <td className="px-4 py-2">150.00</td>
                    <td className="px-4 py-2">150.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 flex justify-between items-center">
                      CGST
                      <p>4%</p>
                    </td>
                    <td className="px-4 py-2">3</td>
                    <td className="px-4 py-2">25.00</td>
                    <td className="px-4 py-2">75.00</td>
                    <td className="px-4 py-2">75.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 flex justify-between items-center">
                      SGST
                      <p>8%</p>
                    </td>
                    <td className="px-4 py-2">3</td>
                    <td className="px-4 py-2">25.00</td>
                    <td className="px-4 py-2">75.00</td>
                    <td className="px-4 py-2">75.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 flex justify-between items-center">
                      Paint Depreciation (PM)
                      <p>9%</p>
                    </td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">-</td>
                  </tr>
                </tbody>
                <tfoot className="bg-[#F6F6F6] text-[14px]">
                  <tr>
                    <td className="px-4 py-2 text-left capitalize">TOTAL</td>
                    <td className="px-4 py-2">2343.00</td>
                    <td className="px-4 py-2">0.00</td>
                    <td className="px-4 py-2">0.00</td>
                    <td className="px-4 py-2">225.00</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="container mx-auto py-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Liability Card */}
              <div className="col-span-12 md:col-span-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Liability</h3>
                <table className="w-full text-sm text-gray-800 border border-[#EFEFEF] rounded-[6px] p-6">
                  <thead>
                    <tr className="">
                      <th className="p-2 text-left">Particulars</th>
                      <th className="p-2 text-right">Insurer&apos;s Liability</th>
                      <th className="p-2 text-right">Insured&apos;s Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insurerLiabilities.map((val, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="p-2">
                          {idx === 0 && 'Parts assessed (C)'}
                          {idx === 1 && 'Labour (Repair & R&R)'}
                          {idx === 2 && 'Paint'}
                          {idx === 3 && 'Towing charges'}
                        </td>
                        <td className="p-2 text-right">{val.toFixed(2)}</td>
                        <td className="p-2 text-right">{insuredShares[idx].toFixed(2)}</td>
                      </tr>
                    ))}

                    {/* Compulsory excess rows */}
                    {excesses.map((ex, i) => (
                      <tr key={`excess-${i}`} className="border-b border-gray-100 bg-gray-50">
                        <td className="p-2">Less: Compulsory excess</td>
                        <td className="p-2 text-right">
                          1000
                        </td>
                        <td className="p-2 text-right">0</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className='bg-[#F6F6F6]'>
                    <tr>
                      <td className="pt-2 p-2 font-medium">Net Settlement:</td>
                      <td />
                      <td className="pt-2 p-2 text-right font-medium">{netSettlement.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Final Settlement Card */}
              <div className="col-span-12 md:col-span-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Final settlement</h3>
                <div className=' border border-[#EFEFEF] rounded-[6px] p-6'>  
                  <div className="grid grid-cols-2 gap-4 mb-4 items-center border-b border-[#E5E5E5] pb-4">
                    <label className="text-sm text-gray-700">Settlement Percentage %</label>
                    <div className="flex justify-end space-x-2 ">
                      <span className='border border-[#E5E5E5] px-6'>100 %</span>
                    </div>

                    <label className="text-sm text-gray-700">Amt. Non Standard Deduction</label>
                    <div className="flex justify-end space-x-2">
                    <span className='border border-[#E5E5E5] px-6'>0.00</span>
                    </div>
                  </div> 
                  <div className="mb-6 flex justify-between font-medium text-[#000000]">
                    <span>Total Settlement Amount</span>
                    <span>{totalSettlementAmount.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-700 mb-4">
                    <span className='mb-4 text-sm'>Details of Damage</span><br/>
                    <textarea
                      className="w-full mb-2 text-sm border border-[#E5E5E5] rounded-md p-2 h-20 resize-none"
                      placeholder="Broken Side Mirror and front bumper"
                    />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bill' && (
        <FinanceTotalBill />
      )}
      {approvalModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-2xl h-[700px] overflow-x-auto">
            <h1 className='text-[20px] font-bold text-[#484848]'>
                Send Approval for Repaired Documents
            </h1>
            <p className='text-[14px] font-medium my-2'>The workshop will receive a secure link to upload the requested documents.</p>
            <h1 className='text-[14px] font-medium text-[#000000]'>
                Send Approval for Repaired Documents
            </h1>
            <table className="w-full border border-[#EFEFEF] text-left text-[#000000] text-[14px] p-10 my-4">
              <tbody className='mb-4'>
                <tr>
                  <td className="px-4 py-2">Claim Reference</td>
                  <td className="px-4 py-2 text-right">₹40305.26</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Workshop</td>
                  <td className="px-4 py-2 text-right">Secure Insurance Co.</td>
                </tr>
                <tr className='border-b border-gray-200 mb-4'>
                  <td className="px-4 py-2">Approved Amount</td>
                  <td className="px-4 py-2 text-right">₹13,640</td>
                </tr>
              </tbody>
              <div className='border-b border-gray-200 mb-4'></div>
              <tfoot className="bg-[#F9F9F9] font-semibold text-[14px] py-5">
                <tr>
                  <td className="px-4 py-2">Final Approved Amount:</td>
                  <td className="px-4 py-2 text-right">₹600.00</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}