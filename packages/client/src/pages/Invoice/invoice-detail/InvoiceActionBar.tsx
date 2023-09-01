import { Box, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import { ClickUpMobile } from '@components/icons/ClickupMobile';
import SendIcon from '@mui/icons-material/Send';
import { FC } from 'react';

interface ActionBarProps {
  exportToClickUp: () => void;
  handleOpenDialog: (type: 'update' | 'edit' | 'delete') => void;
}

export const InvoiceActionBar: FC<ActionBarProps> = ({ exportToClickUp, handleOpenDialog }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, '& .MuiButtonBase-root': { color: 'grey.600' }, alignItems: 'center' }}>
      <Tooltip title="update invoice" onClick={() => handleOpenDialog('update')}>
        <IconButton>
          <UpdateIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="delete" onClick={() => handleOpenDialog('delete')}>
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="export to clickup" onClick={exportToClickUp}>
        <IconButton sx={{ position: 'relative' }}>
          <ClickUpMobile fontSize="large" />
          <SendIcon
            sx={{
              position: 'absolute',
              bottom: '12px',
              right: '5px',
              fontSize: '15px',
              backgroundColor: 'primary.light',
              borderRadius: '50%',
              color: 'white',
              padding: '2px'
            }}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
