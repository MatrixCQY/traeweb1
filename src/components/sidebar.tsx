"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  File as FileIcon,
  Folder as FolderIcon,
  FolderOpen,
  Plus,
  Trash2,
  Edit2,
  MoreVertical,
  FilePlus,
  FolderPlus,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FileNode, FileSystemContextType } from "@/hooks/use-file-system";

interface SidebarProps {
  fileSystem: FileSystemContextType;
  className?: string;
}

export function Sidebar({ fileSystem, className }: SidebarProps) {
  const { files, createFile, createFolder } = fileSystem;

  const handleCreateFile = () => {
    const name = prompt("Enter file name:", "Untitled.md");
    if (name) createFile(null, name);
  };

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:", "New Folder");
    if (name) createFolder(null, name);
  };

  // Get root nodes
  const rootNodes = Object.values(files).filter((node) => node.parentId === null);
  // Sort: Folders first, then files, alphabetical
  rootNodes.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'folder' ? -1 : 1;
  });

  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border", className)}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <span className="font-semibold text-sm text-muted-foreground">EXPLORER</span>
        <div className="flex gap-1">
          <button onClick={handleCreateFile} className="p-1 hover:bg-accent rounded" title="New File">
            <FilePlus size={16} />
          </button>
          <button onClick={handleCreateFolder} className="p-1 hover:bg-accent rounded" title="New Folder">
            <FolderPlus size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {rootNodes.map((node) => (
          <FileTreeNode key={node.id} node={node} fileSystem={fileSystem} depth={0} />
        ))}
        {rootNodes.length === 0 && (
          <div className="text-center text-xs text-muted-foreground mt-4">
            No files. Create one!
          </div>
        )}
      </div>
    </div>
  );
}

interface FileTreeNodeProps {
  node: FileNode;
  fileSystem: FileSystemContextType;
  depth: number;
}

function FileTreeNode({ node, fileSystem, depth }: FileTreeNodeProps) {
  // Destructure fileSystem properties including downloadFile
  const { files, selectFile, activeFileId, toggleFolder, deleteNode, renameNode, createFile, createFolder, downloadFile } = fileSystem;
  const [isHovered, setIsHovered] = useState(false);

  const isActive = activeFileId === node.id;
  const childNodes = Object.values(files).filter((n) => n.parentId === node.id);
  
  // Sort children
  childNodes.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'folder' ? -1 : 1;
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      toggleFolder(node.id);
    } else {
      selectFile(node.id);
    }
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = prompt("Rename to:", node.name);
    if (newName) renameNode(node.id, newName);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete ${node.name}?`)) {
      deleteNode(node.id);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadFile(node.id);
  };

  const handleAddFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    const name = prompt("Enter file name:", "Untitled.md");
    if (name) {
        createFile(node.id, name);
        if (!node.isOpen) toggleFolder(node.id);
    }
  };

    const handleAddFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const name = prompt("Enter folder name:", "New Folder");
    if (name) {
        createFolder(node.id, name);
        if (!node.isOpen) toggleFolder(node.id);
    }
  };


  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center py-1 px-2 rounded cursor-pointer text-sm group",
          isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 text-foreground"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="mr-1 text-muted-foreground">
          {node.type === 'folder' && (
            node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          )}
          {node.type === 'file' && <FileIcon size={14} />}
        </span>
        <span className="truncate flex-1">{node.name}</span>
        
        {/* Actions - visible on hover */}
        <div className={cn("flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", isHovered ? "opacity-100" : "")}>
           {node.type === 'folder' && (
            <>
               <button onClick={handleAddFile} className="p-0.5 hover:bg-background rounded" title="New File">
                <FilePlus size={12} />
              </button>
               <button onClick={handleAddFolder} className="p-0.5 hover:bg-background rounded" title="New Folder">
                <FolderPlus size={12} />
              </button>
            </>
          )}
          {node.type === 'file' && (
            <button onClick={handleDownload} className="p-0.5 hover:bg-background rounded" title="Download">
              <Download size={12} />
            </button>
          )}
          <button onClick={handleRename} className="p-0.5 hover:bg-background rounded" title="Rename">
            <Edit2 size={12} />
          </button>
          <button onClick={handleDelete} className="p-0.5 hover:bg-background rounded text-destructive" title="Delete">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {node.type === 'folder' && node.isOpen && (
        <div>
          {childNodes.map((child) => (
            <FileTreeNode key={child.id} node={child} fileSystem={fileSystem} depth={depth + 1} />
          ))}
          {childNodes.length === 0 && (
             <div className="text-[10px] text-muted-foreground py-1" style={{ paddingLeft: `${(depth + 1) * 12 + 24}px` }}>
                Empty
             </div>
          )}
        </div>
      )}
    </div>
  );
}
