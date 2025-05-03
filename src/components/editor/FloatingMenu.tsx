import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Table,
  Sparkles,
  Brain,
  Wand2,
  FileSearch,
  MessageSquareText,
  UploadIcon,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AIFeature } from '../../types/editorTypes';

interface FloatingMenuProps {
  editor: Editor;
  onAIFeatureRequest?: (feature: AIFeature) => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({
  editor,
  onAIFeatureRequest,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonClass =
    'flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-gray-700 dark:text-gray-300';
  const sectionClass =
    'border-b border-gray-200 dark:border-gray-700 pb-1 mb-1 last:border-0 last:pb-0 last:mb-0';

  useEffect(() => {
    const handleSelectionUpdate = () => {
      const { $from } = editor.state.selection;
      const currentLineText = $from.nodeBefore?.textContent || '';

      const isStartOfParagraph =
        $from.parent.type.name === 'paragraph' &&
        $from.parent.textContent.length <= 1;
      const hasSlashPrefix = currentLineText === '/';

      if (isStartOfParagraph && hasSlashPrefix) {
        editor.commands.deleteRange({
          from: $from.pos - 1,
          to: $from.pos,
        });
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="absolute" style={{ visibility: 'hidden' }} />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="left"
        sideOffset={8}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-1.5 flex flex-col gap-1 min-w-[200px] max-h-[80vh] overflow-y-auto"
      >
        {/* Basic Blocks */}
        <div className={sectionClass}>
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
              setIsOpen(false);
            }}
            className={buttonClass}
          >
            <Heading1 size={16} /> <span>Heading 1</span>
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
              setIsOpen(false);
            }}
            className={buttonClass}
          >
            <Heading2 size={16} /> <span>Heading 2</span>
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
              setIsOpen(false);
            }}
            className={buttonClass}
          >
            <Heading3 size={16} /> <span>Heading 3</span>
          </button>
        </div>

        {/* Lists and Quotes */}
        <div className={sectionClass}>
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleBulletList().run();
              setIsOpen(false);
            }}
            className={buttonClass}
          >
            <List size={16} /> <span>Bullet List</span>
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run();
              setIsOpen(false);
            }}
            className={buttonClass}
          >
            <ListOrdered size={16} /> <span>Ordered List</span>
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleBlockquote().run();
              setIsOpen(false);
            }}
            className={buttonClass}
          >
            <Quote size={16} /> <span>Blockquote</span>
          </button>
        </div>

        {/* Code and Media */}
        <div className={sectionClass}>
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleCodeBlock().run();
              setIsOpen(false);
            }}
            className={buttonClass}
          >
            <Code size={16} /> <span>Code Block</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setImageUploader().run()}
            className={buttonClass}
          >
            <UploadIcon size={16} /> <span>Upload Image</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const url = window.prompt('Enter the image URL:');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
              setIsOpen(false);
            }}
            className={buttonClass}
          >
            <Image size={16} /> <span>Image</span>
          </button>

          <button
            type="button"
            onClick={() => {
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run();
              setIsOpen(false);
            }}
            className={buttonClass}
          >
            <Table size={16} /> <span>Table</span>
          </button>
        </div>

        {/* AI Features */}
        {onAIFeatureRequest && (
          <div className={sectionClass}>
            <button
              type="button"
              onClick={() => {
                onAIFeatureRequest(AIFeature.TEXT_COMPLETION);
                setIsOpen(false);
              }}
              className={buttonClass}
            >
              <Sparkles size={16} /> <span>Complete Text</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onAIFeatureRequest(AIFeature.GRAMMAR_CHECK);
                setIsOpen(false);
              }}
              className={buttonClass}
            >
              <Brain size={16} /> <span>Check Grammar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onAIFeatureRequest(AIFeature.STYLE_SUGGESTIONS);
                setIsOpen(false);
              }}
              className={buttonClass}
            >
              <Wand2 size={16} /> <span>Style Suggestions</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onAIFeatureRequest(AIFeature.CONTENT_SUMMARY);
                setIsOpen(false);
              }}
              className={buttonClass}
            >
              <FileSearch size={16} /> <span>Summarize</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onAIFeatureRequest(AIFeature.CODE_SUGGESTIONS);
                setIsOpen(false);
              }}
              className={buttonClass}
            >
              <MessageSquareText size={16} /> <span>Code Suggestions</span>
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default FloatingMenu;
