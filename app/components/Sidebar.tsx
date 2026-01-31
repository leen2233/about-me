'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
  FolderOpen,
  FolderClosed,
  File,
  FileText,
  Code,
  Braces,
  FileJson,
  Globe
} from 'lucide-react';
import type { FileNode } from '../lib/tree';

interface SidebarProps {
  fileTree: FileNode[];
}

function getFileIcon(name: string): React.ReactNode {
  const ext = name.split('.').pop();
  const iconClass = "w-4 h-4";

  switch (ext) {
    case 'md':
      return <FileText className={iconClass} />;
    case 'js':
      return <Code className={iconClass} />;
    case 'ts':
      return <Braces className={iconClass} />;
    case 'css':
      return <File className={iconClass} />;
    case 'html':
      return <Globe className={iconClass} />;
    case 'json':
      return <FileJson className={iconClass} />;
    default:
      return <File className={iconClass} />;
  }
}

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const pathname = usePathname();
  const isActive = node.path === pathname;
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (node.type === 'folder') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      {/* Node */}
      <Link
        href={node.path}
        onClick={handleClick}
        className={`
          flex items-center gap-2 py-0.5 px-2 text-sm
          transition-colors duration-150 rounded
          ${isActive
            ? 'bg-[#504945] text-[#ebdbb2]'
            : 'text-[#ebdbb2] hover:bg-[#504945]'
          }
        `}
        style={{ paddingLeft: `${depth * 1 + 0.5}rem` }}
      >
        {/* Arrow for folders */}
        {node.type === 'folder' && (
          <span className="text-[#3FC5FF] shrink-0">
            {isExpanded ? (
              <ChevronRight className="w-3 h-3 rotate-90" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </span>
        )}

        {/* File/folder icon */}
        <span className="text-[#ebdbb2] shrink-0">
          {node.type === 'folder'
            ? (isExpanded ? <FolderOpen className="w-4 h-4 text-[#8ec07c]" /> : <FolderClosed className="w-4 h-4 text-[#8ec07c]" />)
            : getFileIcon(node.name)}
        </span>

        {/* Name */}
        <span>{node.name}</span>
      </Link>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <FileTreeNode key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ fileTree }: SidebarProps) {
  return (
    <aside
      className={`
        w-[35ch] h-full bg-[#282828] border-r border-[#504945]
        overflow-y-auto flex-shrink-0
      `}
      aria-label="File navigation"
    >
      {/* Header */}
      <div className="px-3 py-2 text-xs text-[#a89984] border-b border-[#504945]">
        ~/projects/sp/blog/..
      </div>

      {/* File tree */}
      <nav className="py-1" aria-label="Content folders">
        {fileTree.map((node) => (
          <FileTreeNode key={node.path} node={node} />
        ))}
      </nav>
    </aside>
  );
}
