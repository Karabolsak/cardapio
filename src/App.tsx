import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SalesPanel from './components/SalesPanel';

function App() {
  const [selected, setSelected] = useState('Dashboard');

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={setSelected} />
      <MainContent selected={selected} />
      <SalesPanel />
    </div>
  );
}

export default App;
