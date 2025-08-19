import { GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";

// Define the RowData interface for type safety
interface RowData {
  avgTime: string;
  name: string;
  rating: number;
}

// Define the NewClaimsRowData interface for the new claims table
export interface NewClaimsRowData {
  id: number;
  subject: string;
  from: string;
  to: string;
  dueDate: string;
  time: string;
}

export const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Handler Name',
    width: 250,
    sortable: true,
    cellClassName: 'center-text',
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span>Handler Name</span>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <img src="/assets/filter.svg" alt="Sort" style={{ width: 16, height: 16 }} />
          <img src="/assets/verticalDots.svg" alt="Filter" style={{ width: 16, height: 16 }} />
        </Box>
      </Box>
    ),
  },
  {
    field: 'rating',
    headerName: 'Claims Assigned',
    flex: 1,
    filterable: false,
    sortable: true,
    cellClassName: 'center-text',
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span>Claims Assigned</span>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <img src="/assets/filter.svg" alt="Sort" style={{ width: 16, height: 16 }} />
          <img src="/assets/verticalDots.svg" alt="Filter" style={{ width: 16, height: 16 }} />
        </Box>
      </Box>
    ),
  },
  {
    field: 'id',
    headerName: 'Avg Assignment Time',
    flex: 1,
    sortable: true,
    cellClassName: 'center-text',
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span>Avg Assignment Time</span>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <img src="/assets/filter.svg" alt="Sort" style={{ width: 16, height: 16 }} />
          <img src="/assets/verticalDots.svg" alt="Filter" style={{ width: 16, height: 16 }} />
        </Box>
      </Box>
    ),
    // Note: The 'id' field is used here, but typically average assignment time would be a calculated field
    // Consider adding a proper field like 'avgAssignmentTime' with appropriate data
  },
];

export const rows: RowData[] = [
  { avgTime: '39m', name: 'John Doe', rating: 4.2 },
  { avgTime: '25m', name: 'Jane Smith', rating: 3.8 },
  { avgTime: '35m', name: 'Ali Khan', rating: 4.5 },
  { avgTime: '45m', name: 'Maria Garcia', rating: 4.0 },
  { avgTime: '55m', name: 'Maria Garcia', rating: 4.0 },
  { avgTime: '1h 5m', name: 'Maria Garcia', rating: 4.0 },
  { avgTime: '1h 15m', name: 'Maria Garcia', rating: 4.0 },
  { avgTime: '1h 25m', name: 'Maria Garcia', rating: 4.0 },
  { avgTime: '1h 35m', name: 'Maria Garcia', rating: 4.0 },
  { avgTime: '1h 45m', name: 'Maria Garcia', rating: 4.0 },
];

export const newClaimsColumns: GridColDef[] = [
  {
    field: 'subject',
    headerName: 'Subject',
    flex: 1,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span>Subject</span>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <img src="/assets/filter.svg" alt="Sort" style={{ width: 16, height: 16 }} />
          <img src="/assets/verticalDots.svg" alt="Filter" style={{ width: 16, height: 16 }} />
        </Box>
      </Box>
    ),
  },
  {
    field: 'from',
    headerName: 'From',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span>From</span>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <img src="/assets/filter.svg" alt="Sort" style={{ width: 16, height: 16 }} />
          <img src="/assets/verticalDots.svg" alt="Filter" style={{ width: 16, height: 16 }} />
        </Box>
      </Box>
    ),
  },
  {
    field: 'to',
    headerName: 'To',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span>To</span>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <img src="/assets/filter.svg" alt="Sort" style={{ width: 16, height: 16 }} />
          <img src="/assets/verticalDots.svg" alt="Filter" style={{ width: 16, height: 16 }} />
        </Box>
      </Box>
    ),
  },
  {
    field: 'dueDate',
    headerName: 'Due Date',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span>Due Date</span>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <img src="/assets/filter.svg" alt="Sort" style={{ width: 16, height: 16 }} />
          <img src="/assets/verticalDots.svg" alt="Filter" style={{ width: 16, height: 16 }} />
        </Box>
      </Box>
    ),
  },
  {
    field: 'time',
    headerName: 'Time',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span>Time</span>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <img src="/assets/filter.svg" alt="Sort" style={{ width: 16, height: 16 }} />
          <img src="/assets/verticalDots.svg" alt="Filter" style={{ width: 16, height: 16 }} />
        </Box>
      </Box>
    ),
  },
];

export const newClaimsRows: NewClaimsRowData[] = [
  {
    id: 1,
    subject: 'Policy Review',
    from: 'Alice',
    to: 'Bob',
    dueDate: '2025-06-05',
    time: '10:00 AM',
  },
  {
    id: 2,
    subject: 'Claim Processing',
    from: 'Charlie',
    to: 'Dana',
    dueDate: '2025-06-06',
    time: '2:30 PM',
  },
  {
    id: 3,
    subject: 'Document Verification',
    from: 'Eve',
    to: 'Frank',
    dueDate: '2025-06-07',
    time: '11:15 AM',
  },
  {
    id: 4,
    subject: 'Client Meeting',
    from: 'George',
    to: 'Helen',
    dueDate: '2025-06-08',
    time: '4:00 PM',
  },
  {
    id: 5,
    subject: 'Form Submission',
    from: 'Ivy',
    to: 'Jack',
    dueDate: '2025-06-09',
    time: '9:45 AM',
  },
  {
    id: 6,
    subject: 'Follow-Up Call',
    from: 'Karen',
    to: 'Liam',
    dueDate: '2025-06-10',
    time: '3:00 PM',
  },
  {
    id: 7,
    subject: 'Email Reminder',
    from: 'Mona',
    to: 'Noah',
    dueDate: '2025-06-11',
    time: '1:00 PM',
  },
  {
    id: 8,
    subject: 'Policy Update',
    from: 'Oscar',
    to: 'Pam',
    dueDate: '2025-06-12',
    time: '10:30 AM',
  },
  {
    id: 9,
    subject: 'Insurance Quotation',
    from: 'Quinn',
    to: 'Rachel',
    dueDate: '2025-06-13',
    time: '11:00 AM',
  },
  {
    id: 10,
    subject: 'Premium Collection',
    from: 'Steve',
    to: 'Tina',
    dueDate: '2025-06-14',
    time: '12:00 PM',
  },
];