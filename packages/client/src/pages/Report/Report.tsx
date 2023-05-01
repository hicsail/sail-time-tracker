import { GroupByEmployee } from '@pages/Report/GroupByEmployee';
import { GroupByProject } from '@pages/Report/GroupByProject';
import { useState } from 'react';
import { DropDownMenu } from '@pages/Track/components/DropDownMenu';
import { Box, SelectChangeEvent } from '@mui/material';

export const Report = () => {
  const [groupBy, setGroupBy] = useState<string>('1');

  const data = [
    { id: '1', name: 'Employee' },
    { id: '2', name: 'Project' }
  ];

  const handleOnChange = (e: SelectChangeEvent) => {
    setGroupBy(e.target.value);
  };

  console.log(groupBy);
  return (
    <div>
      <Box sx={{ paddingTop: '1rem' }}>
        <DropDownMenu data={data} onChange={handleOnChange} defaultValue={groupBy} label="Group By" name="select_group_by" id="select_group_by" />
      </Box>
      {groupBy === '1' ? <GroupByEmployee /> : <GroupByProject />}
    </div>
  );
};
