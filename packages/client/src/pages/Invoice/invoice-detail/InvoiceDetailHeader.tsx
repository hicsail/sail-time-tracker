import { Box, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import { ClickUpIcon } from '@components/icons/ClickupIcon';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { FC } from 'react';

interface InvoiceHeaderProps {
  projectName?: string;
  clickUpTaskUrl?: string;
  startDate?: string;
  endDate?: string;
}

export const InvoiceDetailHeader: FC<InvoiceHeaderProps> = ({ projectName, clickUpTaskUrl, startDate, endDate }) => {
  const url = clickUpTaskUrl ? clickUpTaskUrl : '';
  return (
    <Box>
      <h3>
        <span>Project Name: {projectName}</span>
        <span>
          {clickUpTaskUrl && (
            <Tooltip title="clickup task">
              <Link to={url} target="_blank">
                <IconButton>
                  <ClickUpIcon fontSize="large" />
                </IconButton>
              </Link>
            </Tooltip>
          )}
        </span>
      </h3>
      <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }}>
        <CalendarTodayIcon />
        <div>
          {startDate && startDate.split('-').join('/')} - {endDate && endDate.split('-').join('/')}
        </div>
      </Box>
    </Box>
  );
};
