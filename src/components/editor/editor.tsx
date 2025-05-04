import { Content, EditorContent, useEditor } from '@tiptap/react';
import React, { useState } from 'react';
import { useAIFeatures } from './hooks/useAIFeatures';
import { useEditorState } from './hooks/useEditorState';
import { AIFeature } from './constants';
import { extensions } from './extensions';
import AIAssistantPanel from './ui/AI-assistant-panel';
import BubbleMenuComponent from './ui/bubble-menu';
import ColorPicker from './ui/color-picker';
import EditorMenuBar from './ui/editor-menu-bar';
import FloatingMenuComponent from './ui/floating-menu';
import FontStylePicker from './ui/font-style-picker';
import TableMenu from './ui/table-menu';

const RichTextEditor: React.FC = ({
  content,
  onChange,
}: {
  content?: Content;
  onChange?: (content: Content) => void;
}) => {
  const [showAIPanel, setShowAIPanel] = useState(false);

  const editor = useEditor({
    extensions: extensions({}),
    content,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg dark:prose-invert focus:outline-none max-w-none min-h-[300px] p-5 font-sans',
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
