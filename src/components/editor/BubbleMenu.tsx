import React from 'react';
import { BubbleMenu as TiptapBubbleMenu, Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Link,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Palette,
} from 'lucide-react';
import { AIFeature } from '../../types/editorTypes';

interface BubbleMenuProps {
  editor: Editor;
  onAIFeatureRequest?: (feature: AIFeature) => void;
}

const BubbleMenu: React.FC<BubbleMenuProps> = ({
  editor,
  onAIFeatureRequest,
}) => {
  const [showHighlightColors, setShowHighlightColors] = React.useState(false);

  const buttonClass = (active: boolean) =>
    `p-1.5 rounded-md transition-all duration-200 ${
      active
        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
    } text-gray-700 dark:text-gray-300`;

  const highlightColors = [
    { color: 'yellow', class: 'bg-yellow-200' },
    { color: 'red', class: 'bg-red-200' },
    { color: 'green', class: 'bg-green-200' },
    { color: 'blue', class: 'bg-blue-200' },
    { color: 'purple', class: 'bg-purple-200' },
  ];

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 200,
        placement: 'top',
        offset: [0, 8],
      }}
      className="w-fit bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-1.5 flex items-center gap-1"
      shouldShow={({ editor, view, state, from, to }) => {
        return (
          from !== to &&
          !editor.isActive('codeBlock') &&
          !editor.isActive('table')
        );
      }}
    >
      {/* Basic Formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
        aria-label="Bold"
      >
        <Bold size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
        aria-label="Italic"
      >
        <Italic size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive('underline'))}
        aria-label="Underline"
      >
        <Underline size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive('strike'))}
        aria-label="Strikethrough"
      >
        <Strikethrough size={16} />
      </button>

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-700"></div>

      {/* Quick Heading */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 1 }))}
        aria-label="Heading 1"
      >
        <Heading1 size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 2 }))}
        aria-label="Heading 2"
      >
        <Heading2 size={16} />
      </button>

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-700"></div>

      {/* Highlight and Link */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowHighlightColors(!showHighlightColors)}
          className={buttonClass(editor.isActive('highlight'))}
          aria-label="Highlight"
        >
          <Palette size={16} />
        </button>

        {showHighlightColors && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-1 grid grid-cols-5 gap-1">
            {highlightColors.map(({ color, class: bgClass }) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHighlight({ color }).run();
                  setShowHighlightColors(false);
                }}
                className={`w-6 h-6 rounded-md ${bgClass} hover:ring-2 hover:ring-offset-2 hover:ring-gray-400`}
                aria-label={`Highlight ${color}`}
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('Enter URL', previousUrl);

          if (url === null) {
            return;
          }

          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }

          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
        }}
        className={buttonClass(editor.isActive('link'))}
        aria-label="Link"
      >
        <Link size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={buttonClass(editor.isActive('code'))}
        aria-label="Inline Code"
      >
        <Code size={16} />
      </button>

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-700"></div>

      {/* Text Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={buttonClass(editor.isActive({ textAlign: 'left' }))}
        aria-label="Align Left"
      >
        <AlignLeft size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={buttonClass(editor.isActive({ textAlign: 'center' }))}
        aria-label="Align Center"
      >
        <AlignCenter size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={buttonClass(editor.isActive({ textAlign: 'right' }))}
        aria-label="Align Right"
      >
        <AlignRight size={16} />
      </button>

      {/* AI Feature */}
      {onAIFeatureRequest && (
        <>
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-700"></div>
          <button
            type="button"
            onClick={() => onAIFeatureRequest(AIFeature.TEXT_COMPLETION)}
            className="p-1.5 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 dark:text-purple-400 transition-all duration-200"
            aria-label="AI Assistance"
          >
            <Sparkles size={16} />
          </button>
        </>
      )}
    </TiptapBubbleMenu>
  );
};

export default BubbleMenu;
