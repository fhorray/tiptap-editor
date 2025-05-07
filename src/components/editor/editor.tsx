import { cn } from '@/lib/utils';
import { Content, EditorContent, useEditor } from '@tiptap/react';
import React, { useState } from 'react';
import { AIFeature } from './constants';
import { extensions } from './extensions';
import { useAIFeatures } from './hooks/use-AI-features';
import { useEditorState } from './hooks/use-editor-state';
import AIAssistantPanel from './ui/AI-assistant-panel';
import BubbleMenuComponent from './ui/bubble-menu';
import CharacterCount from './ui/character-count';
import EditorMenuBar from './ui/editor-menu-bar';
import FloatingMenuComponent from './ui/floating-menu';
import TableMenu from './ui/table-menu';

const RichTextEditor = ({
  content,
  onChange,
  useAi = false,
  options = {},
}: {
  content?: Content;
  onChange?: (content: Content) => void;
  useAi?: boolean;
  options?: {
    editorHeight?: number;
  };
}) => {
  const [showAIPanel, setShowAIPanel] = useState(false);

  const editor = useEditor({
    extensions: extensions({}),
    content,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg dark:prose-invert focus:outline-none max-w-none h-full p-5 font-sans',
      },
    },
    onUpdate: (editor) => {
      onChange?.(editor.editor.getHTML());
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
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300 w-full mx-auto">
      {editor && (
        <>
          <EditorMenuBar
            editor={editor}
            useAi={useAi}
            onAIFeatureRequest={handleAIFeatureRequest}
          />

          <div
            className={cn(
              'relative h-full min-h-[300px]',
              options?.editorHeight,
            )}
          >
            <div className="flex items-center gap-2 absolute top-3 right-3 z-10"></div>

            <BubbleMenuComponent
              editor={editor}
              useAi={useAi}
              onAIFeatureRequest={handleAIFeatureRequest}
            />
            <FloatingMenuComponent
              editor={editor}
              useAi={useAi}
              onAIFeatureRequest={handleAIFeatureRequest}
            />

            <EditorContent editor={editor} className="h-full" />

            <TableMenu editor={editor} />
          </div>

          <div className="p-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
            <CharacterCount editor={editor} />
          </div>

          {showAIPanel && useAi && (
            <div className="relative p-4 pt-0">
              <AIAssistantPanel
                isProcessing={isProcessing}
                aiSuggestion={aiSuggestion}
                onRequestFeature={handleAIFeatureRequest}
                onAcceptSuggestion={acceptSuggestion}
                onRejectSuggestion={rejectSuggestion}
                onOpenChange={setShowAIPanel}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RichTextEditor;
