import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Orientation } from '@/components/CustomSidebar';
import { PAPER_SIZES } from '@/constants';
import { type PaperSize } from '@/types';

interface GuidelinesPropertiesContextType {
  paperSize: string;
  orientation: Orientation;
  width: number;
  height: number;
  setPaperSize: (size: string) => void;
  setOrientation: (orientation: Orientation) => void;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
}

const GuidelinesPropertiesContext = createContext<
  GuidelinesPropertiesContextType | undefined
>(undefined);

const DEFAULT_PAPER_SIZE: PaperSize = 'A4';
const defaultDimensions = PAPER_SIZES[DEFAULT_PAPER_SIZE];

export function GuidelinesPropertiesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [paperSize, setPaperSize] = useState<string>(DEFAULT_PAPER_SIZE);
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [width, setWidth] = useState<number>(defaultDimensions.width);
  const [height, setHeight] = useState<number>(defaultDimensions.height);

  return (
    <GuidelinesPropertiesContext.Provider
      value={{
        paperSize,
        orientation,
        width,
        height,
        setPaperSize,
        setOrientation,
        setWidth,
        setHeight,
      }}
    >
      {children}
    </GuidelinesPropertiesContext.Provider>
  );
}

export function useGuidelinesProperties() {
  const context = useContext(GuidelinesPropertiesContext);
  if (context === undefined) {
    throw new Error(
      'useGuidelinesProperties must be used within a GuidelinesPropertiesProvider'
    );
  }
  return context;
}
