import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { colors } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react';
const CLAIM_STATUS = ['Pending', 'Approved', 'Rejected'];

export const ActionMenu = ({ currentStatus }: { currentStatus: string }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <span className="capitalize text-sm">{currentStatus}</span>
      <Tooltip title="Change Status">
        <IconButton onClick={handleClick} size="small">
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {CLAIM_STATUS.map((status) => (
          <MenuItem key={status} onClick={() => {
            console.log(`Change to: ${status}`);
            handleClose();
          }}>
            {status}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
