"use client";

import React, { useRef, useEffect } from "react";
import Editor, { useMonaco, loader } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";

// Configure Monaco to use a reliable CDN (unpkg) to avoid issues in some regions
loader.config({
  paths: {
    vs: "https://unpkg.com/monaco-editor@0.44.0/min/vs",
  },
});

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: EditorProps) {
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);

  // User requested code area to remain unchanged (Dark/VS Code style) regardless of system theme
  // We lock it to vs-dark
  const editorTheme = "vs-dark";

  useEffect(() => {
    if (monaco) {
      // Ensure we are using the dark theme
      monaco.editor.setTheme("vs-dark");
    }
  }, [monaco]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="h-full w-full relative bg-[#1e1e1e]">
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        onChange={(val) => onChange(val || "")}
        theme={editorTheme}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading Editor...
          </div>
        }
        options={{
          minimap: { enabled: false },
          fontSize: 16,
          wordWrap: "on",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          fontFamily: "var(--font-geist-mono)",
          renderLineHighlight: "all",
        }}
      />
    </div>
  );
}
