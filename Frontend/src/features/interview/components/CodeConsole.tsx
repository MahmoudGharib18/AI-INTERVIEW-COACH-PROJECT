import React, { useEffect, useRef } from 'react';
import Editor, { type OnMount, type OnChange } from '@monaco-editor/react';

interface CodeConsoleProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export const CodeConsole: React.FC<CodeConsoleProps> = ({
  code,
  onChange,
  language = 'javascript',
  readOnly = false,
}) => {
  const editorRef = useRef<any>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme('cyberBrutalTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff5500', fontStyle: 'bold' },
        { token: 'string', foreground: '00ff66' },
        { token: 'number', foreground: 'ffb86c' },
      ],
      colors: {
        'editor.background': '#0a0a0c',
        'editor.foreground': '#f8f8f2',
        'editorLineNumber.foreground': '#26262b',
        'editorLineNumber.activeForeground': '#00ff66',
        'editor.lineHighlightBackground': '#121215',
      },
    });
    monaco.editor.setTheme('cyberBrutalTheme');
  };

  const handleChange: OnChange = (value) => {
    if (!readOnly) {
      onChange(value ?? '');
    }
  };

  return (
    <div className="w-full h-full flex flex-col border-2 border-[#26262b] bg-[#0a0a0c]">
      <div className="bg-[#121215] border-b border-[#26262b] px-3 py-1.5 flex justify-between items-center text-[10px] font-mono text-[#8a8a93]">
        <span>EDITOR_INSTANCE // ENV: {language.toUpperCase()}</span>
        <span>{readOnly ? '🔐 LOCKED_MODE' : '🔓 READ_WRITE'}</span>
      </div>
      <div className="flex-1 w-full min-h-[350px]">
        <Editor
          value={code}
          language={language}
          onMount={handleMount}
          onChange={handleChange}
          options={{
            readOnly,
            fontSize: 12,
            fontFamily: 'monospace',
            minimap: { enabled: false },
            lineNumbers: 'on',
            automaticLayout: true,
            scrollbar: { vertical: 'visible', horizontal: 'visible' },
          }}
          theme="vs-dark"
          loading={
            <div className="w-full h-full flex items-center justify-center text-xs text-[#8a8a93] uppercase">
              Loading editor...
            </div>
          }
        />
      </div>
    </div>
  );
};