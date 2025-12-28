import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

export interface GuidelinesCanvasRef {
  exportToPDF: () => void;
}

export const GuidelinesCanvas = forwardRef<GuidelinesCanvasRef, unknown>(
  (_props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      exportToPDF: () => {
        // A4 dimensions: 210mm x 297mm
        // At 300 DPI (print quality): 1mm = 300/25.4 pixels ≈ 11.811 pixels
        const DPI = 300;
        const MM_TO_PX = DPI / 25.4;

        const A4_WIDTH_MM = 210;
        const A4_HEIGHT_MM = 297;
        const RECT_SIZE_MM = 50;

        const canvasWidth = Math.round(A4_WIDTH_MM * MM_TO_PX);
        const canvasHeight = Math.round(A4_HEIGHT_MM * MM_TO_PX);
        const rectSize = Math.round(RECT_SIZE_MM * MM_TO_PX);

        // Create a high-resolution canvas for PDF export
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = canvasWidth;
        exportCanvas.height = canvasHeight;

        const exportCtx = exportCanvas.getContext('2d');
        if (!exportCtx) return;

        // Fill with white background
        exportCtx.fillStyle = '#FFFFFF';
        exportCtx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw rectangle: 50x50mm, light blue background, black border, centered
        const x = (canvasWidth - rectSize) / 2;
        const y = (canvasHeight - rectSize) / 2;

        exportCtx.fillStyle = '#ADD8E6'; // Light blue
        exportCtx.fillRect(x, y, rectSize, rectSize);
        exportCtx.strokeStyle = '#000000'; // Black
        exportCtx.lineWidth = Math.round(1 * MM_TO_PX); // 1mm border
        exportCtx.strokeRect(x, y, rectSize, rectSize);

        // Convert to image
        const dataUrl = exportCanvas.toDataURL('image/png', 1.0);

        // Create a new window with the image for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          alert('Please allow popups to export as PDF');
          return;
        }

        // Create HTML with exact A4 dimensions and 100% scaling
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Guidelines Export</title>
              <style>
                @media print {
                  @page {
                    margin: 0;
                    size: A4;
                  }
                  body {
                    margin: 0;
                    padding: 0;
                  }
                }
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  background: white;
                }
                img {
                  width: ${A4_WIDTH_MM}mm;
                  height: ${A4_HEIGHT_MM}mm;
                  display: block;
                  object-fit: contain;
                }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" alt="Guidelines Canvas" />
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to match container
      const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;

          // Draw rectangle: 100x100, light blue background, black border, centered
          const rectSize = 100;
          const x = (canvas.width - rectSize) / 2;
          const y = (canvas.height - rectSize) / 2;

          ctx.fillStyle = '#ADD8E6'; // Light blue
          ctx.fillRect(x, y, rectSize, rectSize);
          ctx.strokeStyle = '#000000'; // Black
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, rectSize, rectSize);
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" />;
  }
);

GuidelinesCanvas.displayName = 'GuidelinesCanvas';
