import { Moon, Sun, Download } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  onExportPDF: () => void;
}

export function AppHeader({ onExportPDF }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b bg-background px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Guidelines Generator</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={onExportPDF}
            variant="outline"
            size="default"
            aria-label="Export as PDF"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
