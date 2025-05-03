import React from 'react';
import RichTextEditor from './components/editor/RichTextEditor';
import { ThemeProvider } from './context/ThemeContext';
import { Feather } from 'lucide-react';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <main className=" mx-auto px-4 py-6">
          <RichTextEditor />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
