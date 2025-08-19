'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getClaimById, ClaimDetailsResponse } from '@/utils/getClaimById';
import dayjs from 'dayjs';

export default function ClaimDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [claimData, setClaimData] = useState<ClaimDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const claimId = params?.id as string;

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getClaimById(claimId);
        setClaimData(response);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch claim details');
      } finally {
        setIsLoading(false);
      }
    };

    if (claimId) {
      fetchClaimDetails();
    }
  }, [claimId]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      return dayjs(dateString).format('DD/MM/YYYY');
    } catch {
      return dateString;
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Local state for tracking active section in sidebar
  const [activeSidebarIndex, setActiveSidebarIndex] = React.useState<number>(0);

  // Create refs for each section
  const sectionRefs = React.useRef([
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
  ]);

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

      sectionRefs.current.forEach((ref, index) => {
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

  // Function for sidebar clicks - scrolls to section
  const onSidebarClick = (index: number) => {
    setActiveSidebarIndex(index);
    if (sectionRefs.current[index]?.current) {
      sectionRefs.current[index].current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Helper function to render document preview
  const renderDocumentPreview = (docKey: string, label: string) => {
    return (
      <div className='m-4'>
        <p className='text-[14px] font-medium text-[#858585]'>{label}</p>
        <div className='w-20 h-24 bg-gray-100 border border-gray-300 rounded flex items-center justify-center'>
          <span className='text-xs text-gray-500'>No file</span>
        </div>
      </div>
    );
  };

  const steps = ['Claim Details', 'Customer Details', 'Workshop Details', 'Handler Details', 'Contact Details'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading claim details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!claimData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Claim not found</p>
          <button
            onClick={handleBack}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <img src="/assets/leftArrow.svg" alt="Back" className="w-5 h-5 rotate-180" />
              Back
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-900">Claim Details</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Reference ID: {claimData.reference_id}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 font-geist flex gap-6 bg-[#FBFBFB]">
        {/* Sidebar */}
        <div className="w-1/5 border-none rounded-md">
          <div className="p-4">
            <h2 className="font-bold text-[20px] text-[#333333] py-2 border-b border-[#D4D4D8]">Claim Details</h2>
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

        {/* Main Content */}
        <div className="flex-1 h-[calc(100vh-6rem)] overflow-auto mb-24 p-2">
          <div className="flex flex-col gap-3">
            
            {/* Claim Details Section */}
            {claimData.policyDetails && (
              <div className="border border-[#F4F4F5] mt-2 bg-[#FFFFFF]" ref={sectionRefs.current[0]}>
                <div className="flex justify-between items-center p-4">
                  <h2 className="font-bold text-[20px] text-[#333333]">Claim Details</h2>
                </div>
                <div className="grid grid-cols-4 gap-4 border-b border-[#F4F4F5] mx-4">
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Insurer</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.policyDetails.insurer || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Policy Number</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.policyDetails.policyNo || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Policy Date</h3>
                    <p className="text-[#474747] text-[14px]">{formatDate(claimData.policyDetails.policyDate)}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Policy End Date</h3>
                    <p className="text-[#474747] text-[14px]">{formatDate(claimData.policyDetails.policyEndDate)}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Claims Number</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.policyDetails.claimsNo || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Insurer Branch</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.policyDetails.insurerBranch || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Place of Incident</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.policyDetails.placeOfIncident || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Date of Incident</h3>
                    <p className="text-[#474747] text-[14px]">{formatDate(claimData.policyDetails.dateOfIncident)}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Police Report Filed</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.policyDetails.policeReportFiled ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Panchan Carried Out</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.policyDetails.panchanCarriedOut ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Police Station</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.policyDetails.policeStationName || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Station Detail</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.policyDetails.stationDetail || '-'}</p>
                  </div>
                </div>
                <div className='flex'>
                  {renderDocumentPreview('intimationForm', 'Intimation Form')}
                  {renderDocumentPreview('claimsForm', 'Claim Form')}
                  {renderDocumentPreview('policyCopy', 'Policy Copy')}
                </div>
              </div>
            )}

            {/* Customer Details Section */}
            {claimData.insurerInformation && (
              <div className="border border-[#F4F4F5] mt-2 bg-[#FFFFFF]" ref={sectionRefs.current[1]}>
                <div className="flex justify-between items-center p-4">
                  <h2 className="font-bold text-[20px] text-[#333333]">Customer Details</h2>
                </div>
                <div className="grid grid-cols-4 gap-4 border-b border-[#F4F4F5] mx-4">
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Name</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.insurerInformation.insurerName || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Mobile Number</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.insurerInformation.mobileNo || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Email Address</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.insurerInformation.emailAddress || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Vehicle Number</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.insurerInformation.vehicleNo || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Driver Name</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.insurerInformation.driverName || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Alternate Number</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.insurerInformation.alternateNo || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Alternate Email</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.insurerInformation.alternateEmail || '-'}</p>
                  </div>
                </div>
                <div className='flex'>
                  {renderDocumentPreview('drivingLicense', 'Driving License')}
                  {renderDocumentPreview('vehicleRC', 'Registration Certificate (RC)')}
                  {renderDocumentPreview('aadharCard', 'Aadhaar Card')}
                  {renderDocumentPreview('panCard', 'PAN Card')}
                </div>
              </div>
            )}

            {/* Workshop Details Section */}
            {claimData.workshopDetails && (
              <div className="border border-[#F4F4F5] mt-2 bg-[#FFFFFF]" ref={sectionRefs.current[2]}>
                <div className="flex justify-between items-center p-4">
                  <h2 className="font-bold text-[20px] text-[#333333]">Workshop Details</h2>
                </div>
                <div className="grid grid-cols-4 gap-4 border-b border-[#F4F4F5] mx-4">
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Workshop Name</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.workshopDetails.workshopName || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Mobile Number</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.workshopDetails.mobileNo || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Email Address</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.workshopDetails.emailAddress || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Estimated Cost</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.workshopDetails.estimatedCost ? `₹${claimData.workshopDetails.estimatedCost.toLocaleString()}` : '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Address Line 1</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.workshopDetails.addressLine1 || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Address Line 2</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.workshopDetails.addressLine2 || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">State</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.workshopDetails.state || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Pincode</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.workshopDetails.pincode || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Nature of Loss</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.workshopDetails.natureOfLoss || '-'}</p>
                  </div>
                </div>
                <div className='flex'>
                  {renderDocumentPreview('workshopEstimate', 'Workshop Estimate')}
                  {renderDocumentPreview('other', 'Other Documents')}
                </div>
              </div>
            )}

            {/* Handler Details Section */}
            {claimData.allocation && (
              <div className="border border-[#F4F4F5] mt-2 bg-[#FFFFFF]" ref={sectionRefs.current[3]}>
                <div className="flex justify-between items-center p-4">
                  <h2 className="font-bold text-[20px] text-[#333333]">Handler Details</h2>
                </div>
                <div className="grid grid-cols-4 gap-4 border-b border-[#F4F4F5] mx-4">
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Workshop Pincode</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.allocation.workshopPincode || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">State</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.allocation.state || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Division</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.allocation.division || '-'}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="text-[14px] font-medium text-[#858585]">Allocated To</h3>
                    <p className="text-[#474747] text-[14px]">{claimData.allocation.allocatedTo || '-'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Details Section */}
            <div className="border border-[#F4F4F5] mt-2 bg-[#FFFFFF]" ref={sectionRefs.current[4]}>
              <div className="flex justify-between items-center p-4">
                <h2 className="font-bold text-[20px] text-[#333333]">Contact Details</h2>
              </div>
              <div className="flex justify-between items-center py-2"></div>
              <h2 className='font-bold text-[16px] text-[#333333] px-4'>Customer</h2>
              <div className="grid grid-cols-4 gap-4 mx-4">
                <div className="p-2">
                  <h3 className="text-[14px] font-medium text-[#858585]">Mobile Number</h3>
                  <p className="text-[#474747] text-[14px]">{claimData.allocation?.customerContactMobileNumber || claimData.insurerInformation?.mobileNo || '-'}</p>
                </div>
                <div className="p-2">
                  <h3 className="text-[14px] font-medium text-[#858585]">WhatsApp Number</h3>
                  <p className="text-[#474747] text-[14px]">{claimData.allocation?.customerContactWhatsappNumber || claimData.insurerInformation?.alternateNo || '-'}</p>
                </div>
                <div className="p-2">
                  <h3 className="text-[14px] font-medium text-[#858585]">Email Address</h3>
                  <p className="text-[#474747] text-[14px]">{claimData.allocation?.customerContactEmailAddress || claimData.insurerInformation?.emailAddress || '-'}</p>
                </div>
              </div>
              <h2 className='font-bold text-[16px] text-[#333333] p-4'>Garage</h2>
              <div className="grid grid-cols-4 gap-4 mx-4">
                <div className="p-2">
                  <h3 className="text-[14px] font-medium text-[#858585]">Mobile Number</h3>
                  <p className="text-[#474747] text-[14px]">{claimData.allocation?.workshopContactMobileNumber || claimData.workshopDetails?.mobileNo || '-'}</p>
                </div>
                <div className="p-2">
                  <h3 className="text-[14px] font-medium text-[#858585]">WhatsApp Number</h3>
                  <p className="text-[#474747] text-[14px]">{claimData.allocation?.workshopContactWhatsappNumber || '-'}</p>
                </div>
                <div className="p-2">
                  <h3 className="text-[14px] font-medium text-[#858585]">Email Address</h3>
                  <p className="text-[#474747] text-[14px]">{claimData.workshopDetails?.emailAddress || '-'}</p>
                </div>
              </div>
            </div>

            {/* Status and Timestamps */}
            <div className="border border-[#F4F4F5] mt-2 bg-[#FFFFFF]">
              <div className="p-6 border-b border-[#F4F4F5]">
                <h2 className="font-bold text-[20px] text-[#333333]">Status Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                <div className="p-3">
                  <h3 className="text-[14px] font-medium text-[#858585]">Status</h3>
                  <p className="text-[#474747] text-[14px] capitalize">{claimData.status || '-'}</p>
                </div>
                <div className="p-3">
                  <h3 className="text-[14px] font-medium text-[#858585]">Created At</h3>
                  <p className="text-[#474747] text-[14px]">{formatDate(claimData.created_at)}</p>
                </div>
                <div className="p-3">
                  <h3 className="text-[14px] font-medium text-[#858585]">Last Updated</h3>
                  <p className="text-[#474747] text-[14px]">{formatDate(claimData.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
