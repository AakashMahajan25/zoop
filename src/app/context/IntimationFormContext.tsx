'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PolicyDetails, InsurerInformation, WorkshopDetails, Allocation } from '@/types/intimationInterface';

interface IntimationFormState {
  policyDetails: PolicyDetails;
  insurerInformation: InsurerInformation;
  workshopDetails: WorkshopDetails;
  allocation: Allocation;
  currentStep: number;
  isDraftSaved: boolean;
  draftId: string | null;
  referenceId: string | null;
  isLoading: boolean;
  errors: {
    step1: Partial<Record<keyof PolicyDetails, string>>;
    step2: Partial<Record<keyof InsurerInformation, string>>;
    step3: Partial<Record<keyof WorkshopDetails, string>>;
    step4: Partial<Record<keyof Allocation, string>>;
  };
}

interface IntimationFormContextType {
  state: IntimationFormState;
  setPolicyDetails: (data: Partial<PolicyDetails>) => void;
  setInsurerInformation: (data: Partial<InsurerInformation>) => void;
  setWorkshopDetails: (data: Partial<WorkshopDetails>) => void;
  setAllocation: (data: Partial<Allocation>) => void;
  setCurrentStep: (step: number) => void;
  setDraftId: (id: string | null) => void;
  setReferenceId: (id: string | null) => void;
  setIsDraftSaved: (saved: boolean) => void;
  setLoading: (loading: boolean) => void;
  setErrors: (step: 'step1' | 'step2' | 'step3' | 'step4', errors: Partial<Record<string, string>>) => void;
  clearErrors: (step: 'step1' | 'step2' | 'step3' | 'step4') => void;
  resetForm: () => void;
  hasUnsavedChanges: () => boolean;
}

const IntimationFormContext = createContext<IntimationFormContextType | undefined>(undefined);

const initialPolicyDetails: PolicyDetails = {
  insurer: '',
  policyNo: '',
  policyDate: '',
  policyEndDate: '',
  claimsNo: '',
  insurerBranch: '',
  placeOfIncident: '',
  dateOfIncident: '',
  policeReportFiled: false,
  panchanCarriedOut: false,
  policeStationName: '',
  stationDetail: '',
  policyCopyFilePath: '',
  intimationFormFilePath: '',
  claimsFormFilePath: '',
  vehicleRcFilePath: '',
};

const initialInsurerInformation: InsurerInformation = {
  insurerName: '',
  mobileNo: '',
  emailAddress: '',
  vehicleNo: '',
  driverName: '',
  alternateNo: '',
  alternateEmail: '',
  drivingLicenseFilePath: '',
  registrationCertificateFilePath: '',
  aadhaarCardFilePath: '',
  panCardFilePath: '',
};

const initialWorkshopDetails: WorkshopDetails = {
  workshopName: '',
  mobileNo: '',
  emailAddress: '',
  estimatedCost: 0,
  addressLine1: '',
  addressLine2: '',
  state: '',
  pincode: '',
  natureOfLoss: '',
  estimateFilePath: '',
  otherFilePath: '',
};

const initialAllocation: Allocation = {
  workshopPincode: '400054',
  state: 'Maharashtra',
  division: '',
  allocatedTo: '',
  allocatedtouserid: 0,
  customerContactMobileNumber: '',
  customerContactWhatsappNumber: '',
  customerContactEmailAddress: '',
  workshopContactMobileNumber: '',
  workshopContactWhatsappNumber: '',
  workshopContactEmailAddress: '',
};

const initialState: IntimationFormState = {
  policyDetails: initialPolicyDetails,
  insurerInformation: initialInsurerInformation,
  workshopDetails: initialWorkshopDetails,
  allocation: initialAllocation,
  currentStep: 0,
  isDraftSaved: false,
  draftId: null,
  referenceId: null,
  isLoading: false,
  errors: {
    step1: {},
    step2: {},
    step3: {},
    step4: {},
  },
};

export const IntimationFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<IntimationFormState>(initialState);

  const setPolicyDetails = (data: Partial<PolicyDetails>) => {
    setState(prev => ({
      ...prev,
      policyDetails: { ...prev.policyDetails, ...data },
      isDraftSaved: false,
    }));
  };

  const setInsurerInformation = (data: Partial<InsurerInformation>) => {
    setState(prev => ({
      ...prev,
      insurerInformation: { ...prev.insurerInformation, ...data },
      isDraftSaved: false,
    }));
  };

  const setWorkshopDetails = (data: Partial<WorkshopDetails>) => {
    setState(prev => ({
      ...prev,
      workshopDetails: { ...prev.workshopDetails, ...data },
      isDraftSaved: false,
    }));
  };

  const setAllocation = (data: Partial<Allocation>) => {
    setState(prev => ({
      ...prev,
      allocation: { ...prev.allocation, ...data },
      isDraftSaved: false,
    }));
  };

  const setCurrentStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const setDraftId = (id: string | null) => {
    setState(prev => ({ ...prev, draftId: id }));
  };

  const setReferenceId = (id: string | null) => {
    setState(prev => ({ ...prev, referenceId: id }));
  };

  const setIsDraftSaved = (saved: boolean) => {
    setState(prev => ({ ...prev, isDraftSaved: saved }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const setErrors = (step: 'step1' | 'step2' | 'step3' | 'step4', errors: Partial<Record<string, string>>) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [step]: errors,
      },
    }));
  };

  const clearErrors = (step: 'step1' | 'step2' | 'step3' | 'step4') => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [step]: {},
      },
    }));
  };

  const resetForm = () => {
    setState(initialState);
  };

  const hasUnsavedChanges = (): boolean => {
    const { policyDetails, insurerInformation, workshopDetails, allocation } = state;
    
    // Check if any field has been filled
    const hasPolicyData = Object.values(policyDetails).some(value => 
      value !== '' && value !== 0 && value !== false && value !== null
    );
    
    const hasInsurerData = Object.values(insurerInformation).some(value => 
      value !== '' && value !== 0 && value !== false && value !== null
    );
    
    const hasWorkshopData = Object.values(workshopDetails).some(value => 
      value !== '' && value !== 0 && value !== false && value !== null
    );

    const hasAllocationData = Object.values(allocation).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue !== '' && nestedValue !== 0 && nestedValue !== false && nestedValue !== null
        );
      }
      return value !== '' && value !== 0 && value !== false && value !== null;
    });
    
    return hasPolicyData || hasInsurerData || hasWorkshopData || hasAllocationData;
  };

  const contextValue: IntimationFormContextType = {
    state,
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
    hasUnsavedChanges,
  };

  return (
    <IntimationFormContext.Provider value={contextValue}>
      {children}
    </IntimationFormContext.Provider>
  );
};

export const useIntimationForm = (): IntimationFormContextType => {
  const context = useContext(IntimationFormContext);
  if (context === undefined) {
    throw new Error('useIntimationForm must be used within an IntimationFormProvider');
  }
  return context;
};
