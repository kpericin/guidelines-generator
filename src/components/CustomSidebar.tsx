import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  onPaperSizeChange: (size: string) => void;
  onOrientationChange: (orientation: Orientation) => void;
}

export function CustomSidebar({
  paperSize,
  orientation,
  onPaperSizeChange,
  onOrientationChange,
}: CustomSidebarProps) {
  return (
    <aside className="w-76 border-r bg-background flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Paper Size</label>
            <Select value={paperSize} onValueChange={onPaperSizeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(PAPER_SIZES).map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Orientation</label>
            <Select
              value={orientation}
              onValueChange={(value) =>
                onOrientationChange(value as Orientation)
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
      </div>
    </aside>
  );
}
