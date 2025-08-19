'use client'
import React, { useState } from "react";
import { Alert } from "@mui/material";
import ClaimsHandlerDetails from "./ClaimsHandlerDetails";
import ClaimsHandlerTabs from "./claimsHandler/ClaimsHandlerTabs";
import DischargeCopyPreview from "./claimsHandler/DischargeCopyPreview";
import VerticalStepper from "./auditorSection/VerticleStepper";
import CompletedVerticalStepper from "./auditorSection/CompletedVerticalStepper";

type DocumentTab = "Aadhaar" | "PAN" | "Driving License" | "RC Book" | "Insurance" | "Pollution" | "Other";
type ViewMode = "timeline" | "documents" | "claims" | "dischargeCopyPreview";

interface RowData {
  id: number;
  name: string;
  quantity: number;
  insuranceProvider: string;
  claimHandler: string;
  status: string;
  amountApproved: number;
  fraudFlag: boolean;
}

interface StepData {
  id: number;
  title: string;
  date?: string;
  author?: string;
  documents?: string[];                 // optional list of document filenames
  showActions?: boolean;
  status: "completed" | "pending";
  hasDocuments: boolean;
  hasClaimsDetails: boolean;
  hasDischargeCopyPreview?: boolean;
  tags?: string[];
}

interface ClaimsDetailsProps {
  selectedRow: RowData | null;
  onClose: () => void;
}

const ClaimsDetails: React.FC<ClaimsDetailsProps> = ({ selectedRow, onClose }) => {
  const selectedRole = "customer";
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [activeTab, setActiveTab] = useState<DocumentTab>("Aadhaar");
  const [zoom, setZoom] = useState<number>(1);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const tabs: DocumentTab[] = ["Aadhaar", "PAN", "Driving License", "RC Book", "Insurance", "Pollution", "Other"];
  const intimation: string[] = [
    "Policy_Document.pdf",
    "Registration_Certificate.pdf",
    "Policy_Document.pdf",
    "Registration_Certificate.pdf",
    "Policy_Document.pdf",
    "Registration_Certificate.pdf",
    "Policy_Document.pdf",
    "Registration_Certificate.pdf",
    "Registration_Certificate.pdf",
    "Policy_Document.pdf",
  ];
  console.log(selectedRow, "kjhgv")

  const STATUS_LABELS: Record<string, string> = {
    'estimateapproved': 'Estimate Approved',
    'assessmentPending': 'Assessment Pending',
    'draft': 'Draft',
    'repaircompleted': 'Repair Completed',
    'finalReportSent': 'Final Report Sent',
    'dischargedapproved': 'Discharged Approved',
    'reAllocate': 'Re-allocate',
    'assessmentactive': 'Assessment Active',
    'completed': 'Completed'
  };

  const images: Record<DocumentTab, string> = {
    "Aadhaar": "/assets/docImg2.svg",
    "PAN": "/assets/aadhaar.jpg",
    "Driving License": "/assets/aadhaar.jpg",
    "RC Book": "/assets/car.jpg",
    "Insurance": "/assets/car.jpg",
    "Pollution": "/assets/car.jpg",
    "Other": "/assets/car.jpg",
  };
 
  const handleFullscreen = () => {
    const img = document.getElementById("docImage");
    if (img && img.requestFullscreen) {
      img.requestFullscreen();
    }
  };

  const handleExportReport = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const renderDocumentsView = () => (
    <div className="p-6">
      <div>
        <button
          onClick={() => setViewMode("timeline")}
          className="bg-[#000000] text-white px-2 rounded mb-4 cursor-pointer"
        >
          Back
        </button>

        <div className="flex gap-6">
          <div className="w-2/4 p-2 space-y-2">
            <h1 className="text-lg text-[18px] text-[#4B465C]">Documents</h1>

            <div className="border border-[#EFEFEF] rounded overflow-hidden">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-8 py-4 cursor-pointer 
                    ${activeTab === tab ? "bg-[#93FFCA1A] text-black" : ""}
                    ${index !== tabs.length - 1 ? "border-b border-[#EFEFEF]" : ""}
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="w-3/4 border border-[#EFEFEF] rounded">
            <div className="text-center h-[300px] flex items-center justify-center  mt-12">
              <img
                id="docImage"
                src={images[activeTab]}
                alt={activeTab}
                style={{ transform: `scale(${zoom})`, transition: "transform 0.3s ease" }}
                className="max-h-full h-full object-contain"
              />
            </div>

            <div className="flex justify-center gap-2 my-6">
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                className="px-3 py-1 rounded cursor-pointer"
              >
                <img src="/assets/zoomOutIcon.svg" alt="zoomOutIcon" width={24} height={24} />
              </button>
              <button
                onClick={() => setZoom((z) => z + 0.1)}
                className="px-3 py-1 rounded cursor-pointer"
              >
                <img src="/assets/zoominIcon.svg" alt="zoominIcon" width={24} height={24} />
              </button>
              <button
                onClick={handleFullscreen}
                className="px-3 py-1 rounded cursor-pointer"
              >
                <img src="/assets/fullScreenZoomIcon.svg" alt="fullScreenZoomIcon" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDischargeCopyPreview = () => (
    <div className="p-6">
      <button
        onClick={() => setViewMode("timeline")}
        className="bg-[#000000] text-white px-2 rounded mb-4 cursor-pointer"
      >
        Back
      </button>
      <DischargeCopyPreview />
    </div>
  );

  const renderClaimsDetailsView = () => (
    <div className="p-6">
      <button
        onClick={() => setViewMode("timeline")}
        className="bg-[#000000] text-white px-2 rounded mb-4 cursor-pointer"
      >
        Back
      </button>

      <ClaimsHandlerTabs
        activeStepId={activeStepId}
        documents={[]} // TODO: Replace with actual document data
        selectedDocs={[]} // TODO: Add selected documents state
        handleCheckboxChange={() => { }} // Dummy
        setIsSendReminderModalOpen={() => { }} // Dummy
        setIsViewDetailsModalOpen={() => { }} // Dummy
        setIsRequestDocumentModalOpen={() => { }} // Dummy
        setIsUploadDocumentModalOpen={() => { }} // Dummy
        toggleActionDropdown={() => { }} // Dummy
        activeActionDropdown={null} // Dummy
      />
    </div>
  );


  // const renderStep = (step: StepData, index: number) => (
  //   <div key={step.id} className="flex gap-4 relative min-h-[120px]">
  //     <div className="flex flex-col items-center">
  //       <div className={`border-2 text-center py-2 rounded-full w-10 h-10 flex items-center justify-center font-semibold z-10 bg-white
  //         ${step.status === "completed" ? "border-[#21FF91] text-[#21FF91]" : ""}
  //         ${step.status === "pending" ? "border-gray-400 text-gray-400" : ""}
  //       `}>
  //         {String(step.id).padStart(2, '0')}
  //       </div>
  //       {index < steps.length - 1 && (
  //         <div className={`w-[2px] flex-1 
  //           ${step.status === "completed" ? "bg-[#21FF91]" : ""}
  //           ${step.status === "pending" ? "bg-gray-400" : ""}
  //         `} />
  //       )}
  //     </div>

  //     <div className="flex-1 pt-1 pb-6">
  //       <div >
  //         <div>
  //           <div className="flex justify-between items-start">
  //             <div>
  //               <p className="text-[18px] text-[#4B465C]">{step.title}</p>
  //               {step.date && (
  //                 <p className="text-[#4B465C] text-[14px]">
  //                   {step.date} {step.author && `by ${step.author}`}
  //                 </p>
  //               )}
  //             </div>

  //             {(step.hasDocuments || step.hasClaimsDetails || step.hasDischargeCopyPreview) && (
  //               <div className="flex gap-x-3">
  //                 {step.hasDocuments && (
  //                   <button
  //                     className="border border-black px-2 py-1 rounded"
  //                     onClick={() => {
  //                       setActiveStepId(step.id);
  //                       setViewMode("documents");
  //                     }}
  //                   >
  //                     View Documents
  //                   </button>
  //                 )}
  //                 {step.hasClaimsDetails && (
  //                   <button
  //                     className="border border-black px-2 py-1 rounded"
  //                     onClick={() => {
  //                       setActiveStepId(step.id);
  //                       setViewMode("claims");
  //                     }}
  //                   >
  //                     View Claims Details
  //                   </button>
  //                 )}
  //                 {step.hasDischargeCopyPreview && (
  //                   <button
  //                     className="border border-black px-2 py-1 rounded"
  //                     onClick={() => {
  //                       setActiveStepId(step.id);
  //                       setViewMode("dischargeCopyPreview");
  //                     }}
  //                   >
  //                     View Discharge Copy Details
  //                   </button>
  //                 )}
  //               </div>
  //             )}
  //           </div>
  //           {renderStatusText(step.status === "completed" ? "" : step.status)}
  //           {step.tags && (
  //             <div className="flex gap-2 mt-2 flex-wrap">
  //               {step.tags.map((tag, index) => (
  //                 <a
  //                   key={index}
  //                   href={`/docs/${tag}`}
  //                   download={tag}
  //                   className="bg-[#0AA7DC0A] border border-[#0AA7DC] text-[#0AA7DC] px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:underline hover:cursor-pointer"
  //                 >
  //                   <img src="/assets/pdfIcon.svg" alt="pdfIcon" className="w-4" />
  //                   {tag}
  //                 </a>
  //               ))}
  //             </div>
  //           )}

  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  const statusColorMap = {
    estimateapproved: '#FF9F43',
    assessmentPending: '#AE00ABEA',
    draft: '#FF9F43',
    completed: '#28C76F',
    repaircompleted: '#3B03FF',
    finalReportSent: '#2D9095',
    dischargedapproved: '#1C0B58',
    reAllocate: '#3B03FF',
    assessmentactive: '#28C76F',
  };

  const formatStatus = (status: string | undefined) => {
    if (!status) return '';

    // Insert space before each uppercase or when a new word is likely starting
    const spaced = status
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
      .replace(/([a-z]+)([A-Z][a-z]+)/g, '$1 $2') // PascalCase
      .replace(/([a-z])([a-z][A-Z])/g, '$1 $2'); // mixed

    // Now split into words every time a non-space sequence is found
    return spaced
      .match(/[A-Za-z][a-z]*/g)?.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') || '';
  };

  // const steps: StepItem[] = [
  //   { id: 1, title: 'Intimation & Assignation', date: '20 May, 2025 | 10:00 AM', author: 'Vikram Patel', documents: ['Policy_Document.pdf', 'Registration_Certificate.pdf'], showActions: true },
  //   { id: 2, title: 'Photo/Video Uploads', date: '19 May, 2025 | 10:10 AM', author: 'Vikram Patel', documents: ['Policy_Document.pdf'], showActions: true },
  //   { id: 3, title: 'Assessment', date: '18 May, 2025 | 10:20 AM', author: 'Vikram Patel', status: 'pending' },
  //   // ... more steps
  // ];

  const steps: StepData[] = [
    {
      id: 1,
      title: "Intimation & Assignation",
      date: "20 May, 2025 | 10:00:00 AM",
      author: "Vikram Patel",
      documents: ['Policy_Document.pdf', 'Registration_Certificate.pdf', 'Registration_Certificate.pdf', 'Registration_Certificate.pdf',
        'Registration_Certificate.pdf', 'Registration_Certificate.pdf', 'Registration_Certificate.pdf', 'Registration_Certificate.pdf', 'Policy_Document.pdf',
        'Registration_Certificate.pdf', 'Registration_Certificate.pdf', 'Registration_Certificate.pdf', 'Registration_Certificate.pdf'],
      status: "completed" as const,
      hasDocuments: true,
      hasClaimsDetails: true,
      tags: intimation,
      showActions: true
    },
    {
      id: 2,
      title: "Photo/Video Uploads",
      date: "21 May, 2025 | 11:30:00 AM",
      author: "Rahul Sharma",
      documents: ['Policy_Document.pdf', 'Registration_Certificate.pdf', 'Registration_Certificate.pdf', 'Registration_Certificate.pdf',
        'Registration_Certificate.pdf', 'Registration_Certificate.pdf', 'Registration_Certificate.pdf', 'Registration_Certificate.pdf', 'Policy_Document.pdf',
        'Registration_Certificate.pdf', 'Registration_Certificate.pdf', 'Registration_Certificate.pdf', 'Registration_Certificate.pdf'],
      showActions: true,
      status: "completed" as const,
      hasDocuments: true,
      hasClaimsDetails: true,
      tags: intimation,
    },
    {
      id: 3,
      title: "Assessment",
      date: "21 May, 2025 | 11:30:00 AM",
      status: "pending" as const,
      hasDocuments: false,
      hasClaimsDetails: true,
    },
    {
      id: 4,
      title: "Repair Authorization",
      date: "21 May, 2025 | 11:30:00 AM",
      status: "pending" as const,
      hasDocuments: false,
      hasClaimsDetails: false,
    },
    {
      id: 5,
      title: "Discharge Copy & Settlement",
      date: "21 May, 2025 | 11:30:00 AM",
      status: "pending" as const,
      hasDocuments: false,
      hasClaimsDetails: false,
      hasDischargeCopyPreview: true,
    },
    {
      id: 6,
      title: "Final Report Submission",
      date: "21 May, 2025 | 11:30:00 AM",
      status: "pending" as const,
      hasDocuments: false,
      hasClaimsDetails: false,
    },
    {
      id: 7,
      title: "Insurer Approval",
      date: "21 May, 2025 | 11:30:00 AM",
      status: "pending" as const,
      hasDocuments: false,
      hasClaimsDetails: false,
    },
    ...(selectedRole === "customer"
      ? [
        {
          id: 8,
          title: "Completed",
          status: "pending" as const,
          hasDocuments: false,
          hasClaimsDetails: false,
        },
      ]
      : []),
  ];

  const completedSteps = [
  {
    id: 'intimationAssignation',
    title: 'Intimation & Assignation',
    date: '20 May, 2025 | 10:00:00 AM',
    author: 'Vikram Patel',
    documents: intimation,
    hasDocuments: true,
    hasClaimsDetails: true,
    hasDischargeCopyPreview: false,
  },
  {
    id: 'photoVideo',
    title: 'Photo/Video Uploads',
    date: '21 May, 2025 | 11:30:00 AM',
    author: 'Rahul Sharma',
    documents: intimation,
    hasDocuments: false,
    hasClaimsDetails: true,
  },
     {
      id: 'assesment',
      title: "Assessment",
      date: "21 May, 2025 | 11:30:00 AM",
      status: "completed" as const,
      hasDocuments: false,
      hasClaimsDetails: false,
    },
    {
      id: 'repair',
      title: "Repair Authorization",
      date: "21 May, 2025 | 11:30:00 AM",
            documents: ['Policy_Document.pdf', 'Registration_Certificate.pdf'],
      status: "completed" as const,
      hasDocuments: true,
      hasClaimsDetails: false,
    },
    {
      id: 'discharge',
      title: "Discharge Copy & Settlement",
      date: "21 May, 2025 | 11:30:00 AM",
            documents: ['Workshop Estimate', 'Total Bill'],
      status: "completed" as const,
      hasDocuments: false,
      hasClaimsDetails: false,
      hasDischargeCopyPreview: true,
    },
    {
      id: 'finalReport',
      title: "Final Report Submission",
      date: "21 May, 2025 | 11:30:00 AM",
      status: "completed" as const,
      hasDocuments: false,
      hasClaimsDetails: false,
    },
    {
      id: 'insurerApproval',
      title: "Insurer Approval",
      date: "21 May, 2025 | 11:30:00 AM",
      status: "completed" as const,
      hasDocuments: false,
      hasClaimsDetails: false,
    },
    ...(selectedRole === "customer"
      ? [
        {
          id: 'completed',
          title: "Completed",
          status: "completed" as const,
          hasDocuments: false,
          hasClaimsDetails: false,
        },
      ]
      : []),
  ];

  function handleViewDocuments(id: string) {
    if(id === 'repair'){
     setActiveStepId(id); 
     setViewMode("claims");
    }else{
      setActiveStepId(id); 
     setViewMode("documents");
    }
  }

  // <VerticalStepper steps={steps} currentStep={2} />

  return (
    <div className="">
      {showAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert severity="info" onClose={() => setShowAlert(false)}>
            Export Details clicked
          </Alert>
        </div>
      )}
      
      <div className="">
        <div className="flex justify-between items-center p-6">
          <nav className="text-[15px] text-[#999999] font-geist">
            <span
              onClick={onClose}
              className="cursor-pointer hover:underline"
            >
              Top‑Line Metrics
            </span>
            <span className="mx-2 text-[#858585]">/</span>
            <span className="text-[#333333] font-medium">
              Claim Details
            </span>
          </nav>

          <button
            className="bg-[#000000] text-[#FFFFFF] px-3 py-2 rounded font-geist cursor-pointer"
            onClick={handleExportReport}
          >
            Export Report
          </button>
        </div>

        <h1 className="text-[24px] font-medium text-[#5C5C5C] px-6 ">Claim Information</h1>

        <div className="p-6">
          <div className="mb-1 text-[20px] font-medium text-[#474747]">
            Claim #INS-2025-001
          </div>
          <p className="text-gray-700">
            MH 01 AB 1234 - Private Car
          </p>
        </div>

        <div className="grid grid-cols-5 gap-4 border-b border-[#EFEFEFE5] px-6 pb-6">
          <div className="">
            <h2 className="mb-1 text-[#858585]">Reference Number</h2>
            <p className="text-[#474747]">INS-2025-001</p>
          </div>
          <div className="">
            <h2 className="mb-1 text-[#858585]">Created Date</h2>
            <p className="text-[#474747]">21 May, 2025</p>
          </div>
          <div className="">
            <h2 className="mb-1 text-[#858585] text-sm">Status</h2>
            <p
              className="font-medium"
              style={{
                //@ts-ignore
                color: statusColorMap[selectedRow?.status] || '#474747',
              }}
            >
              {selectedRow?.status && STATUS_LABELS[selectedRow?.status]}
            </p>
          </div>
          <div className="">
            <h2 className="mb-1 text-[#858585]">Amount Approved</h2>
            <p className="text-[#474747]">27 03 2023</p>
          </div>
          <div className="">
            <h2 className="mb-1 text-[#858585]">Fraud Flag</h2>
            <p className="text-[#474747]">Mumbai Central</p>
          </div>
          <div className="">
            <h2 className="mb-1 text-[#858585]">Insurance Provider</h2>
            <p className="text-[#474747]">900000</p>
          </div>
          <div className="">
            <h2 className="mb-1 text-[#858585]">Policy Number</h2>
            <p className="text-[#474747]">Mumbai West</p>
          </div>
          <div className="">
            <h2 className="mb-1 text-[#858585]">Claim Handler</h2>
            <p className="text-[#474747]">Comprehensive Auto Insurance</p>
          </div>
          <div className="">
            <h2 className="mb-1 text-[#858585]">Customer Name</h2>
            <p className="text-[#474747]">9000000</p>
          </div>
        </div>
      </div>

      {viewMode === "timeline" && (
        <div className="mb-10 p-6">
          {selectedRow?.status !== 'completed' ? (<VerticalStepper
            steps={steps}
            currentStep={2}
            onViewDocuments={(id) => {  setViewMode("documents"); }}
            onViewClaims={(id) => {  setViewMode("claims"); }}
            onViewDischargeCopy={(id) => {   
              setViewMode("dischargeCopyPreview");
            }}
          />) : (
            <CompletedVerticalStepper
            steps={completedSteps}
            onViewDocuments={(id) => {handleViewDocuments(id) }}
            onViewClaims={(id) => { setActiveStepId(id); setViewMode("claims"); }}
            onViewDischargeCopy={(id) => {
              setActiveStepId(id);
              setViewMode("dischargeCopyPreview");
            }}
             />
          )}
        </div>
      )}

      {viewMode === "documents" && renderDocumentsView()}
      {viewMode === "claims" && renderClaimsDetailsView()}
      {viewMode === "dischargeCopyPreview" && renderDischargeCopyPreview()}
    </div>
  );
}

export default ClaimsDetails;