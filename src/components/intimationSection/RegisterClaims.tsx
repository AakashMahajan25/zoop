'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, IconButton } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import { CustomConnector, CustomStepIcon } from '../CustomStepIcon';
import Step1 from '@/components/intimationSection/ClaimDetailsStep1';
import Step2 from '@/components/intimationSection/CustomerDetailsStep2';
import Step3 from '@/components/intimationSection/WorkshopDetailsStep3';
import Step4 from '@/components/intimationSection/HandlerDetailsStep4';
import ReviewSection from '@/components/intimationSection/ReviewSection';
import CloseIcon from '@mui/icons-material/Close';
import { submitIntimation, saveDraft } from '@/utils/intimation';
import { useIntimationForm } from '@/app/context/IntimationFormContext';
import { uploadDocument, DOCUMENT_TYPE_IDS } from '@/utils/upload';
import { Allocation } from '@/types/intimationInterface';

// Interface for child components (backward compatibility)
interface UploadedDocumentsForChild {
  policyCopy: File | null;
  intimationForm: File | null;
  claimsForm: File | null;
  vehicleRC: File | null;
  drivingLicense: File | null;
  insuranceCopy: File | null;
  workshopEstimate: File | null;
  repairPhotos: File | null;
  inspectionReport: File | null;
  allocationForm: File | null;
  surveyorReport: File | null;
  aadharCard: File | null;
  panCard: File | null;
  other: File | null;
}

// Interface for internal state (with URLs and document IDs)
interface UploadedDocuments {
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
}

// Extended errors interface to include step4
interface ExtendedFormErrors {
  step1: Partial<Record<string, string>>;
  step2: Partial<Record<string, string>>;
  step3: Partial<Record<string, string>>;
  step4: Partial<Record<string, string>>;
}

// Helper functions
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateMobile = (mobile: string) => /^[0-9]{10}$/.test(mobile);
const validatePincode = (pincode: string) => /^[0-9]{6}$/.test(pincode);

export default function RegisterClaims() {
  const {
    state: { policyDetails, insurerInformation, workshopDetails, allocation, currentStep, errors, isLoading, isDraftSaved, draftId, referenceId },
    setPolicyDetails,
    setInsurerInformation,
    setWorkshopDetails,
    setAllocation,
    setCurrentStep,
    setDraftId,
    setReferenceId,
    setIsDraftSaved,
    setLoading,
    setErrors,
    clearErrors,
    resetForm,
    hasUnsavedChanges
  } = useIntimationForm();
  // const searchParams = useSearchParams();
  // const claimId = searchParams.get("claimId");
  const [completedSteps, setCompletedSteps] = React.useState<{ [key: number]: boolean }>({});
  const [showReview, setShowReview] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showUnsaved, setShowUnsaved] = React.useState(false);
  const [showSavedDraft, setShowSavedDraft] = React.useState(false);
  const [docErrors, setDocErrors] = React.useState<Partial<Record<keyof UploadedDocuments, string>>>({});
  const [docErrors2, setDocErrors2] = React.useState<Partial<Record<keyof UploadedDocuments, string>>>({});
  const [docErrors3, setDocErrors3] = React.useState<Partial<Record<keyof UploadedDocuments, string>>>({});
  const [countdown, setCountdown] = React.useState(5);
  const countdownStartedRef = React.useRef(false);

  const steps = ['Policy Details', 'Insurer Information', 'Workshop Details', 'Allocation'];
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  // Remove the local step4Data state since we'll use the context's allocation state directly
  // const [step4Data, setStep4Data] = React.useState<Allocation>({...});

  const [uploadedDocs, setUploadedDocs] = React.useState<UploadedDocuments>({
    policyCopy: { file: null, url: null, documentId: null },
    intimationForm: { file: null, url: null, documentId: null },
    claimsForm: { file: null, url: null, documentId: null },
    vehicleRC: { file: null, url: null, documentId: null },
    drivingLicense: { file: null, url: null, documentId: null },
    insuranceCopy: { file: null, url: null, documentId: null },
    workshopEstimate: { file: null, url: null, documentId: null },
    repairPhotos: { file: null, url: null, documentId: null },
    inspectionReport: { file: null, url: null, documentId: null },
    allocationForm: { file: null, url: null, documentId: null },
    surveyorReport: { file: null, url: null, documentId: null },
    aadharCard: { file: null, url: null, documentId: null },
    panCard: { file: null, url: null, documentId: null },
    other: { file: null, url: null, documentId: null },
  });

  // Initialize refs for sections
  const sectionRefs = useRef([
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]);

  // Helper function to convert UploadedDocuments to UploadedDocumentsForChild
  const convertToChildFormat = (docs: UploadedDocuments): UploadedDocumentsForChild => ({
    policyCopy: docs.policyCopy.file,
    intimationForm: docs.intimationForm.file,
    claimsForm: docs.claimsForm.file,
    vehicleRC: docs.vehicleRC.file,
    drivingLicense: docs.drivingLicense.file,
    insuranceCopy: docs.insuranceCopy.file,
    workshopEstimate: docs.workshopEstimate.file,
    repairPhotos: docs.repairPhotos.file,
    inspectionReport: docs.inspectionReport.file,
    allocationForm: docs.allocationForm.file,
    surveyorReport: docs.surveyorReport.file,
    aadharCard: docs.aadharCard.file,
    panCard: docs.panCard.file,
    other: docs.other.file,
  });

  // Helper function to map uploaded documents to draft request format
  const mapDocumentsToDraftRequest = () => {
    const draftRequest: any = {};

    // Include reference_id if available (from second draft onwards)
    if (referenceId) {
      draftRequest.reference_id = referenceId;
    }

    // Only include data from completed steps or current step
    // Step 1: Policy Details - always include if current step is 0 or higher
    if (currentStep >= 0 && (policyDetails.insurer || policyDetails.policyNo || policyDetails.claimsNo)) {
      draftRequest.policyDetails = {
        ...policyDetails,
        policyCopyFilePath: uploadedDocs.policyCopy.url || '',
        intimationFormFilePath: uploadedDocs.intimationForm.url || '',
        claimsFormFilePath: uploadedDocs.claimsForm.url || '',
        vehicleRcFilePath: uploadedDocs.vehicleRC.url || '',
      };
    }

    // Step 2: Insurer Information - only include if current step is 1 or higher
    if (currentStep >= 1 && (insurerInformation.insurerName || insurerInformation.mobileNo || insurerInformation.vehicleNo)) {
      draftRequest.insurerInformation = {
        ...insurerInformation,
        drivingLicenseFilePath: uploadedDocs.drivingLicense.url || '',
        registrationCertificateFilePath: uploadedDocs.vehicleRC.url || '',
        aadhaarCardFilePath: uploadedDocs.aadharCard.url || '',
        panCardFilePath: uploadedDocs.panCard.url || '',
      };
    }

    // Step 3: Workshop Details - only include if current step is 2 or higher
    if (currentStep >= 2 && (workshopDetails.workshopName || workshopDetails.mobileNo || workshopDetails.emailAddress)) {
      draftRequest.workshopDetails = {
        ...workshopDetails,
        estimateFilePath: uploadedDocs.workshopEstimate.url || '',
        otherFilePath: uploadedDocs.other.url || '',
      };
    }

    // Step 4: Allocation - only include if current step is 3 or higher (allocation step)
    if (currentStep >= 3 && (allocation.workshopPincode || allocation.state || allocation.division || allocation.allocatedTo || 
        allocation.allocatedtouserid || allocation.customerContactMobileNumber || allocation.customerContactWhatsappNumber || 
        allocation.customerContactEmailAddress || allocation.workshopContactMobileNumber || 
        allocation.workshopContactWhatsappNumber || allocation.workshopContactEmailAddress)) {
      draftRequest.allocation = {
        ...allocation,
        workshopPincode: allocation.workshopPincode || '400001',
        state: allocation.state || 'Maharashtra',
      };
    }

    return draftRequest;
  };

  // Validation functions
  const validateStep1 = () => {
    const newErrors: Partial<Record<string, string>> = {};
    const requiredFields: Array<keyof typeof policyDetails> = [
      'insurer',
      'policyNo',
      'policyDate',
      'policyEndDate',
      'claimsNo',
      'placeOfIncident',
      'dateOfIncident',
    ];
    
    requiredFields.forEach((field) => {
      if (!policyDetails[field]) {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())} is required`;
      }
    });

    // Document validations - check for URLs (successful uploads)
    const newDocErrors: Partial<Record<keyof UploadedDocuments, string>> = {};
    if (!uploadedDocs.policyCopy.url) newDocErrors.policyCopy = 'Policy Copy is required';
    if (!uploadedDocs.intimationForm.url) newDocErrors.intimationForm = 'Intimation Form is required';
    if (!uploadedDocs.claimsForm.url) newDocErrors.claimsForm = 'Claims Form is required';
    if (!uploadedDocs.vehicleRC.url) newDocErrors.vehicleRC = 'Vehicle RC is required';

    setErrors('step1', newErrors);
    setDocErrors(newDocErrors);

    const fieldsOk = Object.keys(newErrors).length === 0;
    const docsOk = Object.keys(newDocErrors).length === 0;
    return fieldsOk && docsOk;
  };

  const validateVehicleNo = (no: string) =>
    /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{1,4}$/i.test(no);

  const validateStep2 = () => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!insurerInformation.insurerName) newErrors.insurerName = 'Name is required';
    if (!insurerInformation.mobileNo) {
      newErrors.mobileNo = 'Mobile number is required';
    } else if (!validateMobile(insurerInformation.mobileNo)) {
      newErrors.mobileNo = 'Invalid mobile number';
    }
    if (!insurerInformation.emailAddress) {
      newErrors.emailAddress = 'Email is required';
    } else if (!validateEmail(insurerInformation.emailAddress)) {
      newErrors.emailAddress = 'Invalid email format';
    }
    if (!insurerInformation.vehicleNo) {
      newErrors.vehicleNo = 'Vehicle number is required';
    } else if (!validateVehicleNo(insurerInformation.vehicleNo)) {
      newErrors.vehicleNo = 'Invalid vehicle number';
    }

    if (insurerInformation.alternateNo && !validateMobile(insurerInformation.alternateNo)) {
      newErrors.alternateNo = 'Invalid mobile number';
    }
    if (insurerInformation.alternateEmail && !validateEmail(insurerInformation.alternateEmail)) {
      newErrors.alternateEmail = 'Invalid email format';
    }

    setErrors('step2', newErrors);

    const newDocErrors2: Partial<Record<keyof UploadedDocuments, string>> = {};
    if (!uploadedDocs.drivingLicense.url) newDocErrors2.drivingLicense = 'Driving license is required';
    if (!uploadedDocs.vehicleRC.url) newDocErrors2.vehicleRC = 'RC copy is required';
    if (!uploadedDocs.aadharCard.url) newDocErrors2.aadharCard = 'Aadhaar Card is required';
    if (!uploadedDocs.panCard.url) newDocErrors2.panCard = 'PAN Card is required';

    setDocErrors2(newDocErrors2);

    const fieldsOk = Object.keys(newErrors).length === 0;
    const docsOk = Object.keys(newDocErrors2).length === 0;
    return fieldsOk && docsOk;
  };

  const validateStep3 = () => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!workshopDetails.workshopName) newErrors.workshopName = 'Workshop name is required';
    if (!workshopDetails.mobileNo) {
      newErrors.mobileNo = 'Mobile number is required';
    } else if (!validateMobile(workshopDetails.mobileNo)) {
      newErrors.mobileNo = 'Invalid mobile number';
    }
    if (!workshopDetails.emailAddress) {
      newErrors.emailAddress = 'Email is required';
    } else if (!validateEmail(workshopDetails.emailAddress)) {
      newErrors.emailAddress = 'Invalid email format';
    }
    if (!workshopDetails.addressLine1) newErrors.addressLine1 = 'Location is required';

    setErrors('step3', newErrors);

    const newDocErrors3: Partial<Record<keyof UploadedDocuments, string>> = {};
    if (!uploadedDocs.workshopEstimate.url) newDocErrors3.workshopEstimate = 'Estimate is required';

    const fieldsOk = Object.keys(newErrors).length === 0;
    const docsOk = Object.keys(newDocErrors3).length === 0;
    return fieldsOk && docsOk;
  };

  const validateStep4 = () => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!allocation.allocatedTo || !allocation.allocatedtouserid) {
      newErrors.allocatedTo = 'Please select a claim handler';
    }

    // Store step4 errors locally since context doesn't support step4
    setErrors('step3', newErrors); // Use step3 as a workaround
    return Object.keys(newErrors).length === 0;
  };

  // Event handlers
  const handleNext = async () => {
    const validations = [
      validateStep1,
      validateStep2,
      validateStep3,
      validateStep4,
    ];

    if (!validations[currentStep]()) return;


    
    // Auto-save draft on every Next click
    try {
      const draftRequest = mapDocumentsToDraftRequest();
      console.log(`🔄 Auto-saving draft for step ${currentStep}:`, {
        step: currentStep,
        includesPolicy: !!draftRequest.policyDetails,
        includesInsurer: !!draftRequest.insurerInformation,
        includesWorkshop: !!draftRequest.workshopDetails,
        includesAllocation: !!draftRequest.allocation,
        draftRequest
      });
      const draftResponse = await saveDraft(draftRequest);
      
      if (draftResponse.success && draftResponse.data) {
        
        // Store reference_id from first draft response
        if (draftResponse.data.reference_id) {
          setReferenceId(draftResponse.data.reference_id);
          localStorage.setItem('intimation_reference_id', draftResponse.data.reference_id);
        }
        
        const newId = `DRAFT-${draftResponse.data.draft_id || 'AUTO'}`;
        setDraftId(newId);
        setIsDraftSaved(true);
      } else {
        console.error('Failed to auto-save draft:', draftResponse.message);
        // Continue with the flow even if draft save fails
      }
    } catch (error) {
      console.error('Error auto-saving draft:', error);
      // Continue with the flow even if draft save fails
    }
    
    setCompletedSteps(prev => ({ ...prev, [currentStep]: true }));

    if (currentStep === steps.length - 1) {
      setShowReview(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleHeaderBack = () => {
    if (currentStep > 0 && currentStep < steps.length) {
      setShowUnsaved(true);
    } else {
      router.push('/dashboard');
    }
  };

  const handleBack = () => setCurrentStep(currentStep - 1);

  const confirmDiscard = () => {
    setShowUnsaved(false);
    setCurrentStep(currentStep - 1);
  };

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges() && !showSuccess && !showReview) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, showSuccess, showReview]);

  // Save Draft logic
    const handleSaveDraft = async () => {
    try {
      setLoading(true);
      const draftRequest = mapDocumentsToDraftRequest();
      console.log(`💾 Manual draft save for step ${currentStep}:`, {
        step: currentStep,
        includesPolicy: !!draftRequest.policyDetails,
        includesInsurer: !!draftRequest.insurerInformation,
        includesWorkshop: !!draftRequest.workshopDetails,
        includesAllocation: !!draftRequest.allocation,
        draftRequest
      });
      const draftResponse = await saveDraft(draftRequest);
      
      if (draftResponse.success && draftResponse.data) {
        
        // Store reference_id from draft response
        if (draftResponse.data.reference_id) {
          setReferenceId(draftResponse.data.reference_id);
          localStorage.setItem('intimation_reference_id', draftResponse.data.reference_id);
        }
        
        const newId = `DRAFT-${draftResponse.data.draft_id || 'MANUAL'}`;
        setDraftId(newId);
        setShowUnsaved(false);
        setShowSavedDraft(true);
      } else {
        console.error('Failed to save draft:', draftResponse.message);
        // Fallback to localStorage if API fails
        const newId = `DRAFT-${Date.now()}`;
        const payload = {
          step: currentStep,
          policyDetails,
          insurerInformation,
          workshopDetails,
          allocation,
          uploadedDocs,
          completedSteps,
          referenceId,
        };
        localStorage.setItem(newId, JSON.stringify(payload));
        setDraftId(newId);
        setShowUnsaved(false);
        setShowSavedDraft(true);
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
      // Fallback to localStorage if API fails
      const newId = `DRAFT-${Date.now()}`;
      const payload = {
        step: currentStep,
        policyDetails,
        insurerInformation,
        workshopDetails,
        allocation,
        uploadedDocs,
        completedSteps,
        referenceId,
      };
      localStorage.setItem(newId, JSON.stringify(payload));
      setDraftId(newId);
      setShowUnsaved(false);
      setShowSavedDraft(true);
    } finally {
      setLoading(false);
    }
  };

  const closeSavedDraft = () => {
    setShowSavedDraft(false);
    // Redirect to dashboard after closing the saved draft dialog
    router.push('/dashboard');
  };

  const handleConfirm = async () => {
    try {
      setShowReview(false);

      // Ensure we have a reference ID - create draft if needed
      let currentReferenceId = referenceId;
      if (!currentReferenceId) {
        try {
          const draftRequest = mapDocumentsToDraftRequest();
          const draftResponse = await saveDraft(draftRequest);
          
          if (draftResponse.success && draftResponse.data?.reference_id) {
            currentReferenceId = draftResponse.data.reference_id;
            setReferenceId(currentReferenceId);
            localStorage.setItem('intimation_reference_id', currentReferenceId);
          }
        } catch (draftError) {
          console.error('Failed to create final draft:', draftError);
        }
      }

      // Create payload using the new schema structure directly from context
      const payload = {
        reference_id: currentReferenceId || '',
        policyDetails: {
          insurer: policyDetails.insurer || '',
          policyNo: policyDetails.policyNo || '',
          policyDate: policyDetails.policyDate || '',
          policyEndDate: policyDetails.policyEndDate || '',
          claimsNo: policyDetails.claimsNo || '',
          insurerBranch: policyDetails.insurerBranch || '',
          placeOfIncident: policyDetails.placeOfIncident || '',
          dateOfIncident: policyDetails.dateOfIncident || '',
          policeReportFiled: policyDetails.policeReportFiled || false,
          panchanCarriedOut: policyDetails.panchanCarriedOut || false,
          policeStationName: policyDetails.policeStationName || '',
          stationDetail: policyDetails.stationDetail || '',
          policyCopyFilePath: uploadedDocs.policyCopy.url || '',
          intimationFormFilePath: uploadedDocs.intimationForm.url || '',
          claimsFormFilePath: uploadedDocs.claimsForm.url || '',
          vehicleRcFilePath: uploadedDocs.vehicleRC.url || '',
        },
        insurerInformation: {
          insurerName: insurerInformation.insurerName || '',
          mobileNo: insurerInformation.mobileNo || '',
          emailAddress: insurerInformation.emailAddress || '',
          vehicleNo: insurerInformation.vehicleNo || '',
          driverName: insurerInformation.driverName || '',
          alternateNo: insurerInformation.alternateNo || '',
          alternateEmail: insurerInformation.alternateEmail || '',
          drivingLicenseFilePath: uploadedDocs.drivingLicense.url || '',
          registrationCertificateFilePath: uploadedDocs.vehicleRC.url || '',
          aadhaarCardFilePath: uploadedDocs.aadharCard.url || '',
          panCardFilePath: uploadedDocs.panCard.url || '',
        },
        workshopDetails: {
          workshopName: workshopDetails.workshopName || '',
          mobileNo: workshopDetails.mobileNo || '',
          emailAddress: workshopDetails.emailAddress || '',
          estimatedCost: workshopDetails.estimatedCost || 0,
          addressLine1: workshopDetails.addressLine1 || '',
          addressLine2: workshopDetails.addressLine2 || '',
          state: workshopDetails.state || '',
          pincode: workshopDetails.pincode || '',
          natureOfLoss: workshopDetails.natureOfLoss || '',
          estimateFilePath: uploadedDocs.workshopEstimate.url || '',
          otherFilePath: uploadedDocs.other.url || '',
        },
        allocation: {
          workshopPincode: allocation.workshopPincode || '400001',
          state: allocation.state || 'Maharashtra',
          division: allocation.division || '',
          allocatedTo: allocation.allocatedTo || '',
          allocatedtouserid: allocation.allocatedtouserid || 0,
          customerContactMobileNumber: allocation.customerContactMobileNumber || insurerInformation.mobileNo || '',
          customerContactWhatsappNumber: allocation.customerContactWhatsappNumber || insurerInformation.alternateNo || '',
          customerContactEmailAddress: allocation.customerContactEmailAddress || insurerInformation.emailAddress || '',
          workshopContactMobileNumber: allocation.workshopContactMobileNumber || workshopDetails.mobileNo || '',
          workshopContactWhatsappNumber: allocation.workshopContactWhatsappNumber || '',
          workshopContactEmailAddress: allocation.workshopContactEmailAddress || workshopDetails.emailAddress || '',
        },
      };
      
      const response = await submitIntimation(payload);
      
      // Show success screen instead of redirecting directly
      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting intimation:", error);
      // Even if there's an error, show success screen
      setShowSuccess(true);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // State is already reset in the useEffect when success screen is shown
  };

  const createChangeHandler = <T extends object>(
    setData: (data: Partial<T>) => void,
    stepKey: 'step1' | 'step2' | 'step3'
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ [name]: value } as Partial<T>);
    
    // Clear errors for the specific field with proper type handling
    if (errors[stepKey] && typeof errors[stepKey] === 'object') {
      const currentErrors = { ...errors[stepKey] } as Record<string, string>;
      if (name in currentErrors) {
        delete currentErrors[name];
        setErrors(stepKey, currentErrors);
      }
    }
  };

  const handleStep1Change = createChangeHandler(setPolicyDetails, 'step1');
  const handleStep2Change = createChangeHandler(setInsurerInformation, 'step2');
  const handleStep3Change = createChangeHandler(setWorkshopDetails, 'step3');
  const handleStep4Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAllocation({ [name]: value });
  };

  // Document type mapping for upload API
  const DOCUMENT_TYPE_MAPPING: Record<keyof UploadedDocuments, number> = {
    policyCopy: DOCUMENT_TYPE_IDS.POLICY_COPY,
    intimationForm: DOCUMENT_TYPE_IDS.INTIMATION_FORM,
    claimsForm: DOCUMENT_TYPE_IDS.CLAIMS_FORM,
    vehicleRC: DOCUMENT_TYPE_IDS.VEHICLE_RC,
    drivingLicense: DOCUMENT_TYPE_IDS.DRIVING_LICENSE,
    insuranceCopy: DOCUMENT_TYPE_IDS.INSURANCE_COPY,
    workshopEstimate: DOCUMENT_TYPE_IDS.WORKSHOP_ESTIMATE,
    repairPhotos: DOCUMENT_TYPE_IDS.REPAIR_PHOTOS,
    inspectionReport: DOCUMENT_TYPE_IDS.INSPECTION_REPORT,
    allocationForm: DOCUMENT_TYPE_IDS.ALLOCATION_FORM,
    surveyorReport: DOCUMENT_TYPE_IDS.SURVEYOR_REPORT,
    aadharCard: DOCUMENT_TYPE_IDS.AADHAR_CARD,
    panCard: DOCUMENT_TYPE_IDS.PAN_CARD,
    other: DOCUMENT_TYPE_IDS.OTHER,
  };

  const handleDocUpload = (fieldName: keyof UploadedDocuments) => async (file: File | null) => {
    if (file) {
      try {
        setLoading(true);
        
        const documentTypeId = DOCUMENT_TYPE_MAPPING[fieldName];

        
        // Upload document using the upload API
        const response = await uploadDocument({
          file,
          document_type_id: documentTypeId
        });
        
        // Check if response is successful and has data
        if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
          const uploadedDoc = response.data[0];
          
          // Update state with file, URL, and document ID from response
          setUploadedDocs(prev => ({
            ...prev,
            [fieldName]: {
              file,
              url: uploadedDoc.file_url,
              documentId: uploadedDoc.id?.toString() || uploadedDoc.document_id || null
            }
          }));
          

        } else {
          throw new Error('Upload response format is invalid');
        }
      } catch (error) {
        console.error(`Failed to upload ${fieldName}:`, error);
        // You might want to show an error message to the user here
      } finally {
        setLoading(false);
      }
    } else {
      // Clear document
      setUploadedDocs(prev => ({
        ...prev,
        [fieldName]: { file: null, url: null, documentId: null }
      }));
    }
  };



  // Reset form state and start countdown when success screen is shown
  useEffect(() => {
    if (!showSuccess) return;

    // Reset local state as well
    setUploadedDocs({
      policyCopy: { file: null, url: null, documentId: null },
      intimationForm: { file: null, url: null, documentId: null },
      claimsForm: { file: null, url: null, documentId: null },
      vehicleRC: { file: null, url: null, documentId: null },
      drivingLicense: { file: null, url: null, documentId: null },
      insuranceCopy: { file: null, url: null, documentId: null },
      workshopEstimate: { file: null, url: null, documentId: null },
      repairPhotos: { file: null, url: null, documentId: null },
      inspectionReport: { file: null, url: null, documentId: null },
      allocationForm: { file: null, url: null, documentId: null },
      surveyorReport: { file: null, url: null, documentId: null },
      aadharCard: { file: null, url: null, documentId: null },
      panCard: { file: null, url: null, documentId: null },
      other: { file: null, url: null, documentId: null },
    });
    setCompletedSteps({});
    setDocErrors({});
    setDocErrors2({});
    setDocErrors3({});
    
    // Reset UI states
    setCurrentStep(0);
    setShowReview(false);
    setShowUnsaved(false);
    setShowSavedDraft(false);
    
    // Reset countdown to 5 seconds and reset the ref
    setCountdown(5);
    countdownStartedRef.current = false;
  }, [showSuccess]);

  // Separate effect to reset form context when success screen is shown
  useEffect(() => {
    if (showSuccess) {
      // Use setTimeout to avoid calling resetForm during render
      const timer = setTimeout(() => {
        resetForm();
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccess, resetForm]);

  // Countdown effect for success screen
  useEffect(() => {
    if (!showSuccess || countdownStartedRef.current) return;

    countdownStartedRef.current = true;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Clean up localStorage before redirecting
          localStorage.removeItem('intimation_reference_id');
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [showSuccess, router]);

  // Remove the incorrect useEffect that was trying to call setAllocation with a function
  // useEffect(() => {
  //   setAllocation(prev => ({
  //     ...prev,
  //     ...allocation
  //   }));
  // }, [allocation]);


  // Get reference number from context or localStorage backup
  const getStoredReferenceId = () => {
    if (referenceId) return referenceId;
    const storedId = localStorage.getItem('intimation_reference_id');
    if (storedId) {
      return storedId;
    }
    return null;
  };
  
  const currentRefId = getStoredReferenceId();
  const referenceNo = currentRefId ? `#${currentRefId}` : "Processing...";
  


  useEffect(() => {
    if (!showReview && sectionRefs.current[currentStep]?.current) {
      (sectionRefs.current[currentStep].current as any).scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStep, showReview]);

  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (currentRefId) {
      navigator.clipboard.writeText(referenceNo).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <img src='/assets/successIcon.svg' alt='successIcon' className='mx-[20rem] py-2'/>
        <h2 className="text-[24px] font-semibold text-[#474747]">Claim Created Successfully!</h2>
        <p className='text-[#828282] pt-2'>We've sent this Reference No. to everyone involved — customer, garage, and the handler.</p>
        <p
          onClick={currentRefId ? handleCopy : undefined}
          onDoubleClick={currentRefId ? handleCopy : undefined}
          className={`text-[#474747] pt-6 flex justify-center items-center gap-1 select-none ${
            currentRefId ? 'cursor-pointer' : 'cursor-default'
          }`}
          title={currentRefId ? "Click to copy" : ""}
        >
          Reference No : <span className="font-medium">{referenceNo}</span>
          {currentRefId && <img src="/assets/copyIcon.svg" alt="copyIcon" className="h-4" />}
          {copied && <span className="text-green-500 text-sm ml-2">Copied!</span>}
        </p>
        <div className="py-4">
          <p className='text-[#16A34A] mb-2'>Redirecting to dashboard in</p>
          <div className="text-[32px] font-bold text-[#16A34A]">{countdown}</div>
          <p className='text-[#16A34A] text-sm'>seconds</p>
        </div>
      </div>
    );
  }

  if (showReview) {
          return (
        <ReviewSection
          step1Data={policyDetails}
          step2Data={insurerInformation}
          step3Data={workshopDetails}
          step4Data={allocation}
          activeStep={currentStep}
          setActiveStep={setCurrentStep as React.Dispatch<React.SetStateAction<number>>}
          setShowReview={setShowReview}
          handleConfirm={handleConfirm}
          sectionRefs={sectionRefs}
          uploadedDocs={uploadedDocs}
        />
      );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="flex justify-between items-center p-2 bg-gray-50 border-b border-[#EFEFEFE5] flex-shrink-0">
        <div className="flex items-center">
          <button className="bg-transparent border-none cursor-pointer flex items-center" onClick={handleHeaderBack}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div>
            <img src='../assets/logo.svg' alt="logo" className="h-14 w-auto" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer">
            <img src='../assets/notificationIcon.svg' alt="notificationIcon" />
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
            <img src='../assets/Avatar.svg' alt="Avatar" />
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <Box className="w-full py-6 bg-[#F4F4F51A] rounded-lg min-h-full">
          <Stepper
            activeStep={currentStep}
            alternativeLabel
            connector={<CustomConnector />}
          >
            {steps.map((label, index) => (
              <Step key={label} completed={Boolean(completedSteps[index])}>
                <StepLabel
                  StepIconComponent={(props: any) => <CustomStepIcon {...props} />}
                  className="text-sm font-medium"
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <div className="pb-20">
            {currentStep === 0 && (
              <Step1
                step1Data={policyDetails}
                setStep1Data={(data: any) => setPolicyDetails(data)}
                docErrors={docErrors}
                errors={errors}
                handleStep1Change={handleStep1Change}
                uploadedDocs={uploadedDocs}
                handleDocUpload={handleDocUpload}
              />
            )}
            {currentStep === 1 && (
              <Step2
                step2Data={insurerInformation}
                handleStep2Change={handleStep2Change}
                docErrors={docErrors2}
                errors={errors}
                uploadedDocs={uploadedDocs}
                handleDocUpload={handleDocUpload}
              />
            )}
            {currentStep === 2 && (
              <Step3
                step3Data={{
                  workshopName: workshopDetails.workshopName || '',
                  mobileNo: workshopDetails.mobileNo || '',
                  emailAddress: workshopDetails.emailAddress || '',
                  estimatedCost: workshopDetails.estimatedCost || 0,
                  natureOfLoss: workshopDetails.natureOfLoss || '',
                  addressLine1: workshopDetails.addressLine1 || '',
                  addressLine2: workshopDetails.addressLine2 || '',
                  state: workshopDetails.state || '',
                  pincode: workshopDetails.pincode || '',
                  estimateFilePath: uploadedDocs.workshopEstimate.url || '',
                  otherFilePath: uploadedDocs.other.url || ''
                }}
                handleStep3Change={handleStep3Change}
                errors={{ step3: errors.step3 as Partial<Record<string, string>> }}
                docErrors={docErrors3}
                uploadedDocs={uploadedDocs}
                handleDocUpload={handleDocUpload}
              />
            )}
            {currentStep === 3 && (
              <Step4
                step4Data={allocation}
                step2Data={insurerInformation}
                step3Data={workshopDetails}
                handleStep4Change={handleStep4Change}
                errors={{ step4: {} }} // Empty step4 errors since context doesn't support it
              />
            )}
          </div>
        </Box>
      </div>

      {/* Fixed Bottom Navigation */}
      <Box
        className="flex p-3 bg-[#FFFFFF] w-full justify-end gap-4 flex-shrink-0"
        sx={{
          border: '1px solid #F4F4F5',
        }}
      >
        <Button
          variant="contained"
          disabled={currentStep === 0}
          onClick={handleBack}
          sx={{
            px: 3,
            py: '4px',
            color: '#09090B',
            border: '1px solid #D4D4D8',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            '&:disabled': {
              backgroundColor: '#D1D5DB',
              color: '#6B7280',
            },
          }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={isLoading}
          sx={{
            backgroundColor: '#09090B',
            px: 3,
            py: '4px',
            borderRadius: '0.375rem',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            '&:disabled': {
              backgroundColor: '#D1D5DB',
              color: '#FFFFFF',
            },
          }}
        >
          {isLoading ? 'Saving...' : currentStep === steps.length - 1 ? 'Review' : 'Next'}
        </Button>
      </Box>

      {/* Unsaved changes dialog */}
      <Dialog
        open={showUnsaved}
        onClose={() => setShowUnsaved(false)}
        PaperProps={{
          sx: {
            background: '#FFFFFF',
            boxShadow: '0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814',
            borderRadius: 2
          }
        }}
      >
        <DialogContent className="text-left pt-8 px-6">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            className="mb-4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9988 8.00021V12.0002M11.9988 16.0002H12.0088M10.2888 2.8602L1.8188 17.0002C1.64417 17.3026 1.55177 17.6455 1.55079 17.9947C1.54981 18.3439 1.64029 18.6873 1.81323 18.9907C1.98616 19.2941 2.23553 19.547 2.53651 19.7241C2.83749 19.9012 3.1796 19.9964 3.5288 20.0002H20.4688C20.818 19.9964 21.1601 19.9012 21.4611 19.7241C21.7621 19.547 22.0114 19.2941 22.1844 18.9907C22.3573 18.6873 22.4478 18.6873 22.4468 17.9947C22.4458 17.6455 22.3534 17.3026 22.1788 17.0002L13.7088 2.8602C13.5305 2.56631 13.2795 2.32332 12.98 2.15469C12.6805 1.98605 12.3425 1.89746 11.9988 1.89746C11.6551 1.89746 11.3171 1.98605 11.0176 2.15469C10.7181 2.32332 10.4671 2.56631 10.2888 2.8602Z"
              stroke="#DC6803"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Unsaved changes
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Save your progress before exiting to avoid losing any updates.
          </Typography>
          <Box className="flex space-x-4 mb-4" sx={{ justifyContent: "space-evenly" }}>
            <Button
              onClick={confirmDiscard}
              sx={{
                width: 170,
                height: 38,
                borderRadius: 1,
                border: '1px solid #E5E5E5',
                color: '#000000',
                textTransform: 'none'
              }}
            >
              Discard
            </Button>
            <Button
              onClick={handleSaveDraft}
              sx={{
                width: 170,
                height: 38,
                borderRadius: 1,
                background: '#000000',
                boxShadow: '0px 2px 4px 0px #A5A3AE4D',
                color: '#FFFFFF',
                textTransform: 'none',
                '&:hover': { background: '#222' }
              }}
            >
              Save Draft
            </Button>
          </Box>
          <IconButton
            onClick={() => setShowUnsaved(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#858585',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogContent>
      </Dialog>

      {/* Saved as Draft dialog */}
      <Dialog
        open={showSavedDraft}
        onClose={closeSavedDraft}
        PaperProps={{
          sx: {
            position: 'relative',
            overflow: 'visible',
            background: '#FFFFFF',
            boxShadow: '0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814',
            borderRadius: 2,
          }
        }}
      >
        <DialogContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 4,
            px: 6,
          }}
        >
          <Box
            component="span"
            sx={{ mr: 4, flexShrink: 0 }}
            dangerouslySetInnerHTML={{
              __html: `
<svg width="51" height="49" viewBox="0 0 51 49" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.175781" y="0.323242" width="50" height="48.3536" rx="24.1768" fill="#303746"/>
  <mask id="mask0_3411_23244" mask-type="alpha" maskUnits="userSpaceOnUse" x="6" y="6" width="37" height="37">
    <rect x="6.21875" y="6.36719" width="36.2652" height="36.2652" fill="#D9D9D9"/>
  </mask>
  <g mask="url(#mask0_3411_23244)">
    <path d="M24.1763 8.11328C15.2405 8.11328 7.98828 15.3655 7.98828 24.3013C7.98828 33.237 15.2405 40.4893 24.1763 40.4893C33.112 40.4893 40.3643 33.237 40.3643 24.3013C40.3643 15.3655 33.112 8.11328 24.1763 8.11328ZM25.7951 32.3953H22.5575V29.1577H25.7951V32.3953ZM25.7951 25.9201H22.5575V16.2073H25.7951V25.9201Z" fill="#FFD21E"/>
  </g>
</svg>`,
            }}
          />

          <Box>
            <Typography
              component="h2"
              sx={{
                fontFamily: 'Geist',
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '33.24px',
                letterSpacing: '-0.62px',
                color: '#3C434A',
                mb: 1,
              }}
            >
              Saved as Draft
            </Typography>
            <Typography
              component="p"
              sx={{
                fontFamily: 'Geist',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '27.2px',
                letterSpacing: '0px',
                color: '#3C434A',
              }}
            >
              Your draft for claim <strong>#{getStoredReferenceId() || draftId}</strong> has been saved.
            </Typography>
          </Box>

          <IconButton
            onClick={closeSavedDraft}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#858585',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </div>
  );
}