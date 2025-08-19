'use client';
import * as React from 'react';
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}

const DatePicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MUIDatePicker
        value={value}
        onChange={(newValue) => onChange(newValue ? dayjs(newValue) : null)}
        format="DD MMM, YYYY"
        slotProps={{
          textField: {
            size: 'small',
            sx: {
              border: '1px solid #EFEFEF',
              borderRadius: '10px',
              width: '200px',
              '& fieldset': { border: 'none' },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
