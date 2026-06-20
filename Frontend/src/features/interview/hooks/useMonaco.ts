import { useState } from 'react';

export const useMonaco = (initialLanguage = 'javascript') => {
  const [code, setCode] = useState('// Initialize algorithmic logic here...');
  const [language, setLanguage] = useState(initialLanguage);

  const editorOptions = {
    theme: 'vs-dark',
    fontFamily: 'Fira Code, JetBrains Mono, Courier New, monospace',
    fontSize: 14,
    lineHeight: 22,
    minimap: { enabled: false },
    scrollbar: { vertical: 'visible', horizontal: 'visible' },
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'block',
    cursorBlinking: 'blink',
    automaticLayout: true,
    padding: { top: 12, bottom: 12 }
  };

  return { code, setCode, language, setLanguage, editorOptions };
};