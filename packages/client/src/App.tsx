import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Container from '@mui/material/Container';
import { Employee } from '@pages/Employee/employee';

import { GraphqlProvider } from '@graphql/graphql-provider';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <GraphqlProvider>
        <Container maxWidth="lg">
          <Employee />
        </Container>
      </GraphqlProvider>
    </LocalizationProvider>
  );
}

export default App;
