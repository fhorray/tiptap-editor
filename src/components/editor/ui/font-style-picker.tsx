import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Type } from 'lucide-react';
import { FontFamily, FontSize } from '../constants';

interface FontStylePickerProps {
  editor: Editor | null;
}

const FontStylePicker: React.FC<FontStylePickerProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!editor) return null;

  const fontFamilies = Object.entries(FontFamily).map(([key, value]) => ({
    name: key.charAt(0) + key.slice(1).toLowerCase(),
    value,
  }));

  const fontSizes = Object.entries(FontSize).map(([key, value]) => ({
    name: key,
    value,
  }));

  const setFontFamily = (fontFamily: string) => {
    if (!editor) return;

    editor.chain().focus().setFontFamily(fontFamily).run();

    setIsOpen(false);
  };

  const setFontSize = (fontSize: string) => {
    if (!editor) return;

    editor.chain().focus().setFontSize(`text-${fontSize}`).run();

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200"
        aria-label="Font Styles"
      >
        <Type size={18} />
      </button>

      {isOpen && (
        <div className="absolute z-20 top-full mt-1 left-0 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-2 w-48">
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Font Family
            </label>
            <div className="space-y-1">
              {fontFamilies.map(({ name, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFontFamily(value)}
                  className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-${value}`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Font Size
            </label>
            <div className="grid grid-cols-3 gap-1">
              {fontSizes.map(({ name, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFontSize(value)}
                  className={`text-center px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontStylePicker;
