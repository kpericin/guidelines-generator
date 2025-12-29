import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useGuidelinesProperties } from '@/contexts/GuidelinesPropertiesContext';

export interface GuidelinesCanvasRef {
  exportToPDF: () => void;
}

export const GuidelinesCanvas = forwardRef<GuidelinesCanvasRef, object>(
  (_, ref) => {
    const { width, height, orientation } = useGuidelinesProperties();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      exportToPDF: () => {
        // At 300 DPI (print quality): 1mm = 300/25.4 pixels ≈ 11.811 pixels
        const DPI = 300;
        const MM_TO_PX = DPI / 25.4;

        // Use stored dimensions directly (already swapped based on orientation)
        const widthMM: number = width;
        const heightMM: number = height;

        const canvasWidth = Math.round(widthMM * MM_TO_PX);
        const canvasHeight = Math.round(heightMM * MM_TO_PX);
        const RECT_SIZE_MM = 50;
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
                    size: ${widthMM}mm ${heightMM}mm;
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
                  width: ${widthMM}mm;
                  height: ${heightMM}mm;
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

      // Use stored dimensions directly (already swapped based on orientation)
      const widthMM: number = width;
      const heightMM: number = height;

      // Set canvas size to match container while maintaining aspect ratio
      const resizeCanvas = () => {
        const container = containerRef.current;
        if (!container) return;

        // Account for padding (p-8 = 2rem = 32px on each side)
        const padding = 32 * 2; // 32px on each side
        const containerWidth = container.clientWidth - padding;
        const containerHeight = container.clientHeight - padding;
        const aspectRatio = widthMM / heightMM;
        const containerAspectRatio = containerWidth / containerHeight;

        let canvasWidth: number;
        let canvasHeight: number;

        if (containerAspectRatio > aspectRatio) {
          // Container is wider, fit to height
          canvasHeight = containerHeight;
          canvasWidth = canvasHeight * aspectRatio;
        } else {
          // Container is taller, fit to width
          canvasWidth = containerWidth;
          canvasHeight = canvasWidth / aspectRatio;
        }

        // Set canvas internal resolution to match display size
        // This prevents distortion from CSS scaling
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Set CSS size to match internal resolution
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Fill with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw rectangle: 50x50mm scaled, light blue background, black border, centered
        // Calculate scale: canvas dimensions represent paper dimensions in mm
        // Since canvas maintains aspect ratio, both scales should be equal
        const scaleX = canvasWidth / widthMM; // pixels per mm in X direction
        const scaleY = canvasHeight / heightMM; // pixels per mm in Y direction
        // Use the average to ensure square stays square (they should be equal anyway)
        const scale = (scaleX + scaleY) / 2;

        const rectSizeMM = 50;
        const rectSize = rectSizeMM * scale;
        const x = (canvasWidth - rectSize) / 2;
        const y = (canvasHeight - rectSize) / 2;

        ctx.fillStyle = '#ADD8E6'; // Light blue
        ctx.fillRect(x, y, rectSize, rectSize);
        ctx.strokeStyle = '#000000'; // Black
        // Scale line width: 1mm border
        ctx.lineWidth = Math.max(1, scale);
        ctx.strokeRect(x, y, rectSize, rectSize);
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }, [width, height, orientation]);

    return (
      <div
        ref={containerRef}
        className="w-full h-full bg-muted flex items-center justify-center p-8"
      >
        <canvas ref={canvasRef} style={{ display: 'block' }} />
      </div>
    );
  }
);

GuidelinesCanvas.displayName = 'GuidelinesCanvas';
