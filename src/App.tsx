import { Toaster } from 'sonner';
import RichTextEditor from './components/editor/editor';
import { ThemeProvider } from './components/editor/theme-context';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <main className=" mx-auto px-4 py-6">
          <RichTextEditor useAi />
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
