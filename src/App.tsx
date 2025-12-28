import { useRef } from 'react';
import { AppHeader } from './components/AppHeader';
import { CustomSidebar } from './components/CustomSidebar';
import {
  GuidelinesCanvas,
  type GuidelinesCanvasRef,
} from './components/GuidelinesCanvas';

function App() {
  const canvasRef = useRef<GuidelinesCanvasRef>(null);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onExportPDF={() => canvasRef.current?.exportToPDF()} />
      <div className="flex flex-1 overflow-hidden">
        <CustomSidebar />
        <main className="flex-1 overflow-auto">
          <GuidelinesCanvas ref={canvasRef} />
        </main>
      </div>
    </div>
  );
}

export default App;
