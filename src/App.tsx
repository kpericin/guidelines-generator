import { useRef, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { CustomSidebar, type Orientation } from './components/CustomSidebar';
import {
  GuidelinesCanvas,
  type GuidelinesCanvasRef,
} from './components/GuidelinesCanvas';

function App() {
  const canvasRef = useRef<GuidelinesCanvasRef>(null);
  const [paperSize, setPaperSize] = useState<string>('A4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onExportPDF={() => canvasRef.current?.exportToPDF()} />
      <div className="flex flex-1 overflow-hidden">
        <CustomSidebar
          paperSize={paperSize}
          orientation={orientation}
          onPaperSizeChange={setPaperSize}
          onOrientationChange={setOrientation}
        />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <GuidelinesCanvas
            ref={canvasRef}
            paperSize={paperSize}
            orientation={orientation}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
