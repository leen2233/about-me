import fs from 'fs';
import path from 'path';

const contentDirectory = path.join(process.cwd(), 'content');

export interface FileNode {
  name: string;
  type: 'folder' | 'file';
  path: string;
  children?: FileNode[];
}

function buildFileTree(dir: string, basePath = ''): FileNode[] {
  const nodes: FileNode[] = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const relativePath = path.join(basePath, file);

    if (stat.isDirectory()) {
      const children = buildFileTree(filePath, relativePath);
      nodes.push({
        name: file,
        type: 'folder',
        path: '/' + relativePath,
        children: children.length > 0 ? children : undefined,
      });
    } else if (file.endsWith('.md')) {
      // Remove .md extension for the route path
      let routePath = relativePath.replace(/\.md$/, '');

      // Special mappings for root-level files
      if (routePath === 'index') {
        routePath = ''; // Maps to /
      }

      nodes.push({
        name: file,
        type: 'file',
        path: '/' + routePath,
      });
    }
  }

  // Sort: directories first, then files, both alphabetically
  return nodes.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

export function getFileTree(): FileNode[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  return buildFileTree(contentDirectory);
}

export async function getFileTreeAsync(): Promise<FileNode[]> {
  return getFileTree();
}
