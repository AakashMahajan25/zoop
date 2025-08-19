import { Dayjs } from "dayjs";

export interface PolicyDetails {
  insurer: string;
  policyNo: string;
  policyDate: string;
  policyEndDate: string;
  claimsNo: string;
  insurerBranch: string;
  placeOfIncident: string;
  dateOfIncident: string;
  policeReportFiled: boolean;
  panchanCarriedOut: boolean;
  policeStationName: string;
  stationDetail: string;
  policyCopyFilePath: string;
  intimationFormFilePath: string;
  claimsFormFilePath: string;
  vehicleRcFilePath: string;
}

export interface InsurerInformation {
  insurerName: string;
  mobileNo: string;
  emailAddress: string;
  vehicleNo: string;
  driverName: string;
  alternateNo: string;
  alternateEmail: string;
  drivingLicenseFilePath: string;
  registrationCertificateFilePath: string;
  aadhaarCardFilePath: string;
  panCardFilePath: string;
}

export interface WorkshopDetails {
  workshopName: string;
  mobileNo: string;
  emailAddress: string;
  estimatedCost: number;
  addressLine1: string;
  addressLine2: string;
  state: string;
  pincode: string;
  natureOfLoss: string;
  estimateFilePath: string;
  otherFilePath: string;
}

export interface Allocation {
  workshopPincode: string;
  state: string;
  division: string;
  allocatedTo: string;
  allocatedtouserid: number;
  customerContactMobileNumber: string;
  customerContactWhatsappNumber: string;
  customerContactEmailAddress: string;
  workshopContactMobileNumber: string;
  workshopContactWhatsappNumber: string;
  workshopContactEmailAddress: string;
}

export interface IntimationFormData {
  reference_id?: string;
  policyDetails: PolicyDetails;
  insurerInformation: InsurerInformation;
  workshopDetails: WorkshopDetails;
  allocation: Allocation;
}

// Legacy interfaces for backward compatibility
export interface Step1Data {
  id: number;
  claim_number: string;
  vehicle_id: number;
  insurer_id: string;
  customer_id: number;
  handler_id: number;
  policy_number: string;
  policy_valid_from: string; // YYYY-MM-DD
  policy_valid_to: string;   // YYYY-MM-DD
  claim_serving_office: string;
  date_of_loss: string;      // YYYY-MM-DD
  place_of_loss: string;
  reported_to_police: boolean;
  police_station: string;
  place_of_incident: string;
  diary_entry_number: string;
  punchnama_attached: boolean;
  status: string;
  created_by: number;
  created_at: string;        // ISO 8601
  updated_at: string;        // ISO 8601
  intimation_form_url: string;
  claim_form_url: string;
  policy_copy_url: string;
  other_document_url: string;
  // Additional properties used in the component
  insurer_branch?: string;
  panchamCarriedOut?: boolean;
  policyName?: string;
  stationDetail?: string;
}

export interface Step2Data {
  id: number;
  insured_name: string;
  mobile_number: string;
  whatsapp_number: string;
  email_address: string;
  vehicle_number: string;
  driver_name: string;
  alternate_mobile_number: string;
  alternate_email: string;
  claim_number: string;
  policy_number: string;
  policy_valid_from: string; // YYYY-MM-DD
  policy_valid_to: string;   // YYYY-MM-DD
  insurer_id: string;
  insurer_name: string;
  driving_license_url: string;
  rc_url: string;
  aadhar_card_url: string;
  pan_card_url: string;
  other_document_url: string;
}

export interface Step3Data {
  id: number;
  claim_number: string;
  name: string;
  email: string;
  phone: string;
  gst_number: string;
  cin_number: string;
  proprietor_pan: string;
  location: string;
  company_pan: string;
  director_pan: string;
}
