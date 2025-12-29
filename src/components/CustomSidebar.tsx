import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  FieldSet,
  FieldLegend,
  FieldGroup,
  Field,
  FieldLabel,
  FieldContent,
} from '@/components/ui/field';
import { useGuidelinesProperties } from '@/contexts/GuidelinesPropertiesContext';
import { PAPER_SIZES } from '@/constants';
import { isPaperSize } from '@/types';

export type Orientation = 'portrait' | 'landscape';

export function CustomSidebar() {
  const {
    paperSize,
    orientation,
    width,
    height,
    setPaperSize,
    setOrientation,
    setWidth,
    setHeight,
  } = useGuidelinesProperties();
  const handlePaperSizeChange = (size: string) => {
    setPaperSize(size);
    if (isPaperSize(size)) {
      const paperDimensions = PAPER_SIZES[size];
      let newWidth: number = paperDimensions.width;
      let newHeight: number = paperDimensions.height;

      // Apply orientation swap if in landscape
      if (orientation === 'landscape') {
        [newWidth, newHeight] = [newHeight, newWidth];
      }

      setWidth(newWidth);
      setHeight(newHeight);
    }
  };

  const handleOrientationChange = (newOrientation: Orientation) => {
    setOrientation(newOrientation);
    // Swap width and height when orientation changes
    setWidth(height);
    setHeight(width);
  };

  const handleWidthChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setWidth(numValue);
      // Check if the new dimensions match any predefined size
      checkAndUpdatePaperSize(numValue, height);
    }
  };

  const handleHeightChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setHeight(numValue);
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
          setPaperSize(sizeName);
        }
        return;
      }
    }
    // If no match found, set to Custom
    if (paperSize !== 'Custom') {
      setPaperSize('Custom');
    }
  };

  return (
    <aside className="w-80 border-r bg-background flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <FieldSet>
          <FieldLegend>Paper Settings</FieldLegend>
          <FieldGroup>
            <div className="flex gap-2">
              <Field className="flex-1">
                <FieldLabel>Paper Size</FieldLabel>
                <FieldContent>
                  <Select
                    value={paperSize}
                    onValueChange={handlePaperSizeChange}
                  >
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
                </FieldContent>
              </Field>

              <Field className="flex-1">
                <FieldLabel>Orientation</FieldLabel>
                <FieldContent>
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
                </FieldContent>
              </Field>
            </div>

            <div className="flex gap-2">
              <Field className="flex-1">
                <FieldLabel>Width (mm)</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    min="1"
                    step="0.1"
                  />
                </FieldContent>
              </Field>

              <Field className="flex-1">
                <FieldLabel>Height (mm)</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    min="1"
                    step="0.1"
                  />
                </FieldContent>
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
      </div>
    </aside>
  );
}
