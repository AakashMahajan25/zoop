import React from 'react';
import dayjs from 'dayjs';
import { Box, Button, Card, CardContent, Typography, IconButton } from '@mui/material';
import { PolicyDetails, InsurerInformation, WorkshopDetails, Allocation } from '@/types/intimationInterface';

interface ReviewSectionProps {
  step1Data: PolicyDetails;
  step2Data: InsurerInformation;
  step3Data: WorkshopDetails;
  step4Data: Allocation;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setShowReview: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm: () => void;
  sectionRefs: React.MutableRefObject<Array<React.MutableRefObject<null>>>;
  uploadedDocs?: {
    policyCopy: { file: File | null; url: string | null; documentId: string | null };
    intimationForm: { file: File | null; url: string | null; documentId: string | null };
    claimsForm: { file: File | null; url: string | null; documentId: string | null };
    vehicleRC: { file: File | null; url: string | null; documentId: string | null };
    drivingLicense: { file: File | null; url: string | null; documentId: string | null };
    insuranceCopy: { file: File | null; url: string | null; documentId: string | null };
    workshopEstimate: { file: File | null; url: string | null; documentId: string | null };
    repairPhotos: { file: File | null; url: string | null; documentId: string | null };
    inspectionReport: { file: File | null; url: string | null; documentId: string | null };
    allocationForm: { file: File | null; url: string | null; documentId: string | null };
    surveyorReport: { file: File | null; url: string | null; documentId: string | null };
    aadharCard: { file: File | null; url: string | null; documentId: string | null };
    panCard: { file: File | null; url: string | null; documentId: string | null };
    other: { file: File | null; url: string | null; documentId: string | null };
  };
}

const steps = ['Policy Details', 'Insurer Information', 'Workshop Details', 'Allocation'];

export default function ReviewSection({
  step1Data,
  step2Data,
  step3Data,
  step4Data,
  activeStep,
  setActiveStep,
  setShowReview,
  handleConfirm,
  sectionRefs,
  uploadedDocs,
}: ReviewSectionProps) {
  // Create refs for each section in the review page
  const reviewSectionRefs = React.useRef([
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
  ]);

  // Local state for tracking active section in review
  const [activeSidebarIndex, setActiveSidebarIndex] = React.useState<number>(0);

  // Effect to handle scroll-based section detection
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.overflow-auto');
      if (!scrollContainer) return;

      const scrollTop = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;
      
      // Find which section is most visible
      let activeIndex = 0;
      let maxVisibility = 0;

      reviewSectionRefs.current.forEach((ref, index) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          
          // Calculate intersection with scroll container
          const top = Math.max(rect.top - containerRect.top, 0);
          const bottom = Math.min(rect.bottom - containerRect.top, containerHeight);
          
          if (bottom > top) {
            const visibility = (bottom - top) / rect.height;
            if (visibility > maxVisibility) {
              maxVisibility = visibility;
              activeIndex = index;
            }
          }
        }
      });

      if (maxVisibility > 0.3) { // Only update if section is at least 30% visible
        setActiveSidebarIndex(activeIndex);
      }
    };

    const scrollContainer = document.querySelector('.overflow-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Initial call to set active section
      handleScroll();
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Function for sidebar clicks - scrolls to section within review page
  const onSidebarClick = (index: number) => {
    setActiveSidebarIndex(index);
    if (reviewSectionRefs.current[index]?.current) {
      reviewSectionRefs.current[index].current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Function for edit button clicks - navigates back to edit forms
  const onEditClick = (index: number, step: string) => {
    console.log("Edit clicked for index ", index);
    setActiveStep(index);
    setShowReview(false);
    if (sectionRefs.current[index]?.current) {
      (sectionRefs.current[index].current as any).scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDate = (date: any | null) => (date ? dayjs(date).format('DD/MM/YYYY') : 'Not provided');

  // Helper function to render document preview
  const renderDocumentPreview = (docKey: keyof NonNullable<typeof uploadedDocs>, label: string) => {
    if (!uploadedDocs || !uploadedDocs[docKey]?.url) {
      return (
        <div className='m-4'>
          <p className='text-[14px] font-medium text-[#858585]'>{label}</p>
          <div className='w-20 h-24 bg-gray-100 border border-gray-300 rounded flex items-center justify-center'>
            <span className='text-xs text-gray-500'>No file</span>
          </div>
        </div>
      );
    }

    const doc = uploadedDocs[docKey];
    const isImage = doc.file?.type?.startsWith('image/');
    const isPDF = doc.file?.type === 'application/pdf';

    return (
      <div className='m-4'>
        <p className='text-[14px] font-medium text-[#858585]'>{label}</p>
        <div className="w-20 h-24 border border-gray-300 rounded overflow-hidden flex items-center justify-center bg-white">
          <img
            src="/assets/insurance.jpg"
            alt="Uploaded Document"
            className="object-cover w-full h-full"
          />
        </div>
        <a 
          href={doc.url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className='text-xs text-blue-600 hover:underline block mt-1'
        >
          View
        </a>
      </div>
    );
  };

  return (
    <div className="px-6 font-geist flex gap-6 bg-[#FBFBFB]">
      <div className="w-1/5 border-none rounded-md">
        <div className="p-4">
          <h2 className="font-bold text-[20px] text-[#333333] py-2 border-b border-[#D4D4D8]">Review & Confirm</h2>
          <div className="flex flex-col gap-2">
            {steps.map((step, index) => (
              <button
                key={step}
                className={`w-full text-left p-3 rounded-md text-[16px] font-medium ${
                  activeSidebarIndex === index
                    ? 'bg-[#F0FDF4] text-[#333333] font-semibold border border-[#21FF91]'
                    : 'text-[#858585] hover:bg-[#EDF2F7]'
                }`}
                onClick={() => onSidebarClick(index)}
              >
                {step}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 h-[calc(100vh-6rem)] overflow-auto mb-24 p-2">
        <div className="flex flex-col gap-3">
          <div className="border border-[#F4F4F5] mt-2 bg-[#FFFFFF]" ref={reviewSectionRefs.current[0]}>
            <div className="flex justify-between items-center p-4">
              <h2 className="font-bold text-[20px] text-[#333333]">Claim Details</h2>
              <button
                className="text-[#09090B] text-[14px] font-medium flex items-center gap-1"
                onClick={() => onEditClick(0, 'Claim Details')}
              >
                Edit <img src="/assets/editIcon.svg" className="h-[20px]" alt="editIcon" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 border-b border-[#F4F4F5] mx-4">
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Insurer</h3>
                <p className="text-[#474747] text-[14px]">{step1Data.insurer || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Policy Number</h3>
                <p className="text-[#474747] text-[14px]">{step1Data.policyNo || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Policy Date</h3>
                <p className="text-[#474747] text-[14px]">{formatDate(step1Data.policyDate)}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Policy End Date</h3>
                <p className="text-[#474747] text-[14px]">{formatDate(step1Data.policyEndDate)}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Claims Number</h3>
                <p className="text-[#474747] text-[14px]">{step1Data.claimsNo || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Insurer Branch</h3>
                <p className="text-[#474747] text-[14px]">{step1Data.insurerBranch || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Place of Incident</h3>
                <p className="text-[#474747] text-[14px]">{step1Data.placeOfIncident || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Date of Incident</h3>
                <p className="text-[#474747] text-[14px]">{formatDate(step1Data.dateOfIncident)}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Police Report Filed</h3>
                <p className="text-[#474747] text-[14px]">{step1Data.policeReportFiled ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Panchan Carried Out</h3>
                <p className="text-[#474747] text-[14px]">{step1Data.panchanCarriedOut ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Police Station</h3>
                <p className="text-[#474747] text-[14px]">{step1Data.policeStationName || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Station Detail</h3>
                <p className="text-[#474747] text-[14px]">{step1Data.stationDetail || '-'}</p>
              </div>
            </div>
            <div className='flex'>
              {renderDocumentPreview('intimationForm', 'Intimation Form')}
              {renderDocumentPreview('claimsForm', 'Claim Form')}
              {renderDocumentPreview('policyCopy', 'Policy Copy')}
            </div>
          </div>

          <div className="border border-[#F4F4F5] mt-2 bg-[#FFFFFF]" ref={reviewSectionRefs.current[1]}>
            <div className="flex justify-between items-center p-4">
              <h2 className="font-bold text-[20px] text-[#333333]">Customer Details</h2>
              <button
                className="text-[#09090B] text-[14px] font-medium flex items-center gap-1"
                onClick={() => onEditClick(1, 'Customer Details')}
              >
                Edit <img src="/assets/editIcon.svg" className="h-[20px]" alt="editIcon" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 border-b border-[#F4F4F5] mx-4">
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Name</h3>
                <p className="text-[#474747] text-[14px]">{step2Data.insurerName || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Mobile Number</h3>
                <p className="text-[#474747] text-[14px]">{step2Data.mobileNo || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Email Address</h3>
                <p className="text-[#474747] text-[14px]">{step2Data.emailAddress || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Vehicle Number</h3>
                <p className="text-[#474747] text-[14px]">{step2Data.vehicleNo || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Driver Name</h3>
                <p className="text-[#474747] text-[14px]">{step2Data.driverName || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Alternate Number</h3>
                <p className="text-[#474747] text-[14px]">{step2Data.alternateNo || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Alternate Email</h3>
                <p className="text-[#474747] text-[14px]">{step2Data.alternateEmail || '-'}</p>
              </div>
            </div>
            <div className='flex'>
              {renderDocumentPreview('drivingLicense', 'Driving License')}
              {renderDocumentPreview('vehicleRC', 'Registration Certificate (RC)')}
              {renderDocumentPreview('aadharCard', 'Aadhaar Card')}
              {renderDocumentPreview('panCard', 'PAN Card')}
            </div>
          </div>

          <div className="border border-[#F4F4F5] mt-2 bg-[#FFFFFF]" ref={reviewSectionRefs.current[2]}>
            <div className="flex justify-between items-center p-4">
              <h2 className="font-bold text-[20px] text-[#333333]">Workshop Details</h2>
              <button
                className="text-[#09090B] text-[14px] font-medium flex items-center gap-1"
                onClick={() => onEditClick(2,'Workshop Details')}
              >
                Edit <img src="/assets/editIcon.svg" className="h-[20px]" alt="editIcon" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 border-b border-[#F4F4F5] mx-4">
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Workshop Name</h3>
                <p className="text-[#474747] text-[14px]">{step3Data.workshopName || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Mobile Number</h3>
                <p className="text-[#474747] text-[14px]">{step3Data.mobileNo || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Email Address</h3>
                <p className="text-[#474747] text-[14px]">{step3Data.emailAddress || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Estimated Cost</h3>
                <p className="text-[#474747] text-[14px]">{step3Data.estimatedCost ? `₹${step3Data.estimatedCost}` : '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Address Line 1</h3>
                <p className="text-[#474747] text-[14px]">{step3Data.addressLine1 || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Address Line 2</h3>
                <p className="text-[#474747] text-[14px]">{step3Data.addressLine2 || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">State</h3>
                <p className="text-[#474747] text-[14px]">{step3Data.state || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Pincode</h3>
                <p className="text-[#474747] text-[14px]">{step3Data.pincode || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Nature of Loss</h3>
                <p className="text-[#474747] text-[14px]">{step3Data.natureOfLoss || '-'}</p>
              </div>
            </div>
            <div className='flex'>
              {renderDocumentPreview('workshopEstimate', 'Workshop Estimate')}
              {renderDocumentPreview('other', 'Other Documents')}
            </div>
          </div>

          <div className="border border-[#F4F4F5] mt-2 bg-[#FFFFFF]" ref={reviewSectionRefs.current[3]}>
            <div className="flex justify-between items-center p-4">
              <h2 className="font-bold text-[20px] text-[#333333]">Handler Details</h2>
              <button
                className="text-[#09090B] text-[14px] font-medium flex items-center gap-1"
                onClick={() => onEditClick(3,'Handler Details')}
              >
                Edit <img src="/assets/editIcon.svg" className="h-[20px]" alt="editIcon" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 border-b border-[#F4F4F5] mx-4">
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Workshop Pincode</h3>
                <p className="text-[#474747] text-[14px]">{step4Data.workshopPincode || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">State</h3>
                <p className="text-[#474747] text-[14px]">{step4Data.state || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Division</h3>
                <p className="text-[#474747] text-[14px]">{step4Data.division || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Allocated To</h3>
                <p className="text-[#474747] text-[14px]">{step4Data.allocatedTo || '-'}</p>
              </div>
            </div>
          </div>

          <div className="border border-[#F4F4F5] mt-2 bg-[#FFFFFF]" ref={reviewSectionRefs.current[4]}>
            <div className="flex justify-between items-center p-4">
              <h2 className="font-bold text-[20px] text-[#333333]">Contact Details</h2>
              <button
                className="text-[#09090B] text-[14px] font-medium flex items-center gap-1"
                onClick={() => onEditClick(4, 'Contact Details')}
              >
                Edit <img src="/assets/editIcon.svg" className="h-[20px]" alt="editIcon" />
              </button>
            </div>
            <div className="flex justify-between items-center py-2"></div>
            <h2 className='font-bold text-[16px] text-[#333333] px-4'>Customer</h2>
            <div className="grid grid-cols-4 gap-4 mx-4">
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Mobile Number</h3>
                <p className="text-[#474747] text-[14px]">{step4Data.customerContactMobileNumber || step2Data.mobileNo || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">WhatsApp Number</h3>
                <p className="text-[#474747] text-[14px]">{step4Data.customerContactWhatsappNumber || step2Data.alternateNo || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Email Address</h3>
                <p className="text-[#474747] text-[14px]">{step4Data.customerContactEmailAddress || step2Data.emailAddress || '-'}</p>
              </div>
            </div>
            <h2 className='font-bold text-[16px] text-[#333333] p-4'>Garage</h2>
            <div className="grid grid-cols-4 gap-4 mx-4">
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Mobile Number</h3>
                <p className="text-[#474747] text-[14px]">{step4Data.workshopContactMobileNumber || step3Data.mobileNo || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">WhatsApp Number</h3>
                <p className="text-[#474747] text-[14px]">{step4Data.workshopContactWhatsappNumber || '-'}</p>
              </div>
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[#858585]">Email Address</h3>
                <p className="text-[#474747] text-[14px]">{step4Data.workshopContactEmailAddress || step3Data.emailAddress || '-'}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 py-4 mt-6 fixed bottom-0 right-8 shadow-[0_-4px_6px_0_rgba(0,0,0,0.04)] bg-white w-full">
            <button
              className="px-4 py-2 border border-[#D4D4D8] rounded-md text-[#09090B] text-[14px] font-medium"
              onClick={() => setShowReview(false)}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-[#09090B] text-white rounded-md text-[14px] font-medium"
              onClick={handleConfirm}
            >
              Confirm & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}