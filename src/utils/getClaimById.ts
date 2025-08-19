import { authenticatedApiCall, ApiResponse } from "./api";

export interface ClaimDetailsResponse {
  id: string;
  reference_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  policyDetails?: {
    insurer?: string;
    policyNo?: string;
    policyDate?: string;
    policyEndDate?: string;
    claimsNo?: string;
    insurerBranch?: string;
    placeOfIncident?: string;
    dateOfIncident?: string;
    policeReportFiled?: boolean;
    panchanCarriedOut?: boolean;
    policeStationName?: string;
    stationDetail?: string;
    policyCopyFilePath?: string;
    intimationFormFilePath?: string;
    claimsFormFilePath?: string;
    vehicleRcFilePath?: string;
  };
  insurerInformation?: {
    insurerName?: string;
    mobileNo?: string;
    emailAddress?: string;
    vehicleNo?: string;
    driverName?: string;
    alternateNo?: string;
    alternateEmail?: string;
    drivingLicenseFilePath?: string;
    registrationCertificateFilePath?: string;
    aadhaarCardFilePath?: string;
    panCardFilePath?: string;
  };
  workshopDetails?: {
    workshopName?: string;
    mobileNo?: string;
    emailAddress?: string;
    estimatedCost?: number;
    addressLine1?: string;
    addressLine2?: string;
    state?: string;
    pincode?: string;
    natureOfLoss?: string;
    estimateFilePath?: string;
    otherFilePath?: string;
  };
  allocation?: {
    workshopPincode?: string;
    state?: string;
    division?: string;
    allocatedTo?: string;
    customerContactMobileNumber?: string;
    customerContactWhatsappNumber?: string;
    customerContactEmailAddress?: string;
    workshopContactMobileNumber?: string;
    workshopContactWhatsappNumber?: string;
    workshopContactEmailAddress?: string;
  };
}

export const getClaimById = async (claimId: string): Promise<ClaimDetailsResponse> => {
  const response = await authenticatedApiCall<ClaimDetailsResponse>(`/intimation/claim/${claimId}`, {
    method: "GET",
  });
  
  if (!response.data) {
    throw new Error('No data received from API');
  }
  
  return response.data;
};
