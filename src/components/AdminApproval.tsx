'use client'
import React, { useState } from 'react';
import { 
  Tabs, 
  Tab, 
  TextField, 
  MenuItem, 
  Select, 
  SelectChangeEvent,
  Box,
  Stack,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import AdminClaimsSection from './adminSection/AdminClaimsSection';
import dayjs, { Dayjs } from 'dayjs';

export default function AdminApproval() {
  const [tabValue, setTabValue] = useState(0);
  const [dropdownValue, setDropdownValue] = useState('all');
  const [startDate1, setStartDate1] =useState<Dayjs | null>(dayjs());
  const [endDate1, setEndDate1] =useState<Dayjs | null>(dayjs());
  const [startDate2, setStartDate2] =useState<Dayjs | null>(dayjs());
  const [endDate2, setEndDate2] =useState<Dayjs | null>(dayjs());
  const [date3, setDate3] =useState<Dayjs | null>(dayjs());
  const [date4, setDate4] =useState<Dayjs | null>(dayjs());

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDropdownChange = (event: SelectChangeEvent) => {
    setDropdownValue(event.target.value as string);
  };

  return (
    <div className="p-4 space-y-6 text-[#333333]">
      <h2 className="text-2xl font-medium">Intimation Dashboard</h2>
      <p>Monitor and process claims efficiently</p>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Tab 1" />
          <Tab label="Tab 2" />
          <Tab label="Tab 3" />
          <Tab label="Tab 4" />
        </Tabs>
      </Box>
      
      <div>
        {tabValue === 0 && (
            <>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate1}
                onChange={(newValue) => setStartDate1(newValue ? dayjs(newValue) : null)}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                label="End Date"
                value={endDate1}
                onChange={(newValue) => setEndDate1(newValue ? dayjs(newValue) : null)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
            
            <Select
              value={dropdownValue}
              onChange={handleDropdownChange}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="option1">Option 1</MenuItem>
              <MenuItem value="option2">Option 2</MenuItem>
              <MenuItem value="option3">Option 3</MenuItem>
            </Select>
          </Stack>

          <AdminClaimsSection />
          </>
        )}
        
        {tabValue === 1 && (
            <>
            <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate2}
                onChange={(newValue) => setStartDate2(newValue ? dayjs(newValue) : null)}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                label="End Date"
                value={endDate2}
                onChange={(newValue) => setEndDate2(newValue ? dayjs(newValue) : null)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
            
            <Select
              value={dropdownValue}
              onChange={handleDropdownChange}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="option1">Option 1</MenuItem>
              <MenuItem value="option2">Option 2</MenuItem>
              <MenuItem value="option3">Option 3</MenuItem>
            </Select>
          </Stack>
                      <AdminClaimsSection />

            </>
          
        )}
        
        {tabValue === 2 && (
            <>
            <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                value={date3}
                onChange={(newValue) => setDate3(newValue ? dayjs(newValue) : null)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
            
            <Select
              value={dropdownValue}
              onChange={handleDropdownChange}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="option1">Option 1</MenuItem>
              <MenuItem value="option2">Option 2</MenuItem>
              <MenuItem value="option3">Option 3</MenuItem>
            </Select>
          </Stack>
          <AdminClaimsSection />
            </>
          
        )}
        
        {tabValue === 3 && (
            <>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                value={date4}
                onChange={(newValue) => setDate4(newValue ? dayjs(newValue) : null)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
            
            <Select
              value={dropdownValue}
              onChange={handleDropdownChange}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="option1">Option 1</MenuItem>
              <MenuItem value="option2">Option 2</MenuItem>
              <MenuItem value="option3">Option 3</MenuItem>
            </Select>
          </Stack>
          <AdminClaimsSection />
          </>
        )}
      </div>
    </div>
  );
}