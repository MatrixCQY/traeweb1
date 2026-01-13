"use client";

import React, { useState, useEffect } from "react";
import { MarkdownEditor } from "@/components/editor";
import { MarkdownPreview } from "@/components/preview";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { useFileSystem } from "@/hooks/use-file-system";
import { cn } from "@/lib/utils";
import { Columns, Eye, Code2 } from "lucide-react";

export default function Home() {
  const fileSystem = useFileSystem();
  const { files, activeFileId, updateFileContent } = fileSystem;
  
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeFile = activeFileId ? files[activeFileId] : null;

  const handleContentChange = (newContent: string) => {
    if (activeFileId) {
      updateFileContent(activeFileId, newContent);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden">
      <Navbar fileSystem={fileSystem} />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={cn(
          "h-full transition-all duration-300 ease-in-out border-r border-border bg-card",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden border-r-0"
        )}>
           <Sidebar fileSystem={fileSystem} />
        </div>

        {/* Main Area */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          
          {/* Toolbar */}
          <div className="h-10 border-b border-border flex items-center justify-between px-4 bg-muted/20">
            <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-1 hover:bg-accent rounded text-muted-foreground"
                  title="Toggle Sidebar"
                >
                    <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 3C1.22386 3 1 3.22386 1 3.5V11.5C1 11.7761 1.22386 12 1.5 12H13.5C13.7761 12 14 11.7761 14 11.5V3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 3.5C1 2.67157 1.67157 2 2.5 2H12.5C13.3284 2 14 2.67157 14 3.5V11.5C14 12.3284 13.3284 13 12.5 13H2.5C1.67157 13 1 12.3284 1 11.5V3.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path><path d="M5 3V12H4V3H5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </button>
                <span className="text-sm text-muted-foreground truncate">
                  {activeFile ? activeFile.name : "No file selected"}
                </span>
            </div>

            <div className="flex items-center gap-1 border border-input rounded-md overflow-hidden bg-background">
                <button
                  onClick={() => setViewMode("editor")}
                  className={cn(
                    "p-1.5 hover:bg-accent transition-colors",
                    viewMode === "editor" && "bg-accent text-accent-foreground"
                  )}
                  title="Editor Only"
                >
                  <Code2 size={16} />
                </button>
                <button
                  onClick={() => setViewMode("split")}
                  className={cn(
                    "p-1.5 hover:bg-accent transition-colors",
                    viewMode === "split" && "bg-accent text-accent-foreground"
                  )}
                  title="Split View"
                >
                  <Columns size={16} />
                </button>
                <button
                  onClick={() => setViewMode("preview")}
                  className={cn(
                    "p-1.5 hover:bg-accent transition-colors",
                    viewMode === "preview" && "bg-accent text-accent-foreground"
                  )}
                  title="Preview Only"
                >
                  <Eye size={16} />
                </button>
            </div>
          </div>

          {/* Editor/Preview Area */}
          <div className="flex-1 flex overflow-hidden relative">
            {activeFile && activeFile.type === 'file' ? (
                <>
                    {(viewMode === "split" || viewMode === "editor") && (
                      <div className={cn(
                        "h-full border-r border-border transition-all",
                        viewMode === "split" ? "w-1/2" : "w-full"
                      )}>
                        <MarkdownEditor 
                            value={activeFile.content} 
                            onChange={handleContentChange} 
                        />
                      </div>
                    )}

                    {(viewMode === "split" || viewMode === "preview") && (
                      <div className={cn(
                        "h-full bg-background transition-all",
                        viewMode === "split" ? "w-1/2" : "w-full"
                      )}>
                        <MarkdownPreview content={activeFile.content} />
                      </div>
                    )}
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    {activeFile && activeFile.type === 'folder' 
                        ? "Select a file to edit" 
                        : "Select or create a file to start editing"}
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
