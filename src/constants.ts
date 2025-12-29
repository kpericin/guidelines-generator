type PaperDimensions = {
  width: number;
  height: number;
};

export const PAPER_SIZE_KEYS = [
  'Letter',
  'Legal',
  'Tabloid',
  'Ledger',
  'Executive',
  'A3',
  'A4',
  'A5',
  'A6',
  'A7',
  'A8',
] as const;

export type PaperSize = (typeof PAPER_SIZE_KEYS)[number];

export const PAPER_SIZES: Record<PaperSize, PaperDimensions> = {
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
