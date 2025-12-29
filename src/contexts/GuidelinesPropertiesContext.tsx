import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Orientation } from '@/components/CustomSidebar';
import { PAPER_SIZES } from '@/constants';
import { type PaperSize } from '@/types';

interface GuidelinesPropertiesContextType {
  paperSize: string;
  orientation: Orientation;
  width: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  marginsLinked: boolean;
  setPaperSize: (size: string) => void;
  setOrientation: (orientation: Orientation) => void;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setMarginTop: (margin: number) => void;
  setMarginBottom: (margin: number) => void;
  setMarginLeft: (margin: number) => void;
  setMarginRight: (margin: number) => void;
  setMarginsLinked: (linked: boolean) => void;
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
  const [marginTop, setMarginTop] = useState<number>(10);
  const [marginBottom, setMarginBottom] = useState<number>(10);
  const [marginLeft, setMarginLeft] = useState<number>(10);
  const [marginRight, setMarginRight] = useState<number>(10);
  const [marginsLinked, setMarginsLinked] = useState<boolean>(true);

  return (
    <GuidelinesPropertiesContext.Provider
      value={{
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
