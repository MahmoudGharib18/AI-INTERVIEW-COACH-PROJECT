import React, { useEffect, useRef } from 'react';

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
  readOnly = false 
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically loading Monaco distribution layer from cdn infrastructure securely
    if (!(window as any).monaco) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs/loader.min.js';
      script.async = true;
      script.onload = () => {
        (window as any).require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' } });
        (window as any).require(['vs/editor/main'], () => {
          initializeEditor();
        });
      };
      document.body.appendChild(script);
    } else {
      initializeEditor();
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  const initializeEditor = () => {
    if (!containerRef.current || (window as any).monaco) return;
    
    const monaco = (window as any).monaco;
    
    // Custom theme configuration matching core brutal canvas parameters
    monaco.editor.defineTheme('cyberBrutalTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff5500', fontStyle: 'bold' },
        { token: 'string', foreground: '00ff66' },
        { token: 'number', foreground: 'ffb86c' }
      ],
      colors: {
        'editor.background': '#0a0a0c',
        'editor.foreground': '#f8f8f2',
        'editorLineNumber.foreground': '#26262b',
        'editorLineNumber.activeForeground': '#00ff66',
        'editor.lineHighlightBackground': '#121215',
      }
    });

    editorRef.current = monaco.editor.create(containerRef.current, {
      value: code,
      language: language,
      theme: 'cyberBrutalTheme',
      automaticLayout: true,
      readOnly: readOnly,
      fontSize: 12,
      fontFamily: 'monospace',
      minimap: { enabled: false },
      lineNumbers: 'on',
      scrollbar: { vertical: 'visible', horizontal: 'visible' }
    });

    editorRef.current.onDidChangeModelContent(() => {
      if (!readOnly && onChange) {
        onChange(editorRef.current.getValue());
      }
    });
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== code) {
      editorRef.current.setValue(code);
    }
  }, [code]);

  return (
    <div className="w-full h-full flex flex-col border-2 border-[#26262b] bg-[#0a0a0c]">
      <div className="bg-[#121215] border-b border-[#26262b] px-3 py-1.5 flex justify-between items-center text-[10px] font-mono text-[#8a8a93]">
        <span>EDITOR_INSTANCE // ENV: {language.toUpperCase()}</span>
        <span>{readOnly ? '🔐 LOCKED_MODE' : '🔓 READ_WRITE'}</span>
      </div>
      <div ref={containerRef} className="flex-1 w-full min-h-[350px]" />
    </div>
  );
};