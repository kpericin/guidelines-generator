import { AppHeader } from './components/AppHeader';
import { CustomSidebar } from './components/CustomSidebar';
import { GuidelinesCanvas } from './components/GuidelinesCanvas';

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <CustomSidebar />
        <main className="flex-1 overflow-auto">
          <GuidelinesCanvas />
        </main>
      </div>
    </div>
  );
}

export default App;
