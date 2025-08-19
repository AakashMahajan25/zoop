// CustomStepIcon.tsx
import React from 'react';
import { Box, StepConnector, styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface CustomStepIconProps {
  active: boolean;
  completed: boolean;
  icon: React.ReactNode | number | string;
}

export const CustomStepIcon: React.FC<CustomStepIconProps> = ({
  completed,
  icon,
}) => {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        // two states: completed vs not completed
        background: completed
          ? 'var(--Grey-Pallette-Grey-800, #27272A)'
          : '#FAFAFA',
        border: '1.07px solid #1A8450',
        boxShadow: '0px 0px 6px 0px #21FF9199',

        // icon color: white on completed, black otherwise
        color: completed ? '#FFFFFF' : '#000000',
      }}
    >
      {completed ? (
        <CheckIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
      ) : (
        <Box component="span" sx={{ fontWeight: 'bold', fontSize: 14 }}>
          {icon}
        </Box>
      )}
    </Box>
  );
};

export const CustomConnector = styled(StepConnector)(() => ({
  '&.MuiStepConnector-root': {
    // center the line vertically against a 32px icon
    top: 16,
  },
  '& .MuiStepConnector-line': {
    borderColor: '#E0E0E0',
    borderTopWidth: 2,
    borderRadius: 1,
  },
  '&.Mui-completed .MuiStepConnector-line': {
    borderColor: '#21FF91',
  },
  '&.Mui-active .MuiStepConnector-line': {
    borderColor: '#21FF91',
  },
}));
