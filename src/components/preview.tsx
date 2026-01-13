"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

interface PreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: PreviewProps) {
  return (
    <div className={cn("h-full w-full overflow-y-auto p-4 bg-background text-foreground transition-colors duration-200", className)}>
      <article className="prose max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-pre:bg-transparent prose-pre:p-0">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
          components={{
            // Customize code blocks if needed, usually prose handles it well
            // but we want to ensure syntax highlighting works nicely
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <code className={className} {...props}>
                  {children}
                </code>
              ) : (
                <code className={cn("bg-muted px-1 py-0.5 rounded font-mono text-sm", className)} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
