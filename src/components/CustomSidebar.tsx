import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from '@/components/ui/input-group';
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldContent,
} from '@/components/ui/field';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link, Link2Off } from 'lucide-react';
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
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    marginsLinked,
    setPaperSize,
    setOrientation,
    setWidth,
    setHeight,
    setMarginTop,
    setMarginBottom,
    setMarginLeft,
    setMarginRight,
    setMarginsLinked,
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

  const handleMarginChange = (value: string, setter: (val: number) => void) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setter(numValue);
      // If linked, update all margins to the same value
      if (marginsLinked) {
        setMarginTop(numValue);
        setMarginBottom(numValue);
        setMarginLeft(numValue);
        setMarginRight(numValue);
      }
    }
  };

  const handleToggleLinked = () => {
    const newLinked = !marginsLinked;
    setMarginsLinked(newLinked);
    // If linking, set all margins to the current top margin
    if (newLinked) {
      setMarginBottom(marginTop);
      setMarginLeft(marginTop);
      setMarginRight(marginTop);
    }
  };

  return (
    <aside className="w-80 border-r bg-background flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <Accordion type="single" collapsible defaultValue="paper-layout">
          <AccordionItem value="paper-layout">
            <AccordionTrigger>Paper & Layout</AccordionTrigger>
            <AccordionContent>
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
                    <FieldLabel>Width</FieldLabel>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupInput
                          type="number"
                          value={width}
                          onChange={(e) => handleWidthChange(e.target.value)}
                          min="1"
                          step="1"
                        />
                        <InputGroupAddon align="inline-end">mm</InputGroupAddon>
                      </InputGroup>
                    </FieldContent>
                  </Field>

                  <Field className="flex-1">
                    <FieldLabel>Height</FieldLabel>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupInput
                          type="number"
                          value={height}
                          onChange={(e) => handleHeightChange(e.target.value)}
                          min="1"
                          step="1"
                        />
                        <InputGroupAddon align="inline-end">mm</InputGroupAddon>
                      </InputGroup>
                    </FieldContent>
                  </Field>
                </div>

                <div className="pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-sm font-medium">Margins</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleToggleLinked}
                      aria-label={
                        marginsLinked ? 'Unlink margins' : 'Link margins'
                      }
                    >
                      {marginsLinked ? (
                        <Link className="h-4 w-4" />
                      ) : (
                        <Link2Off className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field>
                      <FieldLabel>Top</FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            value={marginTop}
                            onChange={(e) =>
                              handleMarginChange(e.target.value, setMarginTop)
                            }
                            min="0"
                            step="1"
                          />
                          <InputGroupAddon align="inline-end">
                            mm
                          </InputGroupAddon>
                        </InputGroup>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>Bottom</FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            value={marginBottom}
                            onChange={(e) =>
                              handleMarginChange(
                                e.target.value,
                                setMarginBottom
                              )
                            }
                            min="0"
                            step="1"
                          />
                          <InputGroupAddon align="inline-end">
                            mm
                          </InputGroupAddon>
                        </InputGroup>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>Left</FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            value={marginLeft}
                            onChange={(e) =>
                              handleMarginChange(e.target.value, setMarginLeft)
                            }
                            min="0"
                            step="1"
                          />
                          <InputGroupAddon align="inline-end">
                            mm
                          </InputGroupAddon>
                        </InputGroup>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>Right</FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            value={marginRight}
                            onChange={(e) =>
                              handleMarginChange(e.target.value, setMarginRight)
                            }
                            min="0"
                            step="1"
                          />
                          <InputGroupAddon align="inline-end">
                            mm
                          </InputGroupAddon>
                        </InputGroup>
                      </FieldContent>
                    </Field>
                  </div>
                </div>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
}
