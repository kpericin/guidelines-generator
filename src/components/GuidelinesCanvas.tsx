import { useRef, useEffect } from 'react';

export function GuidelinesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
