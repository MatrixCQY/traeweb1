"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Moon, Sun, Github, File as FileIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { FileSystemContextType, FileNode } from "@/hooks/use-file-system";

interface NavbarProps {
  fileSystem: FileSystemContextType;
}

export function Navbar({ fileSystem }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const { searchFiles, selectFile } = fileSystem;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FileNode[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query) {
      const hits = searchFiles(query);
      setResults(hits);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query, searchFiles]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    selectFile(id);
    setQuery("");
    setShowResults(false);
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-primary text-primary-foreground p-1 rounded font-bold text-xs">
          MS
        </div>
        <span className="font-bold text-lg tracking-tight hidden sm:inline-block">MathStudio</span>
      </div>

      <div className="flex-1 max-w-md mx-2 sm:mx-4 relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-muted/50 border border-input rounded-md pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowResults(true)}
          />
        </div>

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {results.length > 0 ? (
              results.map((node) => (
                <button
                  key={node.id}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center gap-2"
                  onClick={() => handleSelect(node.id)}
                >
                  <FileIcon size={14} className="text-muted-foreground" />
                  <span className="truncate">{node.name}</span>
                  {node.type === 'file' && (
                    <span className="text-xs text-muted-foreground ml-auto truncate max-w-[100px]">
                      {node.content.substring(0, 20)}...
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="p-3 text-sm text-muted-foreground text-center">
                No results found.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          <Github size={20} />
        </a>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
