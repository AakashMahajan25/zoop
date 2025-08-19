import React, { useState, useMemo } from 'react';
import Image from 'next/image';

// Interface for Photo data
interface Photo {
    id: number;
    src: string;
    captureDate: string;
    location: string;
    device: string;
}

// Interface for Table data
interface TableRow {
    id: number;
    docName: string;
    collectionStatus: string;
    damageSeverity: string;
    uploadedBy: string;
    uploadDate: string;
}

// Mock data for the table
const mockData: TableRow[] = [
    {
        id: 1,
        docName: "Insurance_Report.pdf",
        collectionStatus: "Received",
        damageSeverity: "Moderate",
        uploadedBy: "John Doe",
        uploadDate: "21 Feb 2020",
    },
    {
        id: 2,
        docName: "Claim_Photo.jpg",
        collectionStatus: "Pending",
        damageSeverity: "Severe",
        uploadedBy: "Jane Smith",
        uploadDate: "21 Feb 2020",
    },
    {
        id: 3,
        docName: "Repair_Estimate.pdf",
        collectionStatus: "Awaiting Collection",
        damageSeverity: "Minor",
        uploadedBy: "David Jones",
        uploadDate: "21 Feb 2020",
    },
];

// Status color mapping
const statusColor: { [key: string]: string } = {
    Received: "text-green-600",
    Pending: "text-yellow-600",
    "Awaiting Collection": "text-red-600",
};

const ClaimsHandlerPhotosSection: React.FC = () => {
    // State management
    const [activeTab, setActiveTab] = useState<'preRepaired' | 'postRepaired'>('preRepaired');
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
    const [damageType, setDamageType] = useState<'internal' | 'external' | ''>('');
    const [damageNature, setDamageNature] = useState<string>('');
    const [damageSeverity, setDamageSeverity] = useState<string>('');
    const [materialDetection, setMaterialDetection] = useState<string>('');
    const [partIdentification, setPartIdentification] = useState<string>('');
    const [repairAction, setRepairAction] = useState<'repair' | 'replace' | 'reject' | ''>('');
    const [partPrice, setPartPrice] = useState<string>('');
    const [laborRepair, setLaborRepair] = useState<string>('');
    const [laborPaint, setLaborPaint] = useState<string>('');
    const [zoom, setZoom] = useState<number>(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof TableRow; direction: 'asc' | 'desc' } | null>(null);

    // Sample photo data
    const photos: Photo[] = [
        {
            id: 1,
            src: '/assets/testImg.svg',
            captureDate: '15 Feb 2020',
            location: 'Highway 101',
            device: 'iPhone 12',
        },
        {
            id: 2,
            src: '/assets/testImg.svg',
            captureDate: '16 Feb 2020',
            location: 'Downtown Garage',
            device: 'Samsung Galaxy S21',
        },
        {
            id: 3,
            src: '/assets/testImg.svg',
            captureDate: '17 Feb 2020',
            location: 'Service Center',
            device: 'Canon EOS',
        },
    ];

    // Handlers
    const handlePrevPhoto = () => {
        setSelectedPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    };

    const handleNextPhoto = () => {
        setSelectedPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    const handleReset = () => {
        setSelectedPhotoIndex(0);
    };

    const handleEdit = () => {
        console.log('Editing photo:', photos[selectedPhotoIndex]);
    };

    const handleRequestSubmission = () => {
        console.log('Requesting submission for photo:', photos[selectedPhotoIndex]);
    };

    const handleSaveAssessment = () => {
        console.log('Saving assessment:', {
            damageType,
            damageNature,
            damageSeverity,
            materialDetection,
            partIdentification,
            repairAction,
            partPrice,
            laborRepair,
            laborPaint,
        });
    };

    const handleCancel = () => {
        setDamageType('');
        setDamageNature('');
        setDamageSeverity('');
        setMaterialDetection('');
        setPartIdentification('');
        setRepairAction('');
        setPartPrice('');
        setLaborRepair('');
        setLaborPaint('');
    };

    // Sorting handler
    const handleSort = (key: keyof TableRow) => {
        setSortConfig((prev) => {
            if (!prev || prev.key !== key) {
                return { key, direction: 'asc' };
            }
            return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
        });
    };

    // Sorted data
    const sortedData = useMemo(() => {
        if (!sortConfig) return mockData;
        const sorted = [...mockData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [sortConfig]);

    const totalCost = (parseFloat(partPrice) || 0) + (parseFloat(laborRepair) || 0) + (parseFloat(laborPaint) || 0);

    return (
        <div className="flex flex-col w-full">
            {/* Tabs */}
            <div className="flex flex-row gap-6 py-2 mb-4 border border-[#F0F0F1] w-full sm:w-76 justify-center">
                <button
                    className={`px-3 py-1 rounded-md transition ${activeTab === 'preRepaired' ? 'bg-[#21FF91] text-[#000000]' : 'bg-gray-200 text-[#787C82] hover:bg-gray-300'}`}
                    onClick={() => setActiveTab('preRepaired')}
                >
                    Pre Repaired
                </button>
                <button
                    className={`px-3 py-1 rounded-md font-medium transition ${activeTab === 'postRepaired' ? 'bg-[#21FF91] text-[#000000]' : 'bg-gray-200 text-[#787C82] hover:bg-gray-300'}`}
                    onClick={() => setActiveTab('postRepaired')}
                >
                    Post Repaired
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'preRepaired' && (
                <>
                <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[750px] w-full">
                    {/* Left: Photo Viewer Section */}
                    <div className="w-full md:w-1/2 flex flex-col">
                        <select
                            className="w-full sm:w-76 p-2 mb-4 border border-[#E5E5E5] rounded-md text-[#646970]"
                            value={selectedPhotoIndex}
                            onChange={(e) => setSelectedPhotoIndex(Number(e.target.value))}
                        >
                            {photos.map((photo, index) => (
                                <option key={photo.id} value={index}>
                                    Front Left {photo.id}
                                </option>
                            ))}
                        </select>

                        <div className="bg-[#F3F3F3] p-4 sm:p-6 flex flex-col flex-1 rounded-md">
                                                    <div
                        className="w-full rounded-md mb-4 overflow-hidden"
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                        >
                        <Image
                            src={photos[selectedPhotoIndex].src}
                            alt="Selected Photo"
                            width={800}
                            height={800} 
                            className="w-full h-auto object-contain"
                        />
                        </div>

                            {/* Zoom & Navigation Controls */}
                            <div className="flex flex-col sm:flex-row justify-between items-center w-full my-4 gap-2">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                                        aria-label="Zoom Out"
                                        className="px-2 bg-white border border-[#DBDADE] py-1 rounded hover:bg-gray-100 transition"
                                    >
                                        <Image src="/assets/zoomOutIcon.svg" alt="Zoom Out" width={24} height={24} />
                                    </button>
                                    <button
                                        onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                                        aria-label="Zoom In"
                                        className="px-2 bg-white border border-[#DBDADE] py-1 rounded hover:bg-gray-100 transition"
                                    >
                                        <Image src="/assets/zoominIcon.svg" alt="Zoom In" width={24} height={24} />
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="px-2 bg-white border border-[#DBDADE] py-1 rounded hover:bg-gray-100 transition"
                                    >
                                        <Image src="/assets/refresIcon.svg" alt="Refresh" width={24} height={24} />
                                    </button>
                                    <button
                                        onClick={handleEdit}
                                        className="px-2 bg-white border border-[#DBDADE] py-1 rounded hover:bg-gray-100 transition"
                                    >
                                        <Image src="/assets/penIcon.svg" alt="Pen" width={24} height={24} />
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="px-3 bg-white border border-[#DBDADE] py-2 rounded cursor-pointer"
                                        onClick={handlePrevPhoto}
                                    >
                                        <img src='/assets/LeftIcon.svg' alt='Previous' />
                                    </button>
                                    <button
                                        className="px-3 bg-white border border-[#DBDADE] py-2 rounded cursor-pointer"
                                        onClick={handleNextPhoto}
                                    >
                                        <img src='/assets/LeftIcon.svg' alt='Next' className='rotate-180' />
                                    </button>
                                </div>
                            </div>

                            {/* Metadata & Submission */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                <div className='flex flex-col gap-2 my-4'>
                                    <p className="text-[#787C82] text-sm">Capture Date: <span>{photos[selectedPhotoIndex].captureDate}</span></p>
                                    <p className="text-[#787C82] text-sm">Location: <span>{photos[selectedPhotoIndex].location}</span></p>
                                    <p className="text-[#787C82] text-sm">Device: <span>{photos[selectedPhotoIndex].device}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Damage Detection Section */}
                    <div className="w-full md:w-1/2 flex flex-col rounded-md">
                        <h1 className="text-lg text-[#484848] font-bold mb-6">Damage Detection</h1>

                        <div className="space-y-6 flex-1 rounded-lg border border-gray-200 px-4 sm:px-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-[#333] mb-2">Damage Type</p>
                                    <div className="flex gap-4">
                                        {['internal', 'external'].map((type) => (
                                            <label key={type} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="damageType"
                                                    value={type}
                                                    checked={damageType === type}
                                                    onChange={(e) => setDamageType(e.target.value as 'internal' | 'external')}
                                                    className="h-4 w-4"
                                                />
                                                <span className="text-sm capitalize">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-[#333] mb-2">Damage Nature</p>
                                    <select
                                        className="w-full border border-[#D0D0D0] rounded-md p-2 text-sm"
                                        value={damageNature}
                                        onChange={(e) => setDamageNature(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="Scratch">Scratch</option>
                                        <option value="Dent">Dent</option>
                                        <option value="Crack">Crack</option>
                                    </select>
                                </div>

                                <div>
                                    <p className="text-sm text-[#333] mb-2">Damage Severity</p>
                                    <select
                                        className="w-full border border-[#D0D0D0] rounded-md p-2 text-sm"
                                        value={damageSeverity}
                                        onChange={(e) => setDamageSeverity(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="Minor">Minor</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Severe">Severe</option>
                                    </select>
                                </div>

                                <div>
                                    <p className="text-sm text-[#333] mb-2">Material Detection</p>
                                    <select
                                        className="w-full border border-[#D0D0D0] rounded-md p-2 text-sm"
                                        value={materialDetection}
                                        onChange={(e) => setMaterialDetection(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="Metal">Metal</option>
                                        <option value="Plastic">Plastic</option>
                                        <option value="Glass">Glass</option>
                                    </select>
                                </div>
                            </div>

                            {/* Part Info */}
                            <div>
                                <h4 className="text-base font-semibold text-[#333] mb-4">Part Information</h4>
                                <div className="mb-4">
                                    <p className="text-sm text-[#333] mb-2">Part Identification</p>
                                    <input
                                        type="text"
                                        value={partIdentification}
                                        onChange={(e) => setPartIdentification(e.target.value)}
                                        placeholder="Enter Part Name"
                                        className="w-full border border-[#D0D0D0] rounded-md p-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <p className="text-sm text-[#333] mb-2">Action Required</p>
                                    <div className="flex gap-6">
                                        {['repair', 'replace', 'reject'].map((action) => (
                                            <label key={action} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="repairAction"
                                                    value={action}
                                                    checked={repairAction === action}
                                                    onChange={(e) => setRepairAction(e.target.value as 'repair' | 'replace' | 'reject')}
                                                    className="h-4 w-4"
                                                />
                                                <span className="text-sm capitalize">{action}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Cost Estimation */}
                            <div>
                                <h4 className="text-base font-semibold text-[#333] mb-4">Cost Estimation</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-[#333] mb-2">Part Price:</p>
                                        <input
                                            type="number"
                                            value={partPrice}
                                            onChange={(e) => setPartPrice(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full border border-[#D0D0D0] rounded-md p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#333] mb-2">Labour Repair:</p>
                                        <input
                                            type="number"
                                            value={laborRepair}
                                            onChange={(e) => setLaborRepair(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full border border-[#D0D0D0] rounded-md p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#333] mb-2">Labour Paint:</p>
                                        <input
                                            type="number"
                                            value={laborPaint}
                                            onChange={(e) => setLaborPaint(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full border border-[#D0D0D0] rounded-md p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-sm font-bold text-[#333]">Total Cost:</p>
                                    <p className="text-sm font-bold text-black">Rs. Rs.45890</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="mt-6 overflow-x-auto rounded-lg">
                                        <h1 className="text-lg text-[#484848] font-bold mb-6">Photos Checklist</h1>
                <table className="min-w-full border border-[#EFEFEF] ">
                    <thead className="bg-[#FBFBFB] border border-[#EFEFEF] text-sm text-gray-600">
                        <tr>
                            <th className="text-left p-3 cursor-pointer" onClick={() => handleSort('docName')}>
                                Doc Name {sortConfig?.key === 'docName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="text-left p-3 cursor-pointer" onClick={() => handleSort('collectionStatus')}>
                                Collection Status {sortConfig?.key === 'collectionStatus' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="text-left p-3 cursor-pointer" onClick={() => handleSort('damageSeverity')}>
                                Damage Severity {sortConfig?.key === 'damageSeverity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="text-left p-3 cursor-pointer" onClick={() => handleSort('uploadedBy')}>
                                Uploaded By {sortConfig?.key === 'uploadedBy' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="text-left p-3 cursor-pointer" onClick={() => handleSort('uploadDate')}>
                                Date {sortConfig?.key === 'uploadDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="text-left p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
                        {sortedData.map((doc) => (
                            <tr key={doc.id}>
                                <td className="p-3 flex items-center gap-2">
                                    <span className="block truncate">{doc.docName}</span>
                                </td>
                                <td className={`p-3 ${statusColor[doc.collectionStatus]}`}>
                                    {doc.collectionStatus}
                                </td>
                                <td className="p-3">{doc.damageSeverity}</td>
                                <td className="p-3">{doc.uploadedBy}</td>
                                <td className="p-3">{doc.uploadDate}</td>
                                <td className="p-3">
                                    <button className="">
                                        <img src='/assets/viewIcon.svg' alt='viewIcon' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </>
            )}

            {activeTab === 'postRepaired' && (
  <div className="p-6 bg-white rounded shadow">
    <h2 className="text-sm text-[#787C82] mb-4">Section: Front Left</h2>

    <div className="grid grid-cols-2 gap-6 mb-6">
      <div>
        <h3 className="font-semibold mb-2 ">Damaged Picture</h3>
        <img src="/assets/testImg.svg" alt="testImg" className="w-full rounded border" />
        <p className="text-sm mt-2">Capture Date: 5/10/2023, 2:32:00 PM</p>
        <p className="text-sm">Location: 40.728600, -74.006000</p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Repaired Picture</h3>
        <img src="/assets/testImg.svg" alt="testImg" className="w-full rounded border" />
        <p className="text-sm mt-2">Capture Date: 5/10/2023, 2:32:00 PM</p>
        <p className="text-sm">Location: 40.728600, -74.006000</p>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 justify-start mb-8 w-full">
  {[...Array(18)].map((_, index) => (
    <img
      key={index}
      src="/assets/testImg.svg"
      alt={`testImg ${index + 1}`}
      className="w-[calc(11.11%-0.5rem)] h-20 object-cover border"
    />
  ))}
</div>

    <h3 className="text-lg font-semibold mb-2">Repair Details</h3>
    <div className="overflow-x-auto">
      <table className="w-full table-auto border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Part Name</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Mismatch</th>
            <th className="px-4 py-2">Repair</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              part: 'Front Bumper',
              status: 'Received',
              repair: 'Repaired',
              color: 'text-blue-600',
            },
            {
              part: 'Left Headlight',
              status: 'Pending',
              repair: 'Not covered in policy',
              color: 'text-yellow-600',
            },
            {
              part: 'Right Side Door',
              status: 'Recollection Requested',
              repair: 'Not repaired',
              color: 'text-pink-600',
            },
            {
              part: 'Left Side Door',
              status: 'Received',
              repair: 'Repaired',
              color: 'text-blue-600',
            },
          ].map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2">{item.part}</td>
              <td className={`px-4 py-2 font-medium ${item.color}`}>{item.status}</td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  placeholder="Enter any discrepancies..."
                  className="w-full px-2 py-1 rounded"
                />
              </td>
              <td className="px-4 py-2">{item.repair}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
        
        </div>
    );
};

export default ClaimsHandlerPhotosSection;