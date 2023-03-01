import { useState } from 'react';
import './App.css';

import { Track } from '@pages/Track/track';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Track />
    </div>
  );
}

export default App;
