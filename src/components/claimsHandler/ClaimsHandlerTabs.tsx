import React, { useEffect, useState } from 'react';
import ClaimsHandlerPhotosSection from '@/components/ClaimsHandlerPhotosSection';
import ClaimsHandlerFinance from '@/components/ClaimsHandlerFinance';
import ClaimFullDetails from './ClaimFullDetails';
import Image from 'next/image';
import AgGridAuditorTable from '../auditorSection/AgGridAuditorTable';
import ClaimDocumentViewTable from '../auditorSection/ClaimDocumentViewTable';

interface Document {
  id: number;
  docName: string;
  collectionStatus: 'received' | 'pending';
  verificationStatus: 'verified' | 'pending' | 'error';
  uploadedBy: string;
  dueDate: string;
}

interface ClaimsHandlerTabsProps {
  activeStepId: string | null;
  documents: Document[];
  selectedDocs: number[];
  handleCheckboxChange: (id: number) => void;
  setIsSendReminderModalOpen: (isOpen: boolean) => void;
  setIsViewDetailsModalOpen: (isOpen: boolean) => void;
  setIsRequestDocumentModalOpen: (isOpen: boolean) => void;
  setIsUploadDocumentModalOpen: (isOpen: boolean) => void;
  toggleActionDropdown: (id: number) => void;
  activeActionDropdown: number | null;
}

const ClaimsHandlerTabs: React.FC<ClaimsHandlerTabsProps> = ({
  activeStepId,
  selectedDocs,
  handleCheckboxChange,
  setIsSendReminderModalOpen,
  setIsViewDetailsModalOpen,
  setIsRequestDocumentModalOpen,
  setIsUploadDocumentModalOpen,
  toggleActionDropdown,
  activeActionDropdown,
}) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'photos' | 'finance' | 'finalReport'>('documents');
  const [detailViewSlider, setDetailViewSlider] = useState<boolean>(false)
  const [zoom, setZoom] = useState<number>(1);

  useEffect(()=>{
    activeStepId === 'repair' && setActiveTab('photos');
    activeStepId === 'finalReport' && setActiveTab('finalReport');    
  }, [activeStepId])

  const documents: Document[] = [
    {
      id: 1,
      docName: 'Registration Certificate',
      collectionStatus: 'received',
      verificationStatus: 'verified',
      uploadedBy: 'Customer',
      dueDate: '21 Feb 2020',
    },
    {
      id: 2,
      docName: 'Driving License',
      collectionStatus: 'received',
      verificationStatus: 'verified',
      uploadedBy: 'Customer',
      dueDate: '21 Feb 2020',
    },
    {
      id: 3,
      docName: 'Policy Copy',
      collectionStatus: 'received',
      verificationStatus: 'verified',
      uploadedBy: 'Customer',
      dueDate: '21 Feb 2020',
    },
    {
      id: 4,
      docName: 'Claim Form',
      collectionStatus: 'received',
      verificationStatus: 'verified',
      uploadedBy: 'Customer',
      dueDate: '21 Feb 2020',
    },
    {
      id: 5,
      docName: 'PAN Card',
      collectionStatus: 'received',
      verificationStatus: 'verified',
      uploadedBy: 'Customer',
      dueDate: '21 Feb 2020',
    },
    {
      id: 6,
      docName: 'Aadhar Card',
      collectionStatus: 'received',
      verificationStatus: 'error',
      uploadedBy: 'Customer',
      dueDate: '21 Feb 2020',
    },
    {
      id: 7,
      docName: 'Intimation Form',
      collectionStatus: 'received',
      verificationStatus: 'verified',
      uploadedBy: 'Customer',
      dueDate: '21 Feb 2020',
    },
    {
      id: 8,
      docName: 'Other Doc',
      collectionStatus: 'received',
      verificationStatus: 'verified',
      uploadedBy: 'Customer',
      dueDate: '21 Feb 2020',
    },
  ];


  const claimDetails = {
    claimsNumber: 'CLM12345',
    policyNumber: 'POL67890',
    insuredName: 'John Doe',
    insuredAddress: '123 Main St, City, Country',
    mobile: '9876543210',
    stdCode: 'STD-123',
    landline: '0123456789',
    email: 'john.doe@example.com',
    registernNo: 'REG789',
    chassisNo: 'CHS123456',
    engineNo: 'ENG654321',
    make: 'Toyota',
    model: 'Camry',
    claimsServiceOffice: 'Downtown Branch',
    placeOfIncident: 'Highway 101',
    policyReport: 'RPT456',
    stationDiaryEntryNumber: 'SDN789',
    policeStationName: 'Central Station',
  };

  const handleFullscreen = () => {
    const img = document.getElementById("docImage");
    if (img && img.requestFullscreen) {
      img.requestFullscreen();
    }
  };


  return (
    <>
      {/* Tabs */}
      <div className="flex gap-3 mb-4 border-b border-[#F3F3F3]">
        <button
          className={`px-5 py-2 font-medium transition ${activeTab === 'documents' ? 'text-[#3A6048] border-b-2 border-[#21FF91]' : 'text-[#858585] hover:text-gray-400 cursor-pointer'
            }`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
        <button
          className={`px-5 py-2 font-medium transition ${activeTab === 'photos' ? 'text-[#3A6048] border-b-2 border-[#21FF91]' : 'text-[#858585] hover:text-gray-400 cursor-pointer'
            }`}
          onClick={() => setActiveTab('photos')}
        >
          Photos
        </button>
        <button
          className={`px-5 py-2 font-medium transition ${activeTab === 'finance' ? 'text-[#3A6048] border-b-2 border-[#21FF91]' : 'text-[#858585] hover:text-gray-400 cursor-pointer'
            }`}
          onClick={() => setActiveTab('finance')}
        >
          Finance
        </button>
        <button
          className={`px-5 py-2 font-medium transition ${activeTab === 'finalReport' ? 'text-[#3A6048] border-b-2 border-[#21FF91]' : 'text-[#858585] hover:text-gray-400 cursor-pointer'
            }`}
          onClick={() => setActiveTab('finalReport')}
        >
          Final Report
        </button>
      </div>

      {/* Tab Content */}
      <div className="py-2 rounded-lg">
        {activeTab === 'documents' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[20px] font-bold text-[#484848]">Document Checklist</h3>
            </div>
            <ClaimDocumentViewTable rowData={documents} onViewClick={(e) => setDetailViewSlider(true)} />
          </div>
        )}
        {activeTab === 'photos' && (
          <ClaimsHandlerPhotosSection />
        )}
        {activeTab === 'finance' && (
          <ClaimsHandlerFinance />
        )}
        {activeTab === 'finalReport' && (
          <ClaimFullDetails />
        )}
        {detailViewSlider && (
          <div className="fixed inset-0 z-50 ">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setDetailViewSlider(false)}
            ></div>

            <div className="absolute top-0 right-0 h-full w-full lg:w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
              <div className="p-6 h-full overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[20px] font-bold text-[#484848]">Document Review</h3>
                  <button
                    className="text-[#858585] text-[36px] px-4 py-1 rounded-md transition cursor-pointer"
                    onClick={() => setDetailViewSlider(false)}
                  >
                    &times;
                  </button>
                </div>

                <div className="relative w-60">
                  <select
                    className="
                        block w-full 
                        bg-[#FFFFFF] 
                        border border-[#E5E5E5] text-[#646970] text-[16px] rounded-md
                        px-4 py-2 
                        pr-10 
                        appearance-none 
                        focus:outline-none cursor-pointer
                        mb-6
                      "
                  >
                    <option>Registration Certificate</option>
                    <option>Driving License</option>
                    <option>Policy Copy</option>
                    <option>Claim Form</option>
                    <option>PAN Card</option>
                    <option>Aadhar Card</option>
                    <option>Intimation Form</option>
                    <option>Other Doc</option>
                  </select>

                  {/* Chevron icon */}
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="w-4 h-4 text-[#333333]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>

                <div className="">
                  <div className="overflow-auto text-center bg-[#EFEFEF] mb-8">
                    <div className='flex justify-center my-6'>
                      <Image
                        id="docImage"
                        src='/assets/docImg2.svg'
                        alt={activeTab}
                        width={500}
                        height={500}
                        style={{
                          transform: `scale(${zoom})`,
                          transition: "transform 0.3s ease",
                          paddingInline: 80,
                        }}
                      />
                    </div>
                    <div className="flex justify-center my-2 gap-2">
                      <button
                        onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                        aria-label="Zoom Out"
                        className="px-2 bg-white border border-[#DBDADE] py-1 rounded transition cursor-pointer"
                      >
                        <Image
                          src="/assets/zoomOutIcon.svg"
                          alt="Zoom Out"
                          width={24}
                          height={24}
                        />
                      </button>

                      <button
                        onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                        aria-label="Zoom In"
                        className="px-2 bg-white border border-[#DBDADE] py-1 rounded transition cursor-pointer"
                      >
                        <Image
                          src="/assets/zoominIcon.svg"
                          alt="Zoom In"
                          width={24}
                          height={24}
                        />
                      </button>

                      <button
                        onClick={handleFullscreen}
                        aria-label="Fullscreen"
                        className="px-2 bg-white border border-[#DBDADE] py-1 rounded transition cursor-pointer"
                      >
                        <Image
                          src="/assets/fullScreenZoomIcon.svg"
                          alt="Fullscreen"
                          width={24}
                          height={24}
                        />
                      </button>
                    </div>
                  </div>
                </div>


                <h2 className="text-[20px] px-4 font-bold text-[#484848] mb-4">Registration Details</h2>
                <div className="grid grid-cols-1 px-4  sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(claimDetails).map(([key, value]) => (
                    <div key={key} className='mb-2'>
                      <p className="text-[14px] text-[#858585] capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </p>
                      <p className='"text-[14px] text-[#484848] w-full rounded-md bg-gray-50"'>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        )}

      </div>
    </>
  );
};

export default ClaimsHandlerTabs;