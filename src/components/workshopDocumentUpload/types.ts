export type UploadedFile = | File 
| { name: string;
  url: string;
  type?: string; };
export type FileArray = UploadedFile[][];
export type SingleFileArray = UploadedFile[];
export type FileStateSetter = React.Dispatch<React.SetStateAction<FileArray>>;
export type SingleFileStateSetter = React.Dispatch<React.SetStateAction<SingleFileArray>>;
export interface ClaimDetails {
  reference_id: string;
  status: string;
  policyDetails: {
    id: number;
    intimation_id: number;
    insurer: string;
    policyNo: string;
    policyDate: string; // ISO date string
    policyEndDate: string; // ISO date string
    claimsNo: string;
    insurerBranch: string;
    placeOfIncident: string;
    dateOfIncident: string; // ISO date string
    policeReportFiled: boolean;
    panchanCarriedOut: boolean;
    policeStationName: string;
    stationDetail: string;
    policyCopyFilePath: string;
    intimationFormFilePath: string;
    claimsFormFilePath: string;
    vehicleRcFilePath: string;
  };
  insurerInformation: {
    id: number;
    intimation_id: number;
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
  };
  workshopDetails: {
    id: number;
    intimation_id: number;
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
  };
  allocation: {
    id: number;
    intimation_id: number;
    workshopPincode: string;
    state: string;
    division: string;
    allocatedTo: string;
    customerContactMobileNumber: string;
    customerContactWhatsappNumber: string;
    customerContactEmailAddress: string;
    workshopContactMobileNumber: string;
    workshopContactWhatsappNumber: string;
    workshopContactEmailAddress: string;
  };
}



export interface DocumentUpload {
  id: number;
  claim_reference_id: string;
  uploaded_by: string | null;
  document_type_id: number;
  file_url: string;
  mimetype: string;
  status: string;
  role: string;
  uploaded_at: string;
}

export interface MediaUpload {
  id: number;
  claim_reference_id: string;
  section_id: number;
  file_url: string;
  uploaded_by: string | null;
  uploaded_at: string;
  source: string;
  quality: string;
  media_type: string;
  role: string;
}

export interface UploadsResponse {
  documents: DocumentUpload[];
  media: MediaUpload[];
}

export interface FileUploadInputProps {
  index: number;
  setFiles: FileStateSetter;
  filesArray: FileArray;
  label: string;
  errors?: string[];
  onDrop?: (index: number, files: File[]) => void;
}

export interface ClaimUploadsProps {
  reference_id: string;
  selectedRole: '' | 'customer' | 'workshop';
  claimDetails:ClaimDetails | null
  onContinue: () => void;
}

export interface RenderUploadedFilesProps {
  files: SingleFileArray;
  fieldIndex: number;
  setFiles: FileStateSetter | SingleFileStateSetter;
  filesArray: FileArray | SingleFileArray;
}

export interface WorkshopDocumentUploadProps {
  selectedRole: 'customer' | 'workshop';
  setUploadAssessmentModal: React.Dispatch<React.SetStateAction<boolean>>;
  claimDetails:ClaimDetails | null
  setStep: React.Dispatch<
    React.SetStateAction<
      "uploadAssessment" | "uploadedDocument" | "selectRole" | "uploadDoc" | "uploadDocStep" | "language" | "enablePermissions"
    >
  >;
}

export const step1FileNames = [
  'Registration Certificate',
  'Driving License',
  'PAN Card',
  'Aadhar Card',
  'Claim Form',
  'Policy Copy',
  'Vehicle Photos (Side)',
  'Cargo'
];

export const step2TopFileNames = [
  { label: 'Front Left', imgSrc: '/assets/carFrontLeft.svg' },
  { label: 'Front Right', imgSrc: '/assets/carFrontRight.svg' },
  { label: 'Rear Left', imgSrc: '/assets/carRearLeft.svg' }
];

export const step2LeftFileNames = [
  { label: 'Rear Right', imgSrc: '/assets/carRearRight.svg' },
  { label: 'Left-hand Front Door', imgSrc: '/assets/carLeftHandDoor.svg' },
  { label: 'Left-hand Rear Door', imgSrc: '/assets/carLeftHandRearDoor.svg' },
  { label: 'Right-hand Front Door', imgSrc: '/assets/carRightHandDoor.svg' }
];

export const step2RightFileNames = [
  { label: 'Right-hand Rear Door', imgSrc: '/assets/carRightHandRearDoor.svg'},
  { label: 'Odometer', imgSrc: null},
  { label: 'Chassis number', imgSrc: null },
  { label: 'Engine number', imgSrc: null}
];