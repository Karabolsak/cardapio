import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
  const [selected, setSelected] = useState('Dashboard');

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={setSelected} />
      <MainContent selected={selected} />
    </div>
  );
}

export default App;
