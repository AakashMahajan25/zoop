import React, { useState, useMemo, useRef, useEffect } from 'react';
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
    docName: "Front Left",
    collectionStatus: "Received",
    damageSeverity: "50%",
    uploadedBy: "Customer",
    uploadDate: "21 Feb 2020",
  },
  {
    id: 2,
    docName: "Front Right",
    collectionStatus: "Pending",
    damageSeverity: "50%",
    uploadedBy: "Customer",
    uploadDate: "21 Feb 2020",
  },
  {
    id: 3,
    docName: "Rear Left",
    collectionStatus: "Awaiting Recollection",
    damageSeverity: "50%",
    uploadedBy: "Customer",
    uploadDate: "21 Feb 2020",
  },
  {
    id: 4,
    docName: "Rear Right",
    collectionStatus: "Received",
    damageSeverity: "0%",
    uploadedBy: "Customer",
    uploadDate: "21 Feb 2020",
  },
  {
    id: 5,
    docName: "Left Hand Front Door",
    collectionStatus: "Received",
    damageSeverity: "50%",
    uploadedBy: "Customer",
    uploadDate: "21 Feb 2020",
  },
  {
    id: 6,
    docName: "Right Hand Front Door",
    collectionStatus: "Received",
    damageSeverity: "50%",
    uploadedBy: "Customer",
    uploadDate: "21 Feb 2020",
  },
  {
    id: 7,
    docName: "Left Hand Rear Door",
    collectionStatus: "Received",
    damageSeverity: "0%",
    uploadedBy: "Customer",
    uploadDate: "21 Feb 2020",
  },
  {
    id: 8,
    docName: "Left Hand Rear Door",
    collectionStatus: "Received",
    damageSeverity: "50%",
    uploadedBy: "Customer",
    uploadDate: "21 Feb 2020",
  },
  {
    id: 9,
    docName: "Odometer",
    collectionStatus: "Received",
    damageSeverity: "50%",
    uploadedBy: "Customer",
    uploadDate: "21 Feb 2020",
  },
  {
    id: 10,
    docName: "Chassis Number",
    collectionStatus: "Received",
    damageSeverity: "50%",
    uploadedBy: "Customer",
    uploadDate: "21 Feb 2020",
  },
  {
    id: 11,
    docName: "Engine Number",
    collectionStatus: "Received",
    damageSeverity: "0%",
    uploadedBy: "Customer",
    uploadDate: "21 Feb 2020",
  },
  {
    id: 12,
    docName: "Video Upload 360",
    collectionStatus: "Received",
    damageSeverity: "0%",
    uploadedBy: "Customer",
    uploadDate: "21 Feb 2020",
  },
];

// Status color mapping
const statusColor: { [key: string]: string } = {
  "Received": "#0AA7DC",
  "Pending": "#FF9807",
  "Awaiting Recollection": "#9747FF",
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
  const [zoomRepair, setZoomRepair] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  // const [sortConfig, setSortConfig] = useState<{ key: keyof TableRow; direction: 'asc' | 'desc' } | null>(null);
  const [maxZoom, setMaxZoom] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const [sortConfig, setSortConfig] = useState<{
    table: string;
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  useEffect(() => {
    const updateMaxZoom = () => {
      const img = imageRef.current;
      if (img) {
        const naturalHeight = img.naturalHeight;
        const renderedHeight = img.clientHeight;
        if (renderedHeight > 0) {
          const maxScale = naturalHeight / renderedHeight;
          setMaxZoom(Math.max(1, maxScale));
        }
      }
    };

    updateMaxZoom();
    window.addEventListener('resize', updateMaxZoom);
    return () => window.removeEventListener('resize', updateMaxZoom);
  }, []);
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
  const repairTableData = [
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
  ];

  const sortedRepairData = useMemo(() => {
    if (!sortConfig || sortConfig.table !== 'repairStatusTable') return repairTableData;

    return [...repairTableData].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof typeof a]?.toString()?.toLowerCase() || '';
      const bVal = b[sortConfig.key as keyof typeof b]?.toString()?.toLowerCase() || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortConfig]);

  // Handlers
  const handlePrevPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleReset = () => {
    setZoom(1);
  };
  const handleResetRepair = () => {
    setZoomRepair(1);
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
  const handleSort = (table: string, key: string) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key || prev.table !== table) {
        return { table, key, direction: 'asc' };
      }
      return { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
    });
  };


  const totalCost = (parseFloat(partPrice) || 0) + (parseFloat(laborRepair) || 0) + (parseFloat(laborPaint) || 0);

  const sortData = (data: any[]) => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key]?.toLowerCase?.() || '';
      const bVal = b[sortConfig.key]?.toLowerCase?.() || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };



  const getArrow = (table: string, key: string) => {
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
  const sortedChecklistData = useMemo(() => {
    if (!sortConfig || sortConfig.table !== 'photoChecklist') return mockData;

    return [...mockData].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof TableRow]?.toString()?.toLowerCase() || '';
      const bVal = b[sortConfig.key as keyof TableRow]?.toString()?.toLowerCase() || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortConfig]);


  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row gap-6 py-2 mb-4 border border-[#F0F0F1] w-full sm:w-76 justify-center">
        <button
          className={`px-3 py-2 rounded-md transition ${activeTab === 'preRepaired' ? 'bg-[#21FF91] text-[#000000]' : 'text-[#787C82] hover:text-[#000000] hover:bg-[#21FF91] cursor-pointer'}`}
          onClick={() => setActiveTab('preRepaired')}
        >
          Pre Repaired
        </button>
        <button
          className={`px-3 py-1 rounded-md font-medium transition ${activeTab === 'postRepaired' ? 'bg-[#21FF91] text-[#000000]' : 'text-[#787C82] hover:text-[#000000] hover:bg-[#21FF91] cursor-pointer'}`}
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
              <div className="relative w-full sm:w-76 mb-4">
                <select
                  className="
                    block w-full
                    bg-[#FFFFFF]
                    border border-[#E5E5E5]
                    text-[#646970]
                    text-[14px]
                    rounded-md
                    px-4 py-2
                    pr-10
                    appearance-none
                    focus:outline-none cursor-pointer
                  "
                  value={selectedPhotoIndex}
                  onChange={(e) => setSelectedPhotoIndex(Number(e.target.value))}
                >
                  {photos.map((photo, index) => (
                    <option key={photo.id} value={index}>
                      Front Left {photo.id}
                    </option>
                  ))}
                </select>

                {/* Chevron icon */}
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-4 h-4 text-[#646970]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>


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
                      className="px-2 bg-white border border-[#DBDADE] py-1 rounded cursor-pointer transition"
                    >
                      <Image src="/assets/zoomOutIcon.svg" alt="Zoom Out" width={24} height={24} />
                    </button>
                    <button
                      onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                      aria-label="Zoom In"
                      className="px-2 bg-white border border-[#DBDADE] py-1 rounded cursor-pointer transition"
                    >
                      <Image src="/assets/zoominIcon.svg" alt="Zoom In" width={24} height={24} />
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-2 bg-white border border-[#DBDADE] py-1 rounded cursor-pointer transition"
                    >
                      <Image src="/assets/refresIcon.svg" alt="Refresh" width={24} height={24} />
                    </button>
                    <button
                      onClick={handleEdit}
                      className="px-2 bg-white border border-[#DBDADE] py-1 rounded cursor-pointer transition"
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

              <div className="flex-1 radius-[4.55px] border-[0.76px] border-[#E5E5E5] bg-[#FFFFFF] max-h-[420px]">
                {/* Damage Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:px-6 border-b border-gray-300">
                  <div>
                    <p className="text-sm text-[#333333] mb-4">Damage Type</p>
                    <p className="text-md font-medium text-black capitalize">Internal</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#333333] mb-4">Damage Nature</p>
                    <p className="text-md font-medium text-black capitalize">Scratch</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#333333] mb-4">Damage Severity</p>
                    <p className="text-md font-medium text-black capitalize">Mild</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#333333] mb-4">Material Detection</p>
                    <p className="text-md font-medium text-black capitalize">Metal</p>
                  </div>
                </div>

                {/* Part Information */}
                <div className='p-4 sm:px-6 border-b border-gray-300'>
                  <h4 className="text-base font-semibold text-md text-[#333] mb-4">Part Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#333] mb-4">Part Identification</p>
                      <p className="text-md font-medium text-black capitalize">Front Bumper</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#333] mb-4">Action Required</p>
                      <p className="text-md font-medium text-black capitalize">Repair</p>
                    </div>
                  </div>
                </div>

                {/* Cost Estimation */}
                <div className='p-4 sm:px-6'>
                  <h4 className="text-base font-semibold text-md text-[#333] mb-4">Cost Estimation</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-[#333] mb-4">Part Price</p>
                      <p className="text-md font-medium ml-3 text-black mb-4">4,889</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#333] mb-4">Labour Repair</p>
                      <p className="text-md font-medium ml-3 text-black mb-4">3,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#333] mb-4">Labour Paint</p>
                      <p className="text-md font-medium ml-3 text-black mb-4">2,000</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 bg-[#FFFFFF]">
                    <p className="text-md text-base font-semibold text-md text-[#333]">Total Cost:</p>
                    <p className="text-md font-bold text-black">
                      Rs.45890
                    </p>
                  </div>
                </div>
              </div>
            </div>


          </div>
          <div className="mt-14 overflow-x-auto rounded-lg">
            <h1 className="text-lg text-[#484848] font-bold mb-6">Photos Checklist</h1>
            <div className="overflow-y-auto">
              <table className="min-w-full border-[0.76px] border-[#EFEFEF] bg-[#FFFFFF]">
                <thead className="bg-[#FBFBFB] text-[#858585] text-[13px]">
                  <tr>
                    <th className="text-left p-3 cursor-pointer bg-[#FBFBFB]" onClick={() => handleSort('photoChecklist', 'docName')}>
                      <div className="flex items-center justify-between">
                        Doc Name
                        {getArrow('photoChecklist', 'docName')}
                      </div>
                    </th>
                    <th className="text-left p-3 cursor-pointer bg-[#FBFBFB]" onClick={() => handleSort('photoChecklist', 'collectionStatus')}>
                      <div className="flex items-center justify-between">
                        Collection Status
                        {getArrow('photoChecklist', 'collectionStatus')}
                      </div>
                    </th>
                    <th className="text-left p-3 cursor-pointer bg-[#FBFBFB]" onClick={() => handleSort('photoChecklist', 'damageSeverity')}>
                      <div className="flex items-center justify-between">
                        Damage Severity
                        {getArrow('photoChecklist', 'damageSeverity')}
                      </div>
                    </th>
                    <th className="text-left p-3 cursor-pointer bg-[#FBFBFB]" onClick={() => handleSort('photoChecklist', 'uploadedBy')}>
                      <div className="flex items-center justify-between">
                        Uploaded By
                        {getArrow('photoChecklist', 'uploadedBy')}
                      </div>
                    </th>
                    <th className="text-left p-3 cursor-pointer bg-[#FBFBFB]" onClick={() => handleSort('photoChecklist', 'uploadDate')}>
                      <div className="flex items-center justify-between">
                        Date
                        {getArrow('photoChecklist', 'uploadDate')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-500 divide-y divide-gray-200">
                  {sortedChecklistData.map((doc) => {
                    const color = statusColor[doc.collectionStatus] || '#000';
                    return (
                      <tr key={doc.id}>
                        <td className="p-4">{doc.docName}</td>
                        <td className="p-4" style={{ color }}>
                          <span className="inline-block w-[8px] h-[8px] rounded-full mr-2" style={{ backgroundColor: color }} />
                          {doc.collectionStatus}
                        </td>
                        <td className="p-4">{doc.damageSeverity}</td>
                        <td className="p-4">{doc.uploadedBy}</td>
                        <td className="p-4">{doc.uploadDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </>
      )}

      {activeTab === 'postRepaired' && (
        <>
          <div className="p-6 bg-[#F3F3F3] rounded mb-8">
            <h2 className="text-sm text-[#787C82] mb-4">Section: Front Left</h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Damaged Picture */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold mb-2 text-[#3B3B3B]">Damaged Picture</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setZoomRepair((prev) => Math.max(0.5, prev - 0.1))}
                      className="p-2 bg-white border border-gray-300 rounded cursor-pointer"
                    >
                      <Image src="/assets/zoomOutIcon.svg" alt="Zoom Out" width={24} height={24} />
                    </button>
                    <button
                      onClick={() => setZoomRepair((prev) => Math.min(maxZoom, prev + 0.1))}
                      className="p-2 bg-white border border-gray-300 rounded cursor-pointer"
                    >
                      <Image src="/assets/zoominIcon.svg" alt="Zoom In" width={24} height={24} />
                    </button>
                  </div>
                </div>
                <Image
                  id="estimateImage"
                  ref={imageRef}
                  src="/assets/testImg.svg"
                  alt="Vehicle Damage"
                  width={800}
                  height={800}
                  className="object-contain w-full border rounded"
                  style={{ transform: `scale(${zoomRepair})`, transformOrigin: 'center' }}
                />

                <div className="flex justify-between items-start mt-2">
                  <div>
                    <p className="text-sm">Capture Date: 5/10/2023, 2:32:00 PM</p>
                    <p className="text-sm">Location: 40.728600, -74.006000</p>
                  </div>
                  <button
                    onClick={handleResetRepair}
                    className="p-2 bg-white border border-[#DBDADE] rounded cursor-pointer transition"
                  >
                    <Image src="/assets/refresIcon.svg" alt="Refresh" width={24} height={24} />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-[#3B3B3B]">Repaired Picture</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
                      className="p-2 bg-white border border-gray-300 rounded cursor-pointer"
                    >
                      <Image src="/assets/zoomOutIcon.svg" alt="Zoom Out" width={24} height={24} />
                    </button>
                    <button
                      onClick={() => setZoom((prev) => Math.min(maxZoom, prev + 0.1))}
                      className="p-2 bg-white border border-gray-300 rounded cursor-pointer"
                    >
                      <Image src="/assets/zoominIcon.svg" alt="Zoom In" width={24} height={24} />
                    </button>
                  </div>
                </div>

                <Image
                  id="estimateImage"
                  ref={imageRef}
                  src="/assets/testImg.svg"
                  alt="Vehicle Damage"
                  width={800}
                  height={800}
                  className="object-contain w-full border rounded"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                />

                <div className="flex justify-between items-start mt-2">
                  <div>
                    <p className="text-sm">Capture Date: 5/10/2023, 2:32:00 PM</p>
                    <p className="text-sm">Location: 40.728600, -74.006000</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="p-2 bg-white border border-[#DBDADE] rounded cursor-pointer transition"
                  >
                    <Image src="/assets/refresIcon.svg" alt="Refresh" width={24} height={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex flex-wrap gap-2 justify-start mb-8 w-full">
              {[...Array(18)].map((_, index) => (
                <img
                  key={index}
                  src="/assets/testImg.svg"
                  alt={`testImg ${index + 1}`}
                  className="w-[calc(11.11%-0.5rem)] h-20 object-cover border rounded"
                />
              ))}
            </div>
          </div>
          {/* Table */}
          <h3 className="text-lg font-semibold my-2">Repair Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-200 text-sm">
              <thead className='bg-[#FBFBFB] text-[#858585] text-[13px]'>
                <tr className="bg-[#FBFBFB] text-[#858585]">
                  {[
                    { label: 'Part Name', key: 'part' },
                    { label: 'Status', key: 'status' },
                    { label: 'Mismatch', key: 'mismatch' },
                    { label: 'Repair', key: 'repair' },
                  ].map(({ label, key }) => (
                    <th
                      key={key}
                      onClick={() => handleSort('repairStatusTable', key)}
                      className="px-4 py-3 text-left cursor-pointer select-none"
                    >
                      <div className="flex items-center justify-between">
                        {label}
                        {getArrow('repairStatusTable', key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 ">
                {sortedRepairData.map((item, index) => (
                  <tr key={index} className='hover:bg-[#93FFCA1A]'>
                    <td className="px-4 py-4">{item.part}</td>
                    <td className={`px-4 py-4 font-medium ${item.color}`}>{item.status}</td>
                    <td className="px-4 py-4">
                      <p className="tableTextStyle mt-2">No Mismatch</p>
                    </td>
                    <td className="px-4 py-4">{item.repair}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
};

export default ClaimsHandlerPhotosSection;