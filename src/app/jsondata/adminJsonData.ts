export interface UserData {
  id: number;
  email: string;
  username: string;
  role: string;
  ongoingClaims: 'Pending' | 'Approved' | 'Rejected';
  dueDate: string;
  lastUpload: string;
  caseCount: number;
}

interface Props {
  row: UserData;
}

// Note: Data is static for SSR consistency. If dynamic, fetch in useEffect or Server Component.
export const sampleData: UserData[] = [
  {
    id: 1,
    email: "johndoe31@gmail.com",
    username: "John Doe",
    role: "Claim Handler",
    ongoingClaims: "Pending",
    dueDate: "2025-06-05",
    lastUpload: "2025-05-25",
    caseCount: 3
  },
  {
    id: 2,
    email: "johndoe32@gmail.com",
    username: "Jane Smith",
    role: "Claim Handler",
    ongoingClaims: "Approved",
    dueDate: "2025-06-15",
    lastUpload: "2025-05-20",
    caseCount: 4
  },
  {
    id: 3,
    email: "johndoe33@gmail.com",
    username: "Alice Johnson",
    role: "Claim Handler",
    ongoingClaims: "Rejected",
    dueDate: "2025-06-10",
    lastUpload: "2025-05-22",
    caseCount: 5
  },
  {
    id: 4,
    email: "johndoe34@gmail.com",
    username: "Bob Williams",
    role: "Claim Handler",
    ongoingClaims: "Rejected", // Changed from "Remove"
    dueDate: "2025-06-12",
    lastUpload: "2025-05-23",
    caseCount: 2
  },
  {
    id: 5,
    email: "sarah.jones@gmail.com",
    username: "Sarah Jones",
    role: "Claim Handler",
    ongoingClaims: "Pending",
    dueDate: "2025-06-18",
    lastUpload: "2025-05-28",
    caseCount: 6
  },
  {
    id: 6,
    email: "mike.brown@gmail.com",
    username: "Mike Brown",
    role: "Claim Handler",
    ongoingClaims: "Approved",
    dueDate: "2025-06-20",
    lastUpload: "2025-05-27",
    caseCount: 1
  },
  {
    id: 7,
    email: "emma.davis@gmail.com",
    username: "Emma Davis",
    role: "Claim Handler",
    ongoingClaims: "Rejected",
    dueDate: "2025-06-22",
    lastUpload: "2025-05-29",
    caseCount: 4
  },
  {
    id: 8,
    email: "liam.miller@gmail.com",
    username: "Liam Miller",
    role: "Claim Handler",
    ongoingClaims: "Rejected", // Changed from "Remove"
    dueDate: "2025-06-24",
    lastUpload: "2025-05-26",
    caseCount: 2
  },
  {
    id: 9,
    email: "olivia.wilson@gmail.com",
    username: "Olivia Wilson",
    role: "Claim Handler",
    ongoingClaims: "Pending",
    dueDate: "2025-06-26",
    lastUpload: "2025-05-24",
    caseCount: 7
  },
  {
    id: 10,
    email: "noah.moore@gmail.com",
    username: "Noah Moore",
    role: "Claim Handler",
    ongoingClaims: "Approved",
    dueDate: "2025-06-28",
    lastUpload: "2025-05-21",
    caseCount: 3
  },
  {
    id: 11,
    email: "ava.taylor@gmail.com",
    username: "Ava Taylor",
    role: "Claim Handler",
    ongoingClaims: "Rejected",
    dueDate: "2025-07-01",
    lastUpload: "2025-05-30",
    caseCount: 5
  },
  {
    id: 12,
    email: "william.anderson@gmail.com",
    username: "William Anderson",
    role: "Claim Handler",
    ongoingClaims: "Rejected", // Changed from "Remove"
    dueDate: "2025-07-03",
    lastUpload: "2025-05-19",
    caseCount: 2
  },
  {
    id: 13,
    email: "sophia.thomas@gmail.com",
    username: "Sophia Thomas",
    role: "Claim Handler",
    ongoingClaims: "Pending",
    dueDate: "2025-07-05",
    lastUpload: "2025-05-18",
    caseCount: 6
  },
  {
    id: 14,
    email: "james.jackson@gmail.com",
    username: "James Jackson",
    role: "Claim Handler",
    ongoingClaims: "Approved",
    dueDate: "2025-07-07",
    lastUpload: "2025-05-17",
    caseCount: 3
  },
  {
    id: 15,
    email: "mia.white@gmail.com",
    username: "Mia White",
    role: "Claim Handler",
    ongoingClaims: "Rejected",
    dueDate: "2025-07-09",
    lastUpload: "2025-05-16",
    caseCount: 5
  },
  {
    id: 16,
    email: "benjamin.harris@gmail.com",
    username: "Benjamin Harris",
    role: "Claim Handler",
    ongoingClaims: "Rejected", // Changed from "Remove"
    dueDate: "2025-07-11",
    lastUpload: "2025-05-15",
    caseCount: 1
  },
  {
    id: 17,
    email: "charlotte.martin@gmail.com",
    username: "Charlotte Martin",
    role: "Claim Handler",
    ongoingClaims: "Pending",
    dueDate: "2025-07-13",
    lastUpload: "2025-05-14",
    caseCount: 4
  },
  {
    id: 18,
    email: "elijah.thompson@gmail.com",
    username: "Elijah Thompson",
    role: "Claim Handler",
    ongoingClaims: "Approved",
    dueDate: "2025-07-15",
    lastUpload: "2025-05-13",
    caseCount: 3
  },
  {
    id: 19,
    email: "amelia.jones@gmail.com",
    username: "Amelia Garcia",
    role: "Claim Handler",
    ongoingClaims: "Rejected",
    dueDate: "2025-07-17",
    lastUpload: "2025-05-12",
    caseCount: 5
  },
  {
    id: 20,
    email: "lucas.martinez@gmail.com",
    username: "Lucas Martinez",
    role: "Claim Handler",
    ongoingClaims: "Rejected", // Changed from "Remove"
    dueDate: "2025-07-19",
    lastUpload: "2025-05-11",
    caseCount: 2
  }
];

export const allColumns = [
  'Email',
  'Username',
  'Role',
  'Status',
  'Due Date',
  'Last Upload',
  'Actions'
];

export const statusColors: Record<string, string> = {
  Pending: '#FFA500',
  Approved: '#4CAF50',
  Rejected: '#F44336'
};

export interface ClaimData {
  id: number;
  vehicleNumber: string;
  insuranceProvider: string;
  claimAmount: number; // Changed to number
  claimStatus: 'Complete' | 'Paid Out' | 'Uploaded' | 'Rejected';
  dateSubmitted: string;
}

export const claimsData: ClaimData[] = [
  {
    id: 1,
    vehicleNumber: 'ABC123',
    insuranceProvider: 'XYZ Insurance',
    claimAmount: 1250,
    claimStatus: 'Complete',
    dateSubmitted: '2023-05-15'
  },
  {
    id: 2,
    vehicleNumber: 'DEF456',
    insuranceProvider: 'ABC Insurance',
    claimAmount: 2500,
    claimStatus: 'Paid Out',
    dateSubmitted: '2023-06-20'
  },
  {
    id: 3,
    vehicleNumber: 'GHI789',
    insuranceProvider: 'XYZ Insurance',
    claimAmount: 1750,
    claimStatus: 'Uploaded',
    dateSubmitted: '2023-07-10'
  },
  {
    id: 4,
    vehicleNumber: 'JKL012',
    insuranceProvider: 'DEF Insurance',
    claimAmount: 3200,
    claimStatus: 'Rejected',
    dateSubmitted: '2023-08-05'
  },
  {
    id: 5,
    vehicleNumber: 'MNO345',
    insuranceProvider: 'ABC Insurance',
    claimAmount: 980,
    claimStatus: 'Complete',
    dateSubmitted: '2023-09-01'
  },
  {
    id: 6,
    vehicleNumber: 'PQR678',
    insuranceProvider: 'XYZ Insurance',
    claimAmount: 1350,
    claimStatus: 'Uploaded', // Changed from 'In Review'
    dateSubmitted: '2023-09-15'
  },
  {
    id: 7,
    vehicleNumber: 'STU901',
    insuranceProvider: 'LMN Insurance',
    claimAmount: 2700,
    claimStatus: 'Paid Out',
    dateSubmitted: '2023-10-10'
  },
  {
    id: 8,
    vehicleNumber: 'VWX234',
    insuranceProvider: 'DEF Insurance',
    claimAmount: 3500,
    claimStatus: 'Rejected',
    dateSubmitted: '2023-11-05'
  },
  {
    id: 9,
    vehicleNumber: 'YZA567',
    insuranceProvider: 'XYZ Insurance',
    claimAmount: 1100,
    claimStatus: 'Uploaded',
    dateSubmitted: '2023-12-01'
  },
  {
    id: 10,
    vehicleNumber: 'BCD890',
    insuranceProvider: 'ABC Insurance',
    claimAmount: 2800,
    claimStatus: 'Complete',
    dateSubmitted: '2024-01-12'
  },
  {
    id: 11,
    vehicleNumber: 'EFG123',
    insuranceProvider: 'LMN Insurance',
    claimAmount: 1600,
    claimStatus: 'Uploaded', // Changed from 'In Review'
    dateSubmitted: '2024-02-18'
  },
  {
    id: 12,
    vehicleNumber: 'HIJ456',
    insuranceProvider: 'DEF Insurance',
    claimAmount: 3000,
    claimStatus: 'Rejected',
    dateSubmitted: '2024-03-05'
  },
  {
    id: 13,
    vehicleNumber: 'KLM789',
    insuranceProvider: 'XYZ Insurance',
    claimAmount: 2250,
    claimStatus: 'Paid Out',
    dateSubmitted: '2024-04-09'
  },
  {
    id: 14,
    vehicleNumber: 'NOP012',
    insuranceProvider: 'ABC Insurance',
    claimAmount: 1875,
    claimStatus: 'Complete',
    dateSubmitted: '2024-04-28'
  },
  {
    id: 15,
    vehicleNumber: 'QRS345',
    insuranceProvider: 'DEF Insurance',
    claimAmount: 2150,
    claimStatus: 'Uploaded',
    dateSubmitted: '2024-05-10'
  },
  {
    id: 16,
    vehicleNumber: 'TUV678',
    insuranceProvider: 'LMN Insurance',
    claimAmount: 3100,
    claimStatus: 'Paid Out',
    dateSubmitted: '2024-06-01'
  },
  {
    id: 17,
    vehicleNumber: 'WXY901',
    insuranceProvider: 'XYZ Insurance',
    claimAmount: 990,
    claimStatus: 'Complete',
    dateSubmitted: '2024-06-15'
  },
  {
    id: 18,
    vehicleNumber: 'ZAB234',
    insuranceProvider: 'ABC Insurance',
    claimAmount: 2620,
    claimStatus: 'Rejected',
    dateSubmitted: '2024-07-02'
  },
  {
    id: 19,
    vehicleNumber: 'CDE567',
    insuranceProvider: 'DEF Insurance',
    claimAmount: 1430,
    claimStatus: 'Uploaded', // Changed from 'In Review'
    dateSubmitted: '2024-07-20'
  },
  {
    id: 20,
    vehicleNumber: 'BCD890',
    insuranceProvider: 'ABC Insurance',
    claimAmount: 2800,
    claimStatus: 'Complete',
    dateSubmitted: '2024-01-12'
  },
  {
    id: 21,
    vehicleNumber: 'BCD890',
    insuranceProvider: 'ABC Insurance',
    claimAmount: 2800,
    claimStatus: 'Complete',
    dateSubmitted: '2024-01-12'
  },
];

export const allColumnsOfListView = [
  'Vehicle Number',
  'Insurance Provider',
  'Claim Amount',
  'Claim Status',
  'Date Submitted',
  'Actions'
];

export interface Claim {
  id: number;
  vehicleNumber: string;
  insurer: string;
  claimAmount: number;
  claimStatus: 'Assessment Active' | 'Assessment Pending' | 'Assigned';
  createdOn: string;
  lastUdpatedOn: string;
  claimHandler: string;
}

export const initialClaimsData: Claim[] = [
  { id: 1, vehicleNumber: 'MH12AB1234', insurer: 'NIC', claimAmount: 50000, claimStatus: 'Assessment Pending', createdOn: '2025-06-01', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 2, vehicleNumber: 'DL10CD4567', insurer: 'HDFC ERGO', claimAmount: 45000, claimStatus: 'Assigned', createdOn: '2025-06-02', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 3, vehicleNumber: 'KA01EF8910', insurer: 'ICICI Lombard', claimAmount: 30000, claimStatus: 'Assessment Active', createdOn: '2025-06-03', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 4, vehicleNumber: 'TN09GH2345', insurer: 'Bajaj Allianz', claimAmount: 52000, claimStatus: 'Assessment Pending', createdOn: '2025-06-04', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 5, vehicleNumber: 'GJ03IJ6789', insurer: 'SBI General', claimAmount: 60000, claimStatus: 'Assessment Active', createdOn: '2025-06-05', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 6, vehicleNumber: 'RJ14KL4321', insurer: 'Reliance General', claimAmount: 35000, claimStatus: 'Assigned', createdOn: '2025-06-06', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 7, vehicleNumber: 'WB02MN0987', insurer: 'United India', claimAmount: 70000, claimStatus: 'Assessment Active', createdOn: '2025-06-07', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 8, vehicleNumber: 'AP16OP1234', insurer: 'NIC', claimAmount: 48000, claimStatus: 'Assessment Pending', createdOn: '2025-06-08', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 9, vehicleNumber: 'HR26QR5678', insurer: 'TATA AIG', claimAmount: 55000, claimStatus: 'Assigned', createdOn: '2025-06-09', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 10, vehicleNumber: 'UP32ST9012', insurer: 'New India Assurance', claimAmount: 37000, claimStatus: 'Assessment Active', createdOn: '2025-06-10', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },

  { id: 11, vehicleNumber: 'CG04UV3456', insurer: 'HDFC ERGO', claimAmount: 40000, claimStatus: 'Assessment Pending', createdOn: '2025-06-11', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 12, vehicleNumber: 'KL07WX7890', insurer: 'ICICI Lombard', claimAmount: 69000, claimStatus: 'Assigned', createdOn: '2025-06-12', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 13, vehicleNumber: 'PB08YZ1234', insurer: 'Bajaj Allianz', claimAmount: 31000, claimStatus: 'Assessment Active', createdOn: '2025-06-13', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 14, vehicleNumber: 'BR10AA5678', insurer: 'SBI General', claimAmount: 45000, claimStatus: 'Assessment Pending', createdOn: '2025-06-14', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 15, vehicleNumber: 'AS11BB9012', insurer: 'Reliance General', claimAmount: 53000, claimStatus: 'Assessment Active', createdOn: '2025-06-15', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 16, vehicleNumber: 'OR13CC3456', insurer: 'United India', claimAmount: 34000, claimStatus: 'Assigned', createdOn: '2025-06-16', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 17, vehicleNumber: 'MP09DD7890', insurer: 'NIC', claimAmount: 47000, claimStatus: 'Assessment Pending', createdOn: '2025-06-17', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 18, vehicleNumber: 'JK01EE1234', insurer: 'TATA AIG', claimAmount: 62000, claimStatus: 'Assessment Active', createdOn: '2025-06-18', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 19, vehicleNumber: 'CH04FF5678', insurer: 'New India Assurance', claimAmount: 38000, claimStatus: 'Assessment Pending', createdOn: '2025-06-19', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 20, vehicleNumber: 'GA06GG9012', insurer: 'HDFC ERGO', claimAmount: 56000, claimStatus: 'Assigned', createdOn: '2025-06-20', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },

  { id: 21, vehicleNumber: 'AN01HH3456', insurer: 'ICICI Lombard', claimAmount: 44000, claimStatus: 'Assessment Active', createdOn: '2025-06-21', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 22, vehicleNumber: 'MN02II7890', insurer: 'Bajaj Allianz', claimAmount: 39000, claimStatus: 'Assessment Pending', createdOn: '2025-06-22', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 23, vehicleNumber: 'TR03JJ1234', insurer: 'SBI General', claimAmount: 51000, claimStatus: 'Assigned', createdOn: '2025-06-23', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 24, vehicleNumber: 'DD05KK5678', insurer: 'Reliance General', claimAmount: 47000, claimStatus: 'Assessment Active', createdOn: '2025-06-24', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 25, vehicleNumber: 'DN06LL9012', insurer: 'United India', claimAmount: 58000, claimStatus: 'Assessment Pending', createdOn: '2025-06-25', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 26, vehicleNumber: 'LD07MM3456', insurer: 'NIC', claimAmount: 36000, claimStatus: 'Assigned', createdOn: '2025-06-26', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 27, vehicleNumber: 'PY08NN7890', insurer: 'TATA AIG', claimAmount: 54000, claimStatus: 'Assessment Active', createdOn: '2025-06-27', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 28, vehicleNumber: 'SK09OO1234', insurer: 'New India Assurance', claimAmount: 42000, claimStatus: 'Assessment Pending', createdOn: '2025-06-28', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 29, vehicleNumber: 'AR10PP5678', insurer: 'HDFC ERGO', claimAmount: 66000, claimStatus: 'Assigned', createdOn: '2025-06-29', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
  { id: 30, vehicleNumber: 'NL11QQ9012', insurer: 'ICICI Lombard', claimAmount: 47000, claimStatus: 'Assessment Active', createdOn: '2025-06-30', lastUdpatedOn: '2025-02-21', claimHandler: 'Hitesh Sutar' },
];
