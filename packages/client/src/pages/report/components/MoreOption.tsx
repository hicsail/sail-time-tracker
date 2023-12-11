import { Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert.js';
import { FC, useState } from 'react';
import { formatDateToDashFormat } from '../../../utils/helperFun';
import { useGetRecordsByDateRangeQuery } from '@graphql/record/record';
import { CSVLink } from 'react-csv';

interface MenuOptionsProps {
  startDate: Date;
  endDate: Date;
}

export const MenuOptions: FC<MenuOptionsProps> = ({ startDate, endDate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { data } = useGetRecordsByDateRangeQuery({
    variables: {
      input: {
        startDate: formatDateToDashFormat(startDate),
        endDate: formatDateToDashFormat(endDate)
      }
    },
    fetchPolicy: 'cache-and-network'
  });

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formattedData =
    data?.getRecordsByDateRange.map((record) => {
      return {
        id: record.id,
        date: record.date,
        employee: record.employee.name,
        project: record.project.name,
        hours: record.hours,
        rate: record.project.rate,
        isBillable: record.project.isBillable
      };
    }) ?? [];

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Date', key: 'date' },
    { label: 'Employee', key: 'employee' },
    { label: 'Project', key: 'project' },
    { label: 'Hours', key: 'hours' },
    { label: 'Rate', key: 'rate' },
    { label: 'Billable', key: 'isBillable' }
  ];

  const fileName = `report-${formatDateToDashFormat(startDate)}-${formatDateToDashFormat(endDate)}.csv`;

  return (
    <Box>
      <Tooltip title="More">
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem>
          <CSVLink data={formattedData} headers={headers} filename={`${fileName}`} style={{ textDecoration: 'none', color: 'black' }}>
            Download me
          </CSVLink>
        </MenuItem>
      </Menu>
    </Box>
  );
};
