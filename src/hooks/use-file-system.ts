import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type FileType = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null;
  content: string;
  isOpen?: boolean; // For folders
  createdAt: number;
}

export interface FileSystemContextType {
  files: Record<string, FileNode>;
  activeFileId: string | null;
  createFile: (parentId: string | null, name: string) => void;
  createFolder: (parentId: string | null, name: string) => void;
  deleteNode: (id: string) => void;
  renameNode: (id: string, newName: string) => void;
  updateFileContent: (id: string, content: string) => void;
  selectFile: (id: string) => void;
  toggleFolder: (id: string) => void;
  searchFiles: (query: string) => FileNode[];
}

const STORAGE_KEY = 'mathstudio-fs-v1';

const INITIAL_FILES: Record<string, FileNode> = {
  'root-welcome': {
    id: 'root-welcome',
    name: 'Welcome.md',
    type: 'file',
    parentId: null,
    content: `# MathStudio

Welcome to **MathStudio**, a professional Markdown editor designed for mathematics and coding.

## Features

- **LaTeX Support**: $E = mc^2$ or
  $$
  \\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
  $$
- **Code Highlighting**:
  \`\`\`python
  def hello():
      print("Hello, World!")
  \`\`\`
- **Live Preview**: See your changes instantly.
- **Dark Mode**: Easy on your eyes.

## File System
- You can create files and folders.
- Files are saved locally.
`,
    createdAt: Date.now(),
  },
};

export function useFileSystem() {
  const [files, setFiles] = useState<Record<string, FileNode>>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState<string | null>('root-welcome');
  const [mounted, setMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFiles(parsed.files || INITIAL_FILES);
        // Validate activeFileId
        if (parsed.activeFileId && parsed.files[parsed.activeFileId]) {
          setActiveFileId(parsed.activeFileId);
        }
      } catch (e) {
        console.error('Failed to load file system', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ files, activeFileId }));
    }
  }, [files, activeFileId, mounted]);

  const createFile = useCallback((parentId: string | null, name: string) => {
    const id = uuidv4();
    const newFile: FileNode = {
      id,
      name,
      type: 'file',
      parentId,
      content: '',
      createdAt: Date.now(),
    };
    setFiles((prev) => ({ ...prev, [id]: newFile }));
    setActiveFileId(id);
    return id;
  }, []);

  const createFolder = useCallback((parentId: string | null, name: string) => {
    const id = uuidv4();
    const newFolder: FileNode = {
      id,
      name,
      type: 'folder',
      parentId,
      content: '',
      isOpen: true,
      createdAt: Date.now(),
    };
    setFiles((prev) => ({ ...prev, [id]: newFolder }));
    return id;
  }, []);

  const deleteNode = useCallback((id: string) => {
    setFiles((prev) => {
      const next = { ...prev };
      
      // Helper to collect all descendants
      const toDelete = new Set<string>([id]);
      const findDescendants = (parentId: string) => {
        Object.values(next).forEach((node) => {
          if (node.parentId === parentId) {
            toDelete.add(node.id);
            if (node.type === 'folder') {
              findDescendants(node.id);
            }
          }
        });
      };
      findDescendants(id);

      toDelete.forEach((nodeId) => {
        delete next[nodeId];
      });

      return next;
    });

    if (activeFileId === id) {
      setActiveFileId(null);
    }
  }, [activeFileId]);

  const renameNode = useCallback((id: string, newName: string) => {
    setFiles((prev) => ({
      ...prev,
      [id]: { ...prev[id], name: newName },
    }));
  }, []);

  const updateFileContent = useCallback((id: string, content: string) => {
    setFiles((prev) => {
        if (!prev[id]) return prev;
        return {
            ...prev,
            [id]: { ...prev[id], content },
        }
    });
  }, []);

  const selectFile = useCallback((id: string) => {
    setActiveFileId(id);
  }, []);

  const toggleFolder = useCallback((id: string) => {
    setFiles((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: !prev[id].isOpen },
    }));
  }, []);

  const searchFiles = useCallback((query: string) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return Object.values(files).filter(
      (node) =>
        node.name.toLowerCase().includes(lowerQuery) ||
        (node.type === 'file' && node.content.toLowerCase().includes(lowerQuery))
    );
  }, [files]);

  const downloadFile = useCallback((id: string) => {
    const node = files[id];
    if (!node || node.type !== 'file') return;

    const blob = new Blob([node.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = node.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [files]);

  return {
    files,
    activeFileId,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    updateFileContent,
    selectFile,
    toggleFolder,
    searchFiles,
    downloadFile,
  };
}
