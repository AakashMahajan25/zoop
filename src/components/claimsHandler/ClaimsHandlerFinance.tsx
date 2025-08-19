import { useState, useMemo } from 'react';
import Image from 'next/image';
import FinanceTotalBill from './FinanceTotalBill';

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

export default function ClaimsHandlerFinance() {
  const [activeTab, setActiveTab] = useState<'estimate' | 'bill'>('estimate');
  const [zoom, setZoom] = useState(1);
  const initialExcesses = [1000, 1000, 1000];
  const [approvalModal,setAprrovalMOdal] = useState <boolean>(false);

  const [sortConfig, setSortConfig] = useState<{ 
    key: SortablePartKeys; 
    direction: 'asc' | 'desc' 
  } | null>(null);

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
    { id: 1, name: 'Labor Charges', amount: 500 },
    { id: 2, name: 'Paint', amount: 300 },
    { id: 3, name: 'Miscellaneous', amount: 150 },
    { id: 4, name: 'Miscellaneous', amount: 150 },
    { id: 5, name: 'Miscellaneous', amount: 150 }
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

  // Sorting logic
  const sortedParts = useMemo(() => {
    const sortable = [...parts];
    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
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

  const handleSort = (key: SortablePartKeys) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
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

   const [excesses, setExcesses] = useState<number[]>(initialExcesses);
  const [selectedAddon, setSelectedAddon] = useState('NO ADD ON');
  const [settlementPct, setSettlementPct] = useState(100);
  const [nonStandardDeduction, setNonStandardDeduction] = useState(0);
  const [damageDetails, setDamageDetails] = useState('');

  // compute totals
  const insurerLiabilities = [4250, 1298, 0, 0];
  const insuredShares = [0, 0, 0, 0];

  const totalLiability = insurerLiabilities.reduce((a, b) => a + b, 0);
  const totalDeduct = excesses.reduce((a, b) => a + b, 0);
  const netSettlement = totalLiability - totalDeduct;
  const totalSettlementAmount = ((settlementPct / 100) * netSettlement) - nonStandardDeduction;

  const handleExcessChange = (idx: number, value: number) => {
    const newArr = [...excesses];
    newArr[idx] = value;
    setExcesses(newArr);
  };

  return (
    <div className="">
      <div className="flex flex-row gap-10 py-2 mb-4 border border-[#F0F0F1] w-full sm:w-76 justify-center">
        <button
          className={`px-3 py-1 rounded-md ${activeTab === 'estimate' ? 'bg-[#21FF91] text-[#000000]' : 'bg-gray-200 text-[#787C82] hover:bg-gray-300'}`}
          onClick={() => setActiveTab('estimate')}
        >
          Estimate Cost
        </button>
        <button
          className={`px-3 py-1 rounded-md ${activeTab === 'bill' ? 'bg-[#21FF91] text-[#000000]' : 'bg-gray-200 text-[#787C82] hover:bg-gray-300'}`}
          onClick={() => setActiveTab('bill')}
        >
          Total Bill
        </button>
      </div>

      {activeTab === 'estimate' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-[#EFEFEF] bg-[#EFEFEF] p-4">
              <div className="relative h-84 overflow-hidden">
                <Image
                  id="estimateImage"
                  src="/assets/docImg.svg"
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
                  className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-300"
                >
                  <Image src="/assets/zoomOutIcon.svg" alt="Zoom Out" width={24} height={24} />
                </button>
                <button
                  onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                  className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-300"
                >
                  <Image src="/assets/zoominIcon.svg" alt="Zoom In" width={24} height={24} />
                </button>
                <button
                  onClick={handleFullscreen}
                  className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-300"
                >
                  <Image src="/assets/fullScreenZoomIcon.svg" alt="Fullscreen" width={24} height={24} />
                </button>
              </div>
            </div>

            <div className="">
              <h3 className="text-[#000000] text-[14px] font-medium mb-2">Additional</h3>
              <div className="mb-2">
                <label className="block text-[12px] text-[#333333] mb-1">Part Name</label>
                <input
                  type="text"
                  value={newPart.name}
                  onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                  className="w-84 p-2 border border-[#E5E5E5] rounded text-[#333333] text-[14px] outline-none"
                  placeholder="Enter part name"
                />
              </div>
              <div className="flex items-end gap-4 mb-4">
                <div className="w-1/3">
                  <label className="block text-[12px] text-[#333333] mb-1">Action</label>
                  <select
                    value={newPart.action}
                    onChange={(e) => setNewPart({ ...newPart, action: e.target.value })}
                    className="w-full p-2 border border-[#E5E5E5] rounded text-[#333333] text-[14px] outline-none"
                  >
                    <option value="Replace">Replace</option>
                    <option value="Repair">Repair</option>
                    <option value="Refurbish">Refurbish</option>
                  </select>
                </div>
                <div className="w-1/3">
                  <label className="block text-[12px] text-[#333333] mb-1">Material</label>
                  <select
                    value={newPart.material}
                    onChange={(e) => setNewPart({ ...newPart, material: e.target.value })}
                    className="w-full p-2 border border-[#E5E5E5] rounded text-[#333333] text-[14px] outline-none"
                  >
                    <option value="OEM">OEM</option>
                    <option value="Aftermarket">Aftermarket</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
                <button
                  onClick={handleAddPart}
                  className="py-2 px-4 text-[#000000] border border-[#000000] rounded"
                >
                  Add
                </button>
              </div>

              <h3 className="text-[14px] text-[#000000] font-medium mb-4">Depreciation Calculation</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[12px] text-[#333333] mb-1">Select Age of Vehicle</label>
                  <select
                    value={newPart.vehicleAge}
                    onChange={(e) => setNewPart({ ...newPart, vehicleAge: e.target.value })}
                    className="w-full p-2 border border-[#E5E5E5] rounded text-[#333333] text-[14px] outline-none"
                  >
                    <option value="0-2 years">0-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="6-8 years">6-8 years</option>
                    <option value="9+ years">9+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-[#333333] mb-1">Depreciation %</label>
                  <select
                    value={newPart.depreciation}
                    onChange={(e) => setNewPart({ ...newPart, depreciation: e.target.value })}
                    className="w-40 p-2 border border-[#E5E5E5] rounded text-[#333333] text-[14px] outline-none"
                  >
                    <option value="0%">0%</option>
                    <option value="10%">10%</option>
                    <option value="20%">20%</option>
                    <option value="30%">30%</option>
                    <option value="40%">40%</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-[14px] font-semibold text-[#000000] mb-4">Parts Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-[#EFEFEF]">
                <thead className="bg-[#FBFBFB] border-b border-[#EFEFEF] text-sm text-gray-600">
                  <tr>          
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('action')}
                    >
                      Action Required {sortConfig?.key === 'action' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('material')}
                    >
                      Material {sortConfig?.key === 'material' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('name')}
                    >
                      Vehicle Part {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('coverage')}
                    >
                      Coverage {sortConfig?.key === 'coverage' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('estNo')}
                    >
                      Est No. {sortConfig?.key === 'estNo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('estAmount')}
                    >
                      Est Amt {sortConfig?.key === 'estAmount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('estAmount')}
                    >
                      Bill No {sortConfig?.key === 'estAmount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('estAmount')}
                    >
                      Bill amt {sortConfig?.key === 'estAmount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
                  {sortedParts.map((part) => (
                    <tr key={part.id}>
                      <td className="p-3">{part.name}</td>
                      <td className="p-3">
                        <select
                          className="w-full p-1 outline-none"
                          value={part.action}
                          onChange={(e) => handlePartChange(part.id, 'action', e.target.value)}
                        >
                          <option value="Replace">Replace</option>
                          <option value="Repair">Repair</option>
                          <option value="Refurbish">Refurbish</option>
                        </select>
                      </td>
                      <td className="p-3">{part.material}</td>
                      <td className="p-3">
                        <select
                          className="w-full p-1 outline-none"
                          value={part.coverage}
                          onChange={(e) => handlePartChange(part.id, 'coverage', e.target.value as 'Yes' | 'No')}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </td>
                      <td className="p-3">{part.estNo}</td>
                      <td className="p-3">₹{part.estAmount.toFixed(2)}</td>
                      <td className="p-3">₹{part.estAmount.toFixed(2)}</td>
                      <td className="p-3">₹{part.estAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#F6F6F6] sticky bottom-0 text-sm border-t border-[#EFEFEF]">
                  <tr>
                    <td colSpan={5} className="p-3 text-left font-semibold text-[#5C5C5C] text-[12px]">Total Cost:</td>
                    {/* <td className="p-3 font-semibold text-[#5C5C5C]">
                      ₹{totalPartsAmount.toFixed(2)}
                    </td> */}
                    <td> ₹{totalPartsAmount.toFixed(2)}</td>
                    <td> ₹{totalPartsAmount.toFixed(2)}</td>
                    <td> ₹{totalPartsAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-[14px] font-semibold text-[#000000] mb-4">Garage Estimate</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-[#EFEFEF]">
                <thead className="bg-[#FBFBFB] border-b border-[#EFEFEF] text-sm text-gray-600">
                  <tr>          
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('action')}
                    >
                      Action Required {sortConfig?.key === 'action' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('material')}
                    >
                      Material {sortConfig?.key === 'material' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('name')}
                    >
                      Vehicle Part {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('coverage')}
                    >
                      Coverage {sortConfig?.key === 'coverage' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('estNo')}
                    >
                      Est No. {sortConfig?.key === 'estNo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('estAmount')}
                    >
                      Est Amt {sortConfig?.key === 'estAmount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('estAmount')}
                    >
                      Bill No {sortConfig?.key === 'estAmount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 cursor-pointer" 
                      onClick={() => handleSort('estAmount')}
                    >
                      Bill amt {sortConfig?.key === 'estAmount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
                  {sortedParts.map((part) => (
                    <tr key={part.id}>
                      <td className="p-3">{part.name}</td>
                      <td className="p-3">
                        <select
                          className="w-full p-1 outline-none"
                          value={part.action}
                          onChange={(e) => handlePartChange(part.id, 'action', e.target.value)}
                        >
                          <option value="Replace">Replace</option>
                          <option value="Repair">Repair</option>
                          <option value="Refurbish">Refurbish</option>
                        </select>
                      </td>
                      <td className="p-3">{part.material}</td>
                      <td className="p-3">
                        <select
                          className="w-full p-1 outline-none"
                          value={part.coverage}
                          onChange={(e) => handlePartChange(part.id, 'coverage', e.target.value as 'Yes' | 'No')}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </td>
                      <td className="p-3">{part.estNo}</td>
                      <td className="p-3">₹{part.estAmount.toFixed(2)}</td>
                      <td className="p-3">₹{part.estAmount.toFixed(2)}</td>
                      <td className="p-3">₹{part.estAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#F6F6F6] sticky bottom-0 text-sm border-t border-[#EFEFEF]">
                  <tr>
                    <td colSpan={5} className="p-3 text-left font-semibold text-[#5C5C5C] text-[12px]">Total Cost:</td>
                    {/* <td className="p-3 font-semibold text-[#5C5C5C]">
                      ₹{totalPartsAmount.toFixed(2)}
                    </td> */}
                    <td> ₹{totalPartsAmount.toFixed(2)}</td>
                    <td> ₹{totalPartsAmount.toFixed(2)}</td>
                    <td> ₹{totalPartsAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
  {/* Products & Services - 1/3 Width */}
  <div className="w-full md:w-1/3 rounded-lg">
    <h3 className="text-[14px] font-semibold text-[#000000] mb-4">Products & Services</h3>
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
        <select className="border rounded px-2 py-1 w-24 outline-none border border-[#E5E5E5]">
          <option value="cgst">4%</option>
          <option value="cgst_alt1">CGST Alt 1</option>
          <option value="cgst_alt2">CGST Alt 2</option>
        </select>
      </td>
      <td className="px-4 py-2">3</td>
      <td className="px-4 py-2">25.00</td>
      <td className="px-4 py-2">75.00</td>
      <td className="px-4 py-2">75.00</td>
    </tr>
    <tr>
      <td className="px-4 py-2 flex justify-between items-center">
        SGST
        <select className="border rounded px-2 py-1 w-24 outline-none border border-[#E5E5E5]">
          <option value="sgst">8%</option>
          <option value="sgst_alt1">SGST Alt 1</option>
          <option value="sgst_alt2">SGST Alt 2</option>
        </select>
      </td>
      <td className="px-4 py-2">3</td>
      <td className="px-4 py-2">25.00</td>
      <td className="px-4 py-2">75.00</td>
      <td className="px-4 py-2">75.00</td>
    </tr>
    <tr>
      <td className="px-4 py-2 flex justify-between items-center">
        Paint Depreciation (PM)
        <select className="border rounded px-2 py-1 w-24 outline-none border border-[#E5E5E5]">
          <option value="paint_depr_pm">9%</option>
          <option value="paint_depr_alt1">Paint Depreciation Alt 1</option>
          <option value="paint_depr_alt2">Paint Depreciation Alt 2</option>
        </select>
      </td>
      <td className="px-4 py-2">3</td>
      <td className="px-4 py-2">25.00</td>
      <td className="px-4 py-2">75.00</td>
      <td className="px-4 py-2">75.00</td>
    </tr>
  </tbody>
  <tfoot className="bg-gray-100 text-[14px]">
    <tr>
      <td className="px-4 py-2 font-semibold text-left">Grand Total</td>
      <td className="px-4 py-2 font-semibold">2343.00</td>
      <td className="px-4 py-2 font-semibold"></td>
      <td className="px-4 py-2 font-semibold"></td>
      <td className="px-4 py-2 font-semibold">225.00</td>
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
          <table className="w-full text-sm text-gray-800 border border-[#EFEFEF] rounded-lg p-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left">Particulars</th>
                <th className="pb-2 text-right">Insurer&apos;s Liability</th>
                <th className="pb-2 text-right">Insured&apos;s Share</th>
              </tr>
            </thead>
            <tbody>
              {insurerLiabilities.map((val, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-2">
                    {idx === 0 && 'Parts assessed (C)'}
                    {idx === 1 && 'Labour (Repair & R&R)'}
                    {idx === 2 && 'Paint'}
                    {idx === 3 && 'Towing charges'}
                  </td>
                  <td className="py-2 text-right">{val.toFixed(2)}</td>
                  <td className="py-2 text-right">{insuredShares[idx].toFixed(2)}</td>
                </tr>
              ))}

              {/* Compulsory excess rows */}
              {excesses.map((ex, i) => (
                <tr key={`excess-${i}`} className="border-b border-gray-100 bg-gray-50">
                  <td className="py-2">Less: Compulsory excess</td>
                  <td className="py-2 text-right">
                    <input
                      type="number"
                      value={ex}
                      onChange={e => handleExcessChange(i, Number(e.target.value))}
                      className="w-24 text-right px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="py-2 text-right">0</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="pt-2 font-medium">Net Settlement:</td>
                <td />
                <td className="pt-2 text-right font-medium">{netSettlement.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Final Settlement Card */}
        <div className="col-span-12 md:col-span-6 bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Final settlement</h3>

          <select
            className="mb-4 w-48 px-4 py-2 border border-gray-300 rounded-lg bg-white"
            value={selectedAddon}
            onChange={e => setSelectedAddon(e.target.value)}
          >
            <option>NO ADD ON</option>
            <option>ADD ON A</option>
            <option>ADD ON B</option>
          </select>

          <div className="grid grid-cols-2 gap-4 mb-4 items-center">
            <label className="text-sm text-gray-700">Settlement Percentage %</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={settlementPct}
                onChange={e => setSettlementPct(Number(e.target.value))}
                className="w-24 px-2 py-1 border border-gray-300 rounded"
              />
            </div>

            <label className="text-sm text-gray-700">Amt. Non Standard Deduction</label>
            <input
              type="number"
              value={nonStandardDeduction}
              onChange={e => setNonStandardDeduction(Number(e.target.value))}
              className="w-24 px-2 py-1 border border-gray-300 rounded"
            />
          </div>

          <div className="bg-gray-100 px-4 py-2 rounded mb-4 flex justify-between font-medium text-gray-800">
            <span>Total Settlement Amount</span>
            <span>{totalSettlementAmount.toFixed(2)}</span>
          </div>

          <label className="text-sm text-gray-700 mb-2">Details of Damage</label>
          <textarea
            value={damageDetails}
            onChange={e => setDamageDetails(e.target.value)}
            placeholder="Type here…"
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none"
          />

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