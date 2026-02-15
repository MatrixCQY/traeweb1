import fs from 'fs';
import path from 'path';
import { FileNode } from '@/hooks/use-file-system';

const POSTS_DIR = path.join(process.cwd(), 'src/posts');

export function getStaticPosts(): Record<string, FileNode> {
  // Create posts directory if it doesn't exist
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    return {};
  }

  const files = fs.readdirSync(POSTS_DIR);
  const posts: Record<string, FileNode> = {};

  files.forEach((filename) => {
    if (!filename.endsWith('.md')) return;

    const filePath = path.join(POSTS_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const id = `post-${filename.replace(/\.md$/, '').toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    
    posts[id] = {
      id,
      name: filename,
      type: 'file',
      parentId: null, // Root level
      content,
      createdAt: Date.now(), // This will update on build, which is fine
    };
  });

  return posts;
}
