import React, { useState } from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from './extensions/fontsize';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import BubbleMenuComponent from './BubbleMenu';
import FloatingMenuComponent from './FloatingMenu';
import EditorMenuBar from './EditorMenuBar';
import ColorPicker from './ColorPicker';
import FontStylePicker from './FontStylePicker';
import TableMenu from './TableMenu';
import AIAssistantPanel from './AIAssistantPanel';
import CodeBlock from './CodeBlock';
import { useEditorState } from '../../hooks/useEditorState';
import { useAIFeatures } from '../../hooks/useAIFeatures';
import { AIFeature } from '../../types/editorTypes';
import { ImageUploader } from './extensions/image-uploader';
import ImageResize from 'tiptap-extension-resize-image';

//Lowlight
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { all, createLowlight } from 'lowlight';

const lowlight = createLowlight(all);

lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

const RichTextEditor: React.FC = () => {
  const [showAIPanel, setShowAIPanel] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: false,
      }),
      CodeBlockLowlight.extend({
        addNodeView: () => ReactNodeViewRenderer(CodeBlock),
      }).configure({ lowlight }),
      // CodeBlockLowlight.configure({
      //   lowlight,
      // }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      ImageResize,
      ImageUploader,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline',
        },
      }),
      TextStyle,
      FontFamily,
      FontSize.configure({
        types: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl'],
        defaultSize: 'text-base',
      }),
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border dark:border-gray-700',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border dark:border-gray-700 p-2',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class:
            'border dark:border-gray-700 p-2 bg-gray-100 dark:bg-gray-800 font-semibold',
        },
      }),
    ],
    content: `
      <h1>Rich Text Editor</h1>
      <p>Welcome to this modern rich text editor with advanced features!</p>
      <p>Try out different formatting options from the menu bar or select text to see the bubble menu.</p>
      <p>Type "/" in an empty line to see the floating menu with block-level options.</p>
      <blockquote>Use AI-powered features to enhance your writing experience.</blockquote>
      <p>This editor supports tables, code blocks, images, and more...</p>
    `,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg dark:prose-invert focus:outline-none max-w-none min-h-[300px] p-5 font-sans',
      },
    },
  });

  const editorState = useEditorState(editor);
  const {
    isProcessing,
    aiSuggestion,
    getTextCompletion,
    checkGrammar,
    getSuggestions,
    acceptSuggestion,
    rejectSuggestion,
  } = useAIFeatures(editor);

  const handleAIFeatureRequest = (feature: AIFeature) => {
    setShowAIPanel(true);

    switch (feature) {
      case AIFeature.TEXT_COMPLETION:
        getTextCompletion();
        break;
      case AIFeature.GRAMMAR_CHECK:
        checkGrammar();
        break;
      case AIFeature.STYLE_SUGGESTIONS:
        getSuggestions();
        break;
      default:
        console.log(`AI feature not implemented: ${feature}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300 max-w-4xl mx-auto">
      {editor && (
        <>
          <EditorMenuBar
            editor={editor}
            onAIFeatureRequest={handleAIFeatureRequest}
          />

          <div className="relative">
            <div className="flex items-center gap-2 absolute top-3 right-3 z-10">
              <ColorPicker editor={editor} />
              <FontStylePicker editor={editor} />
            </div>

            <BubbleMenuComponent
              editor={editor}
              onAIFeatureRequest={handleAIFeatureRequest}
            />
            <FloatingMenuComponent
              editor={editor}
              onAIFeatureRequest={handleAIFeatureRequest}
            />

            <EditorContent editor={editor} className="min-h-[500px]" />

            <TableMenu editor={editor} />
          </div>

          {showAIPanel && (
            <div className="p-4 pt-0">
              <AIAssistantPanel
                isProcessing={isProcessing}
                aiSuggestion={aiSuggestion}
                onRequestFeature={handleAIFeatureRequest}
                onAcceptSuggestion={acceptSuggestion}
                onRejectSuggestion={rejectSuggestion}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RichTextEditor;
