import { AppHeader } from './components/AppHeader';
import { CustomSidebar } from './components/CustomSidebar';

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <CustomSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Content area - scrollable both vertically and horizontally */}
            <div className="min-w-full min-h-full">
              <h2 className="text-xl font-semibold mb-4">Content Area</h2>
              <p className="text-muted-foreground">
                This is the main content area. It will scroll both vertically
                and horizontally if the content overflows.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
