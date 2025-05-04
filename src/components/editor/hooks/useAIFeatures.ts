import api from '@/api';
import { Editor } from '@tiptap/react';
import { useCallback, useState } from 'react';

export const useAIFeatures = (editor: Editor | null) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // Simulated AI text completion
  const getTextCompletion = useCallback(async () => {
    if (!editor) return;

    setIsProcessing(true);

    try {
      const content = editor.getText();
      const lang = 'en';
      const action = 'complete_text';
      const context = 'Continue in the same style and tone';

      if (!content.trim()) {
        console.error('Editor content is empty');
        setIsProcessing(false);
        return;
      }

      console.log('Request payload:', { content, lang, action, context });

      const response = await api.post('/ai/rc', {
        content,
        lang,
        action,
        context,
      });

      console.log('Response:', response.data);

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { status, data } = response.data;

      if (status === 'success' && data) {
        const aiSuggestion = data.result || '';
        setAiSuggestion(aiSuggestion);
      } else if (status === 'error') {
        console.error('API error:', response.data.message);
        setIsProcessing(false);
        return;
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Error fetching AI completion:', error);
      setIsProcessing(false);
    }
  }, [editor]);

  // Check Grammar
  const checkGrammar = useCallback(async () => {
    if (!editor) return;

    setIsProcessing(true);

    try {
      const content = editor.getText();
      const lang = 'en';
      const action = 'check_grammar';

      if (!content.trim()) {
        console.error('Editor content is empty');
        setIsProcessing(false);
        return;
      }

      console.log('Request payload:', { content, lang, action });

      const response = await api.post('/ai/rc', {
        content,
        lang,
        action,
      });

      console.log('Response:', response.data);

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { status, data } = response.data;

      if (status === 'success' && data) {
        const aiSuggestion = data.result || '';
        setAiSuggestion(aiSuggestion); // HTML-formatted list of corrections
      } else if (status === 'error') {
        console.error('API error:', response.data.message);
        setIsProcessing(false);
        return;
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Error checking grammar:', error);
      setIsProcessing(false);
    }
  }, [editor]);

  const getSuggestions = useCallback(async () => {
    if (!editor) return;

    setIsProcessing(true);

    try {
      const content = editor.getText();
      const lang = 'en';
      const action = 'style_suggestion';

      if (!content.trim()) {
        console.error('Editor content is empty');
        setIsProcessing(false);
        return;
      }

      console.log('Request payload:', { content, lang, action });

      const response = await api.post('/ai/rc', {
        content,
        lang,
        action,
      });

      console.log('Response:', response.data);

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { status, data } = response.data;

      if (status === 'success' && data) {
        const aiSuggestion = data.result || '';
        setAiSuggestion(aiSuggestion); // HTML-formatted list of suggestions
      } else if (status === 'error') {
        console.error('API error:', response.data.message);
        setIsProcessing(false);
        return;
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Error getting style suggestions:', error);
      setIsProcessing(false);
    }
  }, [editor]);

  // Accept the AI suggestion
  const acceptSuggestion = useCallback(() => {
    if (!editor || !aiSuggestion) return;

    // In a real implementation, this would apply the suggestion to the editor
    editor.commands.insertContent(aiSuggestion);
    // window.alert("AI Text")

    setAiSuggestion(null);
  }, [editor, aiSuggestion]);

  // Reject the AI suggestion
  const rejectSuggestion = useCallback(() => {
    setAiSuggestion(null);
  }, []);

  return {
    isProcessing,
    aiSuggestion,
    getTextCompletion,
    checkGrammar,
    getSuggestions,
    acceptSuggestion,
    rejectSuggestion,
  };
};