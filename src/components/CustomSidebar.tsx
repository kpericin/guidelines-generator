import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export type Orientation = 'portrait' | 'landscape';

export const PAPER_SIZES = {
  // US sizes
  Letter: { width: 216, height: 279 }, // mm
  Legal: { width: 216, height: 356 },
  Tabloid: { width: 279, height: 432 },
  Ledger: { width: 432, height: 279 },
  Executive: { width: 184, height: 267 },
  // ISO sizes (A3 and smaller)
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  A6: { width: 105, height: 148 },
  A7: { width: 74, height: 105 },
  A8: { width: 52, height: 74 },
} as const;

export interface CustomSidebarProps {
  paperSize: string;
  orientation: Orientation;
  width: number;
  height: number;
  onPaperSizeChange: (size: string) => void;
  onOrientationChange: (orientation: Orientation) => void;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
}

export function CustomSidebar({
  paperSize,
  orientation,
  width,
  height,
  onPaperSizeChange,
  onOrientationChange,
  onWidthChange,
  onHeightChange,
}: CustomSidebarProps) {
  const handlePaperSizeChange = (size: string) => {
    onPaperSizeChange(size);
    const paperDimensions = PAPER_SIZES[size as keyof typeof PAPER_SIZES];
    if (paperDimensions) {
      let newWidth: number = paperDimensions.width;
      let newHeight: number = paperDimensions.height;

      // Apply orientation swap
      if (orientation === 'landscape') {
        [newWidth, newHeight] = [newHeight, newWidth];
      }

      onWidthChange(newWidth);
      onHeightChange(newHeight);
    }
  };

  const handleOrientationChange = (newOrientation: Orientation) => {
    onOrientationChange(newOrientation);
    // Swap width and height when orientation changes
    onWidthChange(height);
    onHeightChange(width);
  };

  const handleWidthChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onWidthChange(numValue);
      // Check if the new dimensions match any predefined size
      checkAndUpdatePaperSize(numValue, height);
    }
  };

  const handleHeightChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onHeightChange(numValue);
      // Check if the new dimensions match any predefined size
      checkAndUpdatePaperSize(width, numValue);
    }
  };

  const checkAndUpdatePaperSize = (w: number, h: number) => {
    // Check if dimensions match any predefined size (accounting for orientation)
    for (const [sizeName, dimensions] of Object.entries(PAPER_SIZES)) {
      const portraitMatch =
        Math.abs(dimensions.width - w) < 0.1 &&
        Math.abs(dimensions.height - h) < 0.1;
      const landscapeMatch =
        Math.abs(dimensions.width - h) < 0.1 &&
        Math.abs(dimensions.height - w) < 0.1;

      if (portraitMatch || landscapeMatch) {
        if (paperSize !== sizeName) {
          onPaperSizeChange(sizeName);
        }
        return;
      }
    }
    // If no match found, set to Custom
    if (paperSize !== 'Custom') {
      onPaperSizeChange('Custom');
    }
  };

  return (
    <aside className="w-80 border-r bg-background flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Paper Size</label>
            <Select value={paperSize} onValueChange={handlePaperSizeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(PAPER_SIZES).map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Orientation</label>
            <Select
              value={orientation}
              onValueChange={(value) =>
                handleOrientationChange(value as Orientation)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select orientation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Width (mm)</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => handleWidthChange(e.target.value)}
              min="1"
              step="0.1"
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Height (mm)</label>
            <Input
              type="number"
              value={height}
              onChange={(e) => handleHeightChange(e.target.value)}
              min="1"
              step="0.1"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
