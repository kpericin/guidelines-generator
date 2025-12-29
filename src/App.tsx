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
  const [width, setWidth] = useState<number>(210);
  const [height, setHeight] = useState<number>(297);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onExportPDF={() => canvasRef.current?.exportToPDF()} />
      <div className="flex flex-1 overflow-hidden">
        <CustomSidebar
          paperSize={paperSize}
          orientation={orientation}
          width={width}
          height={height}
          onPaperSizeChange={setPaperSize}
          onOrientationChange={setOrientation}
          onWidthChange={setWidth}
          onHeightChange={setHeight}
        />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <GuidelinesCanvas
            ref={canvasRef}
            width={width}
            height={height}
            orientation={orientation}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
