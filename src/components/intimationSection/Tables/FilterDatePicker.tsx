'use client';
import * as React from 'react';
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  placeholder?: string;
}

const FilterDatePicker: React.FC<Props> = ({ value, onChange, placeholder }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MUIDatePicker
        value={value}
        onChange={(newValue) => onChange(newValue ? dayjs(newValue) : null)}
        slotProps={{
          textField: {
            size: 'small',
            placeholder: placeholder || 'Select date',
            sx: {
              border: '1px solid #EFEFEF',
              borderRadius: '10px',
              width: '200px',
              '& fieldset': { border: 'none' },
              '& .MuiInputBase-input': {
                paddingLeft: '40px',
                fontSize: '14px',
                color: '#374151',
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#9CA3AF',
                opacity: 1,
              },
            },
          },
        }}
        slots={{
          openPickerIcon: () => (
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: '#9CA3AF' }}
            >
              <path 
                d="M8 2V5M16 2V5M3.5 4H20.5C21.3284 4 22 4.67157 22 5.5V19.5C22 20.3284 21.3284 21 20.5 21H3.5C2.67157 21 2 20.3284 2 19.5V5.5C2 4.67157 2.67157 4 3.5 4Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M2 10H22" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M7 14H10M14 14H17M7 18H10M14 18H17" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          ),
        }}
      />
    </LocalizationProvider>
  );
};

export default FilterDatePicker;
