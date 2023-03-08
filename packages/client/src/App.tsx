import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Container from '@mui/material/Container';
import { Employee } from '@pages/Employee/employee';
import { AddEmployee } from '@pages/Employee/addEmployee';
import { Track } from '@pages/Track/track';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Employee />
      </Container>
    </LocalizationProvider>
  );
}

export default App;
