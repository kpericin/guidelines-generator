import { PAPER_SIZES, type PaperSize } from './constants';

export type { PaperSize };

export function isPaperSize(size: string): size is PaperSize {
  return size in PAPER_SIZES;
}
